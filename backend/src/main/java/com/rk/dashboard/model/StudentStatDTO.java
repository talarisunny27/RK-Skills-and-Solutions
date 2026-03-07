package com.rk.dashboard.model;

public record StudentStatDTO(
    String userId,
    String fullName,
    String email,
    String college,
    int testsTaken,
    int totalScore,
    String avgAccuracy,
    String rank
) {}
