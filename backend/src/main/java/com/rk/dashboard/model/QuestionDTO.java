package com.rk.dashboard.model;

public record QuestionDTO(
    Integer id,
    Integer assessmentId,
    String section,
    String text,
    String optionA,
    String optionB,
    String optionC,
    String optionD,
    String difficulty
) {}
