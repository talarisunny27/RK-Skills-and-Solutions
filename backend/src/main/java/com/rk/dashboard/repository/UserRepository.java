package com.rk.dashboard.repository;

import com.rk.dashboard.model.StudentStatDTO;
import com.rk.dashboard.model.UserDTO;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.rk.dashboard.jooq.tables.Users.USERS;

@Repository
public class UserRepository {

    private final DSLContext dsl;

    public UserRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public void upsertUser(UserDTO user) {
        dsl.insertInto(USERS, USERS.ID, USERS.EMAIL, USERS.NAME, USERS.COLLEGE)
           .values(user.id(), user.email(), user.name(), user.college())
           .onConflict(USERS.ID)
           .doUpdate()
           .set(USERS.EMAIL, user.email())
           .set(USERS.NAME, user.name())
           .set(USERS.COLLEGE, user.college())
           .execute();
    }

    public List<StudentStatDTO> getAllStudentsStats() {
        var userScores = DSL.select(
                com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.USER_ID,
                DSL.count().as("tests_taken"),
                DSL.sum(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.SCORE).as("total_score"),
                DSL.sum(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.RIGHT_ANSWERS).as("total_right"),
                DSL.sum(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.WRONG_ANSWERS).as("total_wrong")
            )
            .from(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS)
            .groupBy(com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS.USER_ID)
            .asTable("user_scores");

        var rankedUsers = DSL.select(
                userScores.field("USER_ID", String.class),
                userScores.field("tests_taken", Integer.class),
                userScores.field("total_score", Integer.class),
                userScores.field("total_right", Integer.class),
                userScores.field("total_wrong", Integer.class),
                DSL.rank().over(DSL.orderBy(userScores.field("total_score", Integer.class).desc())).as("rank")
            )
            .from(userScores)
            .asTable("ranked_users");

        return dsl.select(
                USERS.ID.as("userId"),
                USERS.NAME.as("fullName"),
                USERS.EMAIL.as("email"),
                USERS.COLLEGE.as("college"),
                DSL.coalesce(rankedUsers.field("tests_taken", Integer.class), 0).as("testsTaken"),
                DSL.coalesce(rankedUsers.field("total_score", Integer.class), 0).as("totalScore"),
                DSL.concat(
                    DSL.round(
                        DSL.cast(rankedUsers.field("total_right", Double.class), Double.class)
                            .div(
                                DSL.cast(
                                    rankedUsers.field("total_right", Double.class).add(rankedUsers.field("total_wrong", Double.class)),
                                    Double.class
                                ).nullif(0.0)
                            ).mul(100)
                    ), DSL.val("%")
                ).as("avgAccuracy"),
                DSL.concat(DSL.val("#"), DSL.coalesce(rankedUsers.field("rank", Integer.class), 0)).as("rank")
            )
            .from(USERS)
            .leftJoin(rankedUsers).on(USERS.ID.eq(rankedUsers.field("USER_ID", String.class)))
            .orderBy(DSL.coalesce(rankedUsers.field("rank", Integer.class), 999999).asc())
            .fetchInto(StudentStatDTO.class);
    }
}
