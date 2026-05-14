package com.rk.dashboard.model;

public record AssessmentDTO(
    int id,
    String title,
    String type,
    String module,
    String date,
    int duration,
    String schedule,
    String status,
    String image,
    String description,
    String college
) {}
