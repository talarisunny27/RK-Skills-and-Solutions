package com.rk.dashboard.model;

import java.util.List;

public record AdminStatsDTO(
    int totalStudents,
    int questionsBank,
    int activeTests,
    String avgAccuracy,
    List<AttemptResultDTO> recentActivity
) {}
