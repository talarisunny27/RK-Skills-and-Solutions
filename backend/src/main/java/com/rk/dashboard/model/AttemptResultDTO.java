package com.rk.dashboard.model;

public record AttemptResultDTO(
    int id,
    String title,
    String date,
    String submittedAt,
    int attempt,
    String accuracy,
    int score,
    int rank
) {}
