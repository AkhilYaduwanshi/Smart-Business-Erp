package com.erp.smartbusiness.controller;

import com.erp.smartbusiness.dto.AttendanceRequest;
import com.erp.smartbusiness.entity.Attendance;
import com.erp.smartbusiness.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@Tag(
        name = "Attendance Management",
        description = "APIs for employee attendance tracking and management"
)
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // CREATE ATTENDANCE
    @PostMapping
    @Operation(
            summary = "Create Attendance",
            description = "Create attendance for the currently logged-in employee"
    )
    public ResponseEntity<Attendance> createAttendance(
            @Valid @RequestBody AttendanceRequest request) {

        return ResponseEntity.ok(
                attendanceService.createAttendance(request)
        );
    }

    // GET ALL ATTENDANCE
    @GetMapping
    @Operation(
            summary = "Get All Attendance",
            description = "Get all attendance records. Accessible by Admin and Manager."
    )
    public ResponseEntity<List<Attendance>> getAllAttendance() {

        return ResponseEntity.ok(
                attendanceService.getAllAttendance()
        );
    }

    // GET MY ATTENDANCE
    @GetMapping("/my")
    @Operation(
            summary = "Get My Attendance",
            description = "Get attendance records belonging to the currently logged-in employee"
    )
    public ResponseEntity<List<Attendance>> getMyAttendance() {

        return ResponseEntity.ok(
                attendanceService.getMyAttendance()
        );
    }

    // GET ATTENDANCE BY ID
    @GetMapping("/{id}")
    @Operation(
            summary = "Get Attendance By ID",
            description = "Get a specific attendance record with employee ownership validation"
    )
    public ResponseEntity<Attendance> getAttendanceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceById(id)
        );
    }

    // UPDATE ATTENDANCE
    @PutMapping("/{id}")
    @Operation(
            summary = "Update Attendance",
            description = "Update an attendance record with ownership validation"
    )
    public ResponseEntity<Attendance> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRequest request) {

        return ResponseEntity.ok(
                attendanceService.updateAttendance(id, request)
        );
    }

    // DELETE ATTENDANCE
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete Attendance",
            description = "Delete an attendance record with ownership validation"
    )
    public ResponseEntity<Void> deleteAttendance(
            @PathVariable Long id) {

        attendanceService.deleteAttendance(id);

        return ResponseEntity.noContent().build();
    }
}