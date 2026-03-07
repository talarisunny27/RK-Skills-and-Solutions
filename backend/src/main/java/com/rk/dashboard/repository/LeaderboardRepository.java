package com.rk.dashboard.repository;

import com.rk.dashboard.model.LeaderboardEntryDTO;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.rk.dashboard.jooq.tables.UserAttempts.USER_ATTEMPTS;
import static com.rk.dashboard.jooq.tables.Users.USERS;

@Repository
public class LeaderboardRepository {

    private final DSLContext dsl;

    public LeaderboardRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public List<LeaderboardEntryDTO> getLeaderboard() {
        return dsl.select(
                DSL.rank().over(DSL.orderBy(DSL.sum(USER_ATTEMPTS.SCORE).desc())).as("rank"),
                USERS.NAME,
                USERS.COLLEGE,
                DSL.count(USER_ATTEMPTS.ID).as("total_tests"),
                DSL.concat(
                    DSL.round(
                        DSL.avg(USER_ATTEMPTS.RIGHT_ANSWERS.cast(Double.class)
                            .div(DSL.nullif(USER_ATTEMPTS.RIGHT_ANSWERS.add(USER_ATTEMPTS.WRONG_ANSWERS), 0)))
                        .mul(100)
                    ).cast(String.class),
                    DSL.val("%")
                ).as("avg_accuracy"),
                DSL.sum(USER_ATTEMPTS.SCORE).as("total_score")
            )
            .from(USERS)
            .join(USER_ATTEMPTS).on(USERS.ID.eq(USER_ATTEMPTS.USER_ID))
            .groupBy(USERS.ID, USERS.NAME, USERS.COLLEGE)
            .orderBy(DSL.field("total_score").desc())
            .fetchInto(LeaderboardEntryDTO.class);
    }
}
