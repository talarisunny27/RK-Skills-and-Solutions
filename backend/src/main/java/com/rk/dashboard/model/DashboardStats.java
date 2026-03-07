package com.rk.dashboard.model;

public record DashboardStats(
    int testsTaken,
    String avgAccuracy,
    int totalScore,
    String rank,
    int todayRight,
    int todayWrong,
    String todayAccuracy
) {}
