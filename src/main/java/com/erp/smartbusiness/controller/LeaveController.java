package com.erp.smartbusiness.controller;

import com.erp.smartbusiness.dto.LeaveRequest;
import com.erp.smartbusiness.entity.Leave;
import com.erp.smartbusiness.service.LeaveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@Tag(
        name = "Leave Management",
        description = "APIs for leave requests, approval and employee leave management"
)
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    // CREATE LEAVE
    @PostMapping
    @Operation(
            summary = "Create Leave Request",
            description = "Create a leave request for the currently logged-in employee"
    )
    public ResponseEntity<Leave> createLeave(
            @Valid @RequestBody LeaveRequest request) {

        return ResponseEntity.ok(
                leaveService.createLeave(request)
        );
    }

    // GET ALL LEAVES
    @GetMapping
    @Operation(
            summary = "Get Leaves",
            description = "Get all leaves or filter leaves by status"
    )
    public ResponseEntity<List<Leave>> getAllLeaves(
            @RequestParam(required = false) String status) {

        return ResponseEntity.ok(
                leaveService.getAllLeaves(status)
        );
    }
    // GET MY LEAVES
    @GetMapping("/my")
    @Operation(
            summary = "Get My Leaves",
            description = "Get leaves belonging to the currently logged-in employee"
    )
    public ResponseEntity<List<Leave>> getMyLeaves() {

        return ResponseEntity.ok(
                leaveService.getMyLeaves()
        );
    }

    // GET LEAVE BY ID
    @GetMapping("/{id}")
    @Operation(
            summary = "Get Leave By ID",
            description = "Get a leave record by ID with ownership validation for employees"
    )
    public ResponseEntity<Leave> getLeaveById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                leaveService.getLeaveById(id)
        );
    }

    // UPDATE LEAVE
    @PutMapping("/{id}")
    @Operation(
            summary = "Update Leave",
            description = "Update an existing leave request with ownership validation"
    )
    public ResponseEntity<Leave> updateLeave(
            @PathVariable Long id,
            @Valid @RequestBody LeaveRequest request) {

        return ResponseEntity.ok(
                leaveService.updateLeave(id, request)
        );
    }

    // APPROVE LEAVE
    @PutMapping("/{id}/approve")
    @Operation(
            summary = "Approve Leave",
            description = "Approve a pending leave request. Accessible by Admin and Manager."
    )
    public ResponseEntity<Leave> approveLeave(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                leaveService.approveLeave(id)
        );
    }

    // REJECT LEAVE
    @PutMapping("/{id}/reject")
    @Operation(
            summary = "Reject Leave",
            description = "Reject a pending leave request. Accessible by Admin and Manager."
    )
    public ResponseEntity<Leave> rejectLeave(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                leaveService.rejectLeave(id)
        );
    }

    // DELETE LEAVE
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete Leave",
            description = "Delete a leave request with ownership validation"
    )
    public ResponseEntity<Void> deleteLeave(
            @PathVariable Long id) {

        leaveService.deleteLeave(id);

        return ResponseEntity.noContent().build();
    }
}