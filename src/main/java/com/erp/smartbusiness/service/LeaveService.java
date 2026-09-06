package com.erp.smartbusiness.service;

import com.erp.smartbusiness.dto.LeaveRequest;
import com.erp.smartbusiness.entity.Employee;
import com.erp.smartbusiness.entity.Leave;
import com.erp.smartbusiness.entity.User;
import com.erp.smartbusiness.exception.ResourceNotFoundException;
import com.erp.smartbusiness.repository.EmployeeRepository;
import com.erp.smartbusiness.repository.LeaveRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;
    private final CurrentUserService currentUserService;

    public LeaveService(
            LeaveRepository leaveRepository,
            EmployeeRepository employeeRepository,
            CurrentUserService currentUserService
    ) {
        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
        this.currentUserService = currentUserService;
    }

    public Leave createLeave(LeaveRequest request) {

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException(
                    "End date cannot be before start date"
            );
        }

        // Employee is taken from logged-in user.
        // employeeId from request is no longer accepted.
        User currentUser = currentUserService.getCurrentUser();

        Employee employee = currentUser.getEmployee();

        if (employee == null) {
            throw new ResourceNotFoundException(
                    "No employee profile linked to current user"
            );
        }

        Leave leave = new Leave();

        leave.setLeaveType(request.getLeaveType());
        leave.setReason(request.getReason());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());

        // New leave always starts as PENDING
        leave.setStatus("PENDING");

        leave.setEmployee(employee);

        return leaveRepository.save(leave);
    }

    public List<Leave> getAllLeaves(String status) {

        if (status == null || status.isBlank()) {
            return leaveRepository.findAll();
        }

        return leaveRepository.findByStatus(status);
    }

    public List<Leave> getMyLeaves() {

        User currentUser = currentUserService.getCurrentUser();

        Employee employee = currentUser.getEmployee();

        if (employee == null) {
            throw new ResourceNotFoundException(
                    "No employee profile linked to current user"
            );
        }

        return leaveRepository.findByEmployeeId(employee.getId());
    }

    public Leave getLeaveById(Long id) {

        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Leave not found with id: " + id
                        )
                );

        verifyEmployeeOwnership(leave);

        return leave;
    }

    public Leave updateLeave(Long id, LeaveRequest request) {

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException(
                    "End date cannot be before start date"
            );
        }

        Leave leave = getLeaveById(id);

        leave.setLeaveType(request.getLeaveType());
        leave.setReason(request.getReason());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());

        return leaveRepository.save(leave);
    }

    public Leave approveLeave(Long id) {

        Leave leave = getLeaveById(id);

        leave.setStatus("APPROVED");

        return leaveRepository.save(leave);
    }

    public Leave rejectLeave(Long id) {

        Leave leave = getLeaveById(id);

        leave.setStatus("REJECTED");

        return leaveRepository.save(leave);
    }

    public void deleteLeave(Long id) {

        Leave leave = getLeaveById(id);

        leaveRepository.delete(leave);
    }

    private void verifyEmployeeOwnership(Leave leave) {

        User currentUser = currentUserService.getCurrentUser();

        if (!"EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            return;
        }

        Employee employee = currentUser.getEmployee();

        if (employee == null || !leave.getEmployee().getId().equals(employee.getId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to access this leave"
            );
        }
    }
}