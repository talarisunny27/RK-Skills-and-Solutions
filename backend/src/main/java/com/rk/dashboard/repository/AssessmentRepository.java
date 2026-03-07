package com.rk.dashboard.repository;

import com.rk.dashboard.model.AssessmentDTO;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static com.rk.dashboard.jooq.tables.Assessments.ASSESSMENTS;
import static com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS;

@Repository
public class AssessmentRepository {

    private final DSLContext dsl;

    public AssessmentRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    // ── Student view: status computed per user ────────────────────────────
    public List<AssessmentDTO> getAssessmentsForUser(String userId, String college) {
        return dsl.select(
                ASSESSMENTS.ID,
                ASSESSMENTS.TITLE,
                ASSESSMENTS.TYPE,
                ASSESSMENTS.DATE,
                ASSESSMENTS.DURATION,
                ASSESSMENTS.SCHEDULE,
                org.jooq.impl.DSL.when(USER_ATTEMPTS.ID.isNotNull(), "Attempted")
                    .when(org.jooq.impl.DSL.cast(ASSESSMENTS.DATE, java.sql.Date.class)
                        .gt(org.jooq.impl.DSL.currentDate()), "Upcoming")
                    .otherwise("Not Attempted").as("status"),
                org.jooq.impl.DSL.val("").as("image"),
                ASSESSMENTS.DESCRIPTION,
                ASSESSMENTS.COLLEGE
            )
            .from(ASSESSMENTS)
            .leftJoin(USER_ATTEMPTS)
                .on(ASSESSMENTS.ID.eq(USER_ATTEMPTS.ASSESSMENT_ID)
                    .and(USER_ATTEMPTS.USER_ID.eq(userId)))
            .where(ASSESSMENTS.COLLEGE.eq("ALL").or(ASSESSMENTS.COLLEGE.eq(college)))
            .orderBy(ASSESSMENTS.DATE.asc())
            .fetchInto(AssessmentDTO.class);
    }

    // ── Admin view: all assessments, no user filter ───────────────────────
    public List<AssessmentDTO> getAllAssessments() {
        return dsl.select(
                ASSESSMENTS.ID,
                ASSESSMENTS.TITLE,
                ASSESSMENTS.TYPE,
                ASSESSMENTS.DATE,
                ASSESSMENTS.DURATION,
                ASSESSMENTS.SCHEDULE,
                org.jooq.impl.DSL.val("Upcoming").as("status"),
                org.jooq.impl.DSL.val("").as("image"),
                ASSESSMENTS.DESCRIPTION,
                ASSESSMENTS.COLLEGE
            )
            .from(ASSESSMENTS)
            .orderBy(ASSESSMENTS.ID.desc())
            .fetchInto(AssessmentDTO.class);
    }

    // ── Admin view: fetch distinct target colleges ───────────────────────
    public List<String> getUniqueColleges() {
        return dsl.selectDistinct(ASSESSMENTS.COLLEGE)
                  .from(ASSESSMENTS)
                  .where(ASSESSMENTS.COLLEGE.isNotNull())
                  .and(ASSESSMENTS.COLLEGE.ne("ALL"))
                  .fetchInto(String.class);
    }

    // ── Admin: create ─────────────────────────────────────────────────────
    @Transactional
    public AssessmentDTO createAssessment(Map<String, Object> body) {
        String title       = (String) body.get("title");
        String type        = (String) body.getOrDefault("type", "ASSESSMENT");
        String date        = (String) body.getOrDefault("date", java.time.LocalDate.now().toString());
        int duration       = body.containsKey("duration") ? ((Number) body.get("duration")).intValue() : 60;
        String schedule    = (String) body.getOrDefault("schedule", "Anytime");
        String description = (String) body.getOrDefault("description", "");
        String college     = (String) body.getOrDefault("college", "ALL");

        int id = dsl.insertInto(ASSESSMENTS,
                ASSESSMENTS.TITLE, ASSESSMENTS.TYPE, ASSESSMENTS.DATE,
                ASSESSMENTS.DURATION, ASSESSMENTS.SCHEDULE,
                ASSESSMENTS.DESCRIPTION, ASSESSMENTS.COLLEGE)
            .values(title, type, date, duration, schedule, description, college)
            .returning(ASSESSMENTS.ID)
            .fetchOne()
            .get(ASSESSMENTS.ID);

        return new AssessmentDTO(id, title, type, date, duration, schedule, "Upcoming", "", description, college);
    }

    // ── Admin: update ─────────────────────────────────────────────────────
    @Transactional
    public int updateAssessment(int id, Map<String, Object> body) {
        var step = dsl.update(ASSESSMENTS);
        var set = step
            .set(ASSESSMENTS.TITLE,       (String) body.getOrDefault("title", ""))
            .set(ASSESSMENTS.TYPE,        (String) body.getOrDefault("type", "ASSESSMENT"))
            .set(ASSESSMENTS.DATE,        (String) body.get("date"))
            .set(ASSESSMENTS.DURATION,    ((Number) body.getOrDefault("duration", 60)).intValue())
            .set(ASSESSMENTS.SCHEDULE,    (String) body.getOrDefault("schedule", "Anytime"))
            .set(ASSESSMENTS.DESCRIPTION, (String) body.getOrDefault("description", ""))
            .set(ASSESSMENTS.COLLEGE,     (String) body.getOrDefault("college", "ALL"))
            .where(ASSESSMENTS.ID.eq(id));
        return set.execute();
    }

    // ── Admin: delete ─────────────────────────────────────────────────────
    @Transactional
    public int deleteAssessment(int id) {
        return dsl.deleteFrom(ASSESSMENTS)
            .where(ASSESSMENTS.ID.eq(id))
            .execute();
    }
}
