package com.rk.dashboard.model;

public record QuestionResultDTO(
    int questionId,
    String userAnswer,
    String correctAnswer,
    boolean isCorrect
) {}
