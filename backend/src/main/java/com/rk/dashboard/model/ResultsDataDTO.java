package com.rk.dashboard.model;

import java.util.List;

public record ResultsDataDTO(
    Stats stats,
    List<Achievement> achievements,
    List<AttemptResultDTO> activityFeed
) {
    public record Stats(
        int totalScore,
        int submittedTests,
        String avgAccuracy,
        int bestScore,
        String rank,
        int testsTaken
    ) {}
    
    public record Achievement(
        String label,
        String status,
        String color
    ) {}
}
