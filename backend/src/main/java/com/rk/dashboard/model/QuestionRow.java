package com.rk.dashboard.model;

/** Internal row used to carry correctAnswer during upload — never serialized to client. */
public record QuestionRow(
    int assessmentId,
    String section,
    String text,
    String optionA,
    String optionB,
    String optionC,
    String optionD,
    String correctAnswer,
    String difficulty
) {}
