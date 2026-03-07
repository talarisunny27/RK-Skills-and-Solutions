package com.rk.dashboard.model;

public record LeaderboardEntryDTO(
    int rank,
    String name,
    String college,
    int totalTests,
    String avgAccuracy,
    int totalScore
) {}
