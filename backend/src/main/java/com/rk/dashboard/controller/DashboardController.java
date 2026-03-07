package com.rk.dashboard.controller;

import com.rk.dashboard.model.AdminStatsDTO;
import com.rk.dashboard.model.DashboardStats;
import com.rk.dashboard.repository.DashboardRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardRepository dashboardRepository;

    public DashboardController(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    @GetMapping("/{userId}")
    public DashboardStats getDashboardStats(@PathVariable String userId) {
        return dashboardRepository.getStatsForUser(userId);
    }

    @GetMapping("/admin")
    public AdminStatsDTO getAdminStats() {
        return dashboardRepository.getAdminStats();
    }
}
