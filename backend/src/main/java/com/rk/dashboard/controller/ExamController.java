package com.rk.dashboard.controller;

import com.rk.dashboard.model.QuestionDTO;
import com.rk.dashboard.model.QuestionRow;
import com.rk.dashboard.model.SubmitAttemptRequest;
import com.rk.dashboard.model.SubmitAttemptResponse;
import com.rk.dashboard.repository.ExamRepository;
import com.rk.dashboard.repository.UserRepository;
import com.rk.dashboard.service.QuestionParserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/exam")
public class ExamController {

    private final ExamRepository examRepository;
    private final QuestionParserService parserService;
    private final UserRepository userRepository;

    public ExamController(ExamRepository examRepository, QuestionParserService parserService, UserRepository userRepository) {
        this.examRepository = examRepository;
        this.parserService = parserService;
        this.userRepository = userRepository;
    }

    /**
     * Admin uploads a question paper (Excel or PDF).
     * Replaces any existing questions for that assessment.
     * POST /api/v1/exam/{assessmentId}/upload
     */
    @PostMapping("/{assessmentId}/upload")
    public ResponseEntity<Map<String, Object>> uploadQuestions(
            @PathVariable int assessmentId,
            @RequestParam("file") MultipartFile file) {
        try {
            String filename = file.getOriginalFilename();
            List<QuestionRow> rows;
            if (filename != null && filename.toLowerCase().endsWith(".pdf")) {
                rows = parserService.parsePdf(file, assessmentId);
            } else {
                rows = parserService.parseExcel(file, assessmentId);
            }

            examRepository.deleteQuestionsForAssessment(assessmentId);
            int saved = examRepository.saveQuestions(rows);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "questionsUploaded", saved,
                "message", saved + " questions saved for assessment " + assessmentId
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Parse error: " + e.getMessage()
            ));
        }
    }

    /**
     * Students fetch questions (no correctAnswer).
     * GET /api/v1/exam/{assessmentId}/questions
     */
    @GetMapping("/{assessmentId}/questions")
    public ResponseEntity<?> getQuestions(@PathVariable int assessmentId, @RequestParam(defaultValue = "ALL") String college) {
        try {
            return ResponseEntity.ok(examRepository.getQuestionsForExam(assessmentId, college));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Students submit answers after completing the exam.
     * POST /api/v1/exam/{assessmentId}/submit
     */
    @PostMapping("/{assessmentId}/submit")
    public ResponseEntity<?> submitExam(
            @PathVariable int assessmentId,
            @RequestBody SubmitAttemptRequest req) {
        try {
            SubmitAttemptResponse result = examRepository.scoreAndSaveAttempt(assessmentId, req);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to save attempt: " + e.getMessage(),
                "details", e.getClass().getSimpleName()
            ));
        }
    }
}
