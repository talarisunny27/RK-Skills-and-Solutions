package com.rk.dashboard.repository;

import com.rk.dashboard.model.AdminStatsDTO;
import com.rk.dashboard.model.AttemptResultDTO;
import com.rk.dashboard.model.DashboardStats;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

@Repository
public class DashboardRepository {

    private final DSLContext dsl;

    public DashboardRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public AdminStatsDTO getAdminStats() {
        int totalStudents = dsl.fetchCount(com.rk.dashboard.jooq.tables.Users.USERS);
        int questionsBank = dsl.fetchCount(com.rk.dashboard.jooq.tables.Questions.QUESTIONS);
        int activeTests = dsl.fetchCount(com.rk.dashboard.jooq.tables.Assessments.ASSESSMENTS);

        var accuracyData = dsl.select(
                DSL.sum(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.RIGHT_ANSWERS).as("total_right"),
                DSL.sum(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.WRONG_ANSWERS).as("total_wrong")
            )
            .from(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS)
            .fetchOne();

        int totalRight = accuracyData != null && accuracyData.get("total_right") != null ? accuracyData.get("total_right", java.math.BigDecimal.class).intValue() : 0;
        int totalWrong = accuracyData != null && accuracyData.get("total_wrong") != null ? accuracyData.get("total_wrong", java.math.BigDecimal.class).intValue() : 0;
        String avgAccuracy = calculateAccuracy(totalRight, totalWrong);

        java.util.List<AttemptResultDTO> recentActivity = dsl.select(
                com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.ID,
                com.rk.dashboard.jooq.tables.Assessments.ASSESSMENTS.TITLE,
                com.rk.dashboard.jooq.tables.Assessments.ASSESSMENTS.DATE,
                DSL.cast(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.ATTEMPT_DATE, String.class).as("submittedAt"),
                DSL.val(1).as("attempt"),
                DSL.concat(
                    DSL.round(
                        DSL.cast(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.RIGHT_ANSWERS, Double.class)
                            .div(
                                DSL.cast(
                                    com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.RIGHT_ANSWERS.add(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.WRONG_ANSWERS),
                                    Double.class
                                ).nullif(0.0)
                            ).mul(100)
                    ), DSL.val("%")
                ).as("accuracy"),
                com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.SCORE,
                DSL.val(1).as("rank")
            )
            .from(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS)
            .join(com.rk.dashboard.jooq.tables.Assessments.ASSESSMENTS)
                .on(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.ASSESSMENT_ID.eq(com.rk.dashboard.jooq.tables.Assessments.ASSESSMENTS.ID))
            .orderBy(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.ATTEMPT_DATE.desc())
            .limit(5)
            .fetchInto(AttemptResultDTO.class);

        return new AdminStatsDTO(totalStudents, questionsBank, activeTests, avgAccuracy, recentActivity);
    }

    public DashboardStats getStatsForUser(String userId) {
        // 1. Overall stats
        var overall = dsl.select(
            org.jooq.impl.DSL.count().as("tests_taken"),
            org.jooq.impl.DSL.sum(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.SCORE).as("total_score"),
            org.jooq.impl.DSL.sum(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.RIGHT_ANSWERS).as("total_right"),
            org.jooq.impl.DSL.sum(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.WRONG_ANSWERS).as("total_wrong")
        )
        .from(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS)
        .where(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.USER_ID.eq(userId))
        .fetchOne();

        int testsTaken = overall != null && overall.get("tests_taken") != null ? overall.get("tests_taken", Integer.class) : 0;
        int totalScore = overall != null && overall.get("total_score") != null ? overall.get("total_score", java.math.BigDecimal.class).intValue() : 0;
        int totalRight = overall != null && overall.get("total_right") != null ? overall.get("total_right", java.math.BigDecimal.class).intValue() : 0;
        int totalWrong = overall != null && overall.get("total_wrong") != null ? overall.get("total_wrong", java.math.BigDecimal.class).intValue() : 0;
        
        String avgAccuracy = calculateAccuracy(totalRight, totalWrong);

        // 2. Today's stats
        var today = dsl.select(
            org.jooq.impl.DSL.sum(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.RIGHT_ANSWERS).as("today_right"),
            org.jooq.impl.DSL.sum(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.WRONG_ANSWERS).as("today_wrong")
        )
        .from(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS)
        .where(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.USER_ID.eq(userId))
        .and(org.jooq.impl.DSL.cast(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.ATTEMPT_DATE, java.sql.Date.class).eq(org.jooq.impl.DSL.currentDate()))
        .fetchOne();

        int todayRight = today != null && today.get("today_right") != null ? today.get("today_right", java.math.BigDecimal.class).intValue() : 0;
        int todayWrong = today != null && today.get("today_wrong") != null ? today.get("today_wrong", java.math.BigDecimal.class).intValue() : 0;
        
        String todayAccuracy = calculateAccuracy(todayRight, todayWrong);

        // 3. Rank calculation
        var userScores = org.jooq.impl.DSL.select(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.USER_ID, org.jooq.impl.DSL.sum(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.SCORE).as("user_score"))
            .from(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS)
            .groupBy(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.USER_ID)
            .asTable("user_scores");
            
        var rankedUsers = org.jooq.impl.DSL.select(
                userScores.field(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.USER_ID),
                org.jooq.impl.DSL.rank().over(org.jooq.impl.DSL.orderBy(userScores.field("user_score").desc())).as("user_rank")
            )
            .from(userScores)
            .asTable("ranked_users");
            
        Integer userRank = dsl.select(rankedUsers.field("user_rank", Integer.class))
            .from(rankedUsers)
            .where(rankedUsers.field(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.USER_ID).eq(userId))
            .fetchOneInto(Integer.class);
            
        int totalUsers = dsl.fetchCount(org.jooq.impl.DSL.selectDistinct(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.USER_ID).from(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS));
        
        String rankStr = (userRank != null ? userRank : "-") + "/" + (totalUsers > 0 ? totalUsers : "-");

        return new DashboardStats(testsTaken, avgAccuracy, totalScore, rankStr, todayRight, todayWrong, todayAccuracy);
    }
    
    private String calculateAccuracy(int right, int wrong) {
        if (right + wrong == 0) return "0%";
        int percentage = (int) Math.round((double) right / (right + wrong) * 100);
        return percentage + "%";
    }
}
