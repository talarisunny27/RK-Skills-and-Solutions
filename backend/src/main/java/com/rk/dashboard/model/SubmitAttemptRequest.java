package com.rk.dashboard.model;

import java.util.Map;

public record SubmitAttemptRequest(
    String userId,
    Map<Integer, String> answers   // questionId -> "A"/"B"/"C"/"D"
) {}
