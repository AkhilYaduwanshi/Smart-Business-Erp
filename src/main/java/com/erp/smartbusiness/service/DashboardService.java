package com.erp.smartbusiness.service;

import com.erp.smartbusiness.dto.DashboardResponse;
import com.erp.smartbusiness.repository.AssetRepository;
import com.erp.smartbusiness.repository.EmployeeRepository;
import com.erp.smartbusiness.repository.LeaveRepository;
import com.erp.smartbusiness.repository.ProjectRepository;
import com.erp.smartbusiness.repository.TaskRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final LeaveRepository leaveRepository;
    private final AssetRepository assetRepository;

    public DashboardService(
            EmployeeRepository employeeRepository,
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            LeaveRepository leaveRepository,
            AssetRepository assetRepository) {

        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.leaveRepository = leaveRepository;
        this.assetRepository = assetRepository;
    }

    public DashboardResponse getSummary() {

        long totalEmployees = employeeRepository.count();
        long totalProjects = projectRepository.count();
        long totalTasks = taskRepository.count();
        long pendingLeaves = leaveRepository.countByStatus("PENDING");
        long approvedLeaves = leaveRepository.countByStatus("APPROVED");
        long totalAssets = assetRepository.count();

        return new DashboardResponse(
                totalEmployees,
                totalProjects,
                totalTasks,
                pendingLeaves,
                approvedLeaves,
                totalAssets
        );
    }
}