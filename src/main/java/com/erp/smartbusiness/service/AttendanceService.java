package com.erp.smartbusiness.service;

import com.erp.smartbusiness.dto.AttendanceRequest;
import com.erp.smartbusiness.entity.Attendance;
import com.erp.smartbusiness.entity.Employee;
import com.erp.smartbusiness.entity.User;
import com.erp.smartbusiness.exception.ResourceNotFoundException;
import com.erp.smartbusiness.repository.AttendanceRepository;
import com.erp.smartbusiness.repository.EmployeeRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final CurrentUserService currentUserService;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            EmployeeRepository employeeRepository,
            CurrentUserService currentUserService) {

        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
        this.currentUserService = currentUserService;
    }

    // CREATE ATTENDANCE
    public Attendance createAttendance(AttendanceRequest request) {

        User currentUser = currentUserService.getCurrentUser();

        Employee employee = currentUser.getEmployee();

        if (employee == null) {
            throw new ResourceNotFoundException(
                    "No employee profile linked to current user"
            );
        }

        Attendance attendance = new Attendance();

        attendance.setAttendanceDate(request.getAttendanceDate());
        attendance.setCheckIn(request.getCheckIn());
        attendance.setCheckOut(request.getCheckOut());
        attendance.setStatus(request.getStatus());
        attendance.setEmployee(employee);

        return attendanceRepository.save(attendance);
    }

    // GET ALL ATTENDANCE
    public List<Attendance> getAllAttendance() {

        return attendanceRepository.findAll();
    }

    // GET MY ATTENDANCE
    public List<Attendance> getMyAttendance() {

        User currentUser = currentUserService.getCurrentUser();

        Employee employee = currentUser.getEmployee();

        if (employee == null) {
            throw new ResourceNotFoundException(
                    "No employee profile linked to current user"
            );
        }

        return attendanceRepository.findByEmployeeId(employee.getId());
    }

    // GET ATTENDANCE BY ID
    public Attendance getAttendanceById(Long id) {

        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Attendance not found with id: " + id
                        ));

        verifyEmployeeOwnership(attendance);

        return attendance;
    }

    // UPDATE ATTENDANCE
    public Attendance updateAttendance(
            Long id,
            AttendanceRequest request) {

        Attendance attendance = getAttendanceById(id);

        attendance.setAttendanceDate(request.getAttendanceDate());
        attendance.setCheckIn(request.getCheckIn());
        attendance.setCheckOut(request.getCheckOut());
        attendance.setStatus(request.getStatus());

        return attendanceRepository.save(attendance);
    }

    // DELETE ATTENDANCE
    public void deleteAttendance(Long id) {

        Attendance attendance = getAttendanceById(id);

        attendanceRepository.delete(attendance);
    }

    // CHECK OWNERSHIP
    private void verifyEmployeeOwnership(Attendance attendance) {

        User currentUser = currentUserService.getCurrentUser();

        // ADMIN and MANAGER can access attendance records
        if (!"EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            return;
        }

        Employee employee = currentUser.getEmployee();

        if (employee == null
                || attendance.getEmployee() == null
                || !attendance.getEmployee().getId().equals(employee.getId())) {

            throw new AccessDeniedException(
                    "You are not allowed to access this attendance record"
            );
        }
    }
}