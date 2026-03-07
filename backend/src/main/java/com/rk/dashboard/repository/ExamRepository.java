package com.rk.dashboard.repository;

import com.rk.dashboard.model.QuestionDTO;
import com.rk.dashboard.model.QuestionRow;
import com.rk.dashboard.model.SubmitAttemptRequest;
import com.rk.dashboard.model.SubmitAttemptResponse;
import com.rk.dashboard.model.QuestionResultDTO;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.rk.dashboard.jooq.tables.Questions.QUESTIONS;
import static com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS;

@Repository
public class ExamRepository {

    private final DSLContext dsl;
    private final UserRepository userRepository;

    public ExamRepository(DSLContext dsl, UserRepository userRepository) {
        this.dsl = dsl;
        this.userRepository = userRepository;
    }

    /** Returns questions for the exam without correctAnswer. */
    public List<QuestionDTO> getQuestionsForExam(int assessmentId, String college) {
        String examCollege = dsl.select(com.rk.dashboard.jooq.tables.Assessments.ASSESSMENTS.COLLEGE)
                                .from(com.rk.dashboard.jooq.tables.Assessments.ASSESSMENTS)
                                .where(com.rk.dashboard.jooq.tables.Assessments.ASSESSMENTS.ID.eq(assessmentId))
                                .fetchOneInto(String.class);

        if (examCollege != null && !examCollege.equals("ALL") && !examCollege.equalsIgnoreCase(college)) {
            throw new SecurityException("You do not have permission to access tests assigned to " + examCollege);
        }

        return dsl.select(
                QUESTIONS.ID,
                QUESTIONS.ASSESSMENT_ID,
                QUESTIONS.SECTION,
                QUESTIONS.TEXT,
                QUESTIONS.OPTION_A,
                QUESTIONS.OPTION_B,
                QUESTIONS.OPTION_C,
                QUESTIONS.OPTION_D,
                QUESTIONS.DIFFICULTY
            )
            .from(QUESTIONS)
            .where(QUESTIONS.ASSESSMENT_ID.eq(assessmentId))
            .orderBy(QUESTIONS.ID.asc())
            .fetchInto(QuestionDTO.class);
    }

    /** Total question count for an assessment. */
    public int getQuestionCount(int assessmentId) {
        return dsl.fetchCount(QUESTIONS, QUESTIONS.ASSESSMENT_ID.eq(assessmentId));
    }

    /** Deletes all existing questions before re-upload. */
    @Transactional
    public void deleteQuestionsForAssessment(int assessmentId) {
        dsl.deleteFrom(QUESTIONS)
           .where(QUESTIONS.ASSESSMENT_ID.eq(assessmentId))
           .execute();
    }

    /** Batch-inserts parsed question rows (including correctAnswer) into the DB. */
    @Transactional
    public int saveQuestions(List<QuestionRow> rows) {
        if (rows.isEmpty()) return 0;
        int[] results = dsl.batch(
            rows.stream().map(q ->
                dsl.insertInto(QUESTIONS,
                        QUESTIONS.ASSESSMENT_ID, QUESTIONS.SECTION, QUESTIONS.TEXT,
                        QUESTIONS.OPTION_A, QUESTIONS.OPTION_B,
                        QUESTIONS.OPTION_C, QUESTIONS.OPTION_D,
                        QUESTIONS.CORRECT_ANSWER, QUESTIONS.DIFFICULTY)
                   .values(q.assessmentId(), q.section(), q.text(),
                           q.optionA(), q.optionB(), q.optionC(), q.optionD(),
                           q.correctAnswer(), q.difficulty())
            ).toList()
        ).execute();
        return results.length;
    }

    /** Scores submitted answers, writes to user_attempts, returns summary. */
    @Transactional
    public SubmitAttemptResponse scoreAndSaveAttempt(int assessmentId, SubmitAttemptRequest req) {
        // 1. Ensure User exists in our DB (idempotent) to avoid FK violation
        userRepository.upsertUser(new com.rk.dashboard.model.UserDTO(
            req.userId(), "student@rk.com", "Student", "TKR College"
        ));

        // 2. Fetch correct answers
        Map<Integer, String> correctAnswers = dsl
            .select(QUESTIONS.ID, QUESTIONS.CORRECT_ANSWER)
            .from(QUESTIONS)
            .where(QUESTIONS.ASSESSMENT_ID.eq(assessmentId))
            .fetchMap(QUESTIONS.ID, QUESTIONS.CORRECT_ANSWER);

        int right = 0, wrong = 0;
        List<QuestionResultDTO> questionResults = new ArrayList<>();

        for (Map.Entry<Integer, String> entry : correctAnswers.entrySet()) {
            int qId = entry.getKey();
            String correct = entry.getValue() != null ? entry.getValue().trim() : "";
            
            String userAns = req.answers().get(qId);
            boolean isCorrect = false;

            if (userAns != null && !userAns.trim().isEmpty()) {
                if (correct.equalsIgnoreCase(userAns.trim())) {
                    isCorrect = true;
                    right++;
                } else {
                    wrong++;
                }
            }
            
            questionResults.add(new QuestionResultDTO(qId, userAns, correct, isCorrect));
        }

        int total = correctAnswers.size();
        int score = right * 10;
        String pct = total > 0 ? Math.round((double) right / total * 100) + "%" : "0%";

        // 3. Save attempt
        dsl.insertInto(USER_ATTEMPTS,
                USER_ATTEMPTS.USER_ID, USER_ATTEMPTS.ASSESSMENT_ID,
                USER_ATTEMPTS.SCORE, USER_ATTEMPTS.RIGHT_ANSWERS, USER_ATTEMPTS.WRONG_ANSWERS)
            .values(req.userId(), assessmentId, score, right, wrong)
            .execute();

        return new SubmitAttemptResponse(score, right, wrong, total, pct, questionResults);
    }
}
