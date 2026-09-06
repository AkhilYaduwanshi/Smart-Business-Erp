package com.erp.smartbusiness.controller;

import com.erp.smartbusiness.dto.DashboardResponse;
import com.erp.smartbusiness.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardResponse> getSummary() {

        return ResponseEntity.ok(
                dashboardService.getSummary()
        );
    }
}