package com.rk.dashboard.repository;

import com.rk.dashboard.model.AttemptResultDTO;
import com.rk.dashboard.model.ResultsDataDTO;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.ArrayList;

import static com.rk.dashboard.jooq.tables.Assessments.ASSESSMENTS;
import static com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS;

@Repository
public class ResultsRepository {

    private final DSLContext dsl;
    private final DashboardRepository dashboardRepository;

    public ResultsRepository(DSLContext dsl, DashboardRepository dashboardRepository) {
        this.dsl = dsl;
        this.dashboardRepository = dashboardRepository;
    }

    public ResultsDataDTO getResultsForUser(String userId) {
        // We can reuse logic from DashboardRepository for basic stats, or recalculate.
        // Let's query them freshly to match exactly what is needed for ResultsDataDTO.
        
        var statsQuery = dsl.select(
            org.jooq.impl.DSL.sum(USER_ATTEMPTS.SCORE).as("total_score"),
            org.jooq.impl.DSL.count().as("submitted_tests"),
            org.jooq.impl.DSL.max(USER_ATTEMPTS.SCORE).as("best_score"),
            org.jooq.impl.DSL.sum(USER_ATTEMPTS.RIGHT_ANSWERS).as("total_right"),
            org.jooq.impl.DSL.sum(USER_ATTEMPTS.WRONG_ANSWERS).as("total_wrong")
        )
        .from(USER_ATTEMPTS)
        .where(USER_ATTEMPTS.USER_ID.eq(userId))
        .fetchOne();
        
        int totalScore = statsQuery != null && statsQuery.get("total_score") != null ? statsQuery.get("total_score", java.math.BigDecimal.class).intValue() : 0;
        int submittedTests = statsQuery != null && statsQuery.get("submitted_tests") != null ? statsQuery.get("submitted_tests", Integer.class) : 0;
        int bestScore = statsQuery != null && statsQuery.get("best_score") != null ? statsQuery.get("best_score", Integer.class) : 0;
        int totalRight = statsQuery != null && statsQuery.get("total_right") != null ? statsQuery.get("total_right", java.math.BigDecimal.class).intValue() : 0;
        int totalWrong = statsQuery != null && statsQuery.get("total_wrong") != null ? statsQuery.get("total_wrong", java.math.BigDecimal.class).intValue() : 0;
        
        String avgAccuracy = "0%";
        if (totalRight + totalWrong > 0) {
            avgAccuracy = Math.round((double) totalRight / (totalRight + totalWrong) * 100) + "%";
        }

        // We can grab the rank string from the dashboard repository to reuse rank calculation
        String rank = dashboardRepository.getStatsForUser(userId).rank();

        ResultsDataDTO.Stats stats = new ResultsDataDTO.Stats(totalScore, submittedTests, avgAccuracy, bestScore, rank, submittedTests);
        
        // Mock achievements based on data for now
        List<ResultsDataDTO.Achievement> achievements = new ArrayList<>();
        achievements.add(new ResultsDataDTO.Achievement("Top 10%", bestScore >= 90 ? "Earned" : "In Progress", "bg-yellow-500"));
        achievements.add(new ResultsDataDTO.Achievement("Consistent Learner", submittedTests >= 2 ? "Earned" : "In Progress", "bg-green-500"));
        achievements.add(new ResultsDataDTO.Achievement("Speed Demon", "In Progress", "bg-blue-500"));

        // Activity Feed
        List<AttemptResultDTO> activityFeed = dsl.select(
                USER_ATTEMPTS.ID,
                ASSESSMENTS.TITLE,
                org.jooq.impl.DSL.cast(USER_ATTEMPTS.ATTEMPT_DATE, String.class).as("date"),
                org.jooq.impl.DSL.cast(USER_ATTEMPTS.ATTEMPT_DATE, String.class).as("submittedAt"),
                org.jooq.impl.DSL.val(1).as("attempt"), // default hardcoded for now, would require group by or subquery in real scenario
                org.jooq.impl.DSL.concat(
                    org.jooq.impl.DSL.cast(
                        org.jooq.impl.DSL.round(
                            USER_ATTEMPTS.RIGHT_ANSWERS.cast(Double.class)
                            .div(org.jooq.impl.DSL.nullif(USER_ATTEMPTS.RIGHT_ANSWERS.add(USER_ATTEMPTS.WRONG_ANSWERS), 0))
                            .mul(100)
                        ), String.class
                    ),
                    org.jooq.impl.DSL.val("%")
                ).as("accuracy"),
                USER_ATTEMPTS.SCORE,
                org.jooq.impl.DSL.val(1).as("rank") // hardcoded mock rank inside specific test for now
            )
            .from(USER_ATTEMPTS)
            .join(ASSESSMENTS).on(USER_ATTEMPTS.ASSESSMENT_ID.eq(ASSESSMENTS.ID))
            .where(USER_ATTEMPTS.USER_ID.eq(userId))
            .orderBy(USER_ATTEMPTS.ATTEMPT_DATE.desc())
            .fetchInto(AttemptResultDTO.class);
            
        return new ResultsDataDTO(stats, achievements, activityFeed);
    }
}
