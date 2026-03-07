package com.rk.dashboard.model;

import java.util.List;

public record SubmitAttemptResponse(
    int score,
    int rightAnswers,
    int wrongAnswers,
    int totalQuestions,
    String percentage,
    List<QuestionResultDTO> results
) {}
