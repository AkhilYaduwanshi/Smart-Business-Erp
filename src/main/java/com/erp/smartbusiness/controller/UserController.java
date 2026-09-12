package com.erp.smartbusiness.controller;

import com.erp.smartbusiness.dto.PasswordResetRequest;
import com.erp.smartbusiness.dto.UserRequest;
import com.erp.smartbusiness.dto.UserResponse;
import com.erp.smartbusiness.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET ALL USERS
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    // CREATE USER
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody UserRequest request) {

        return ResponseEntity.ok(
                userService.createUser(request)
        );
    }

    // RESET PASSWORD
    @PutMapping("/{username}/reset-password")
    public ResponseEntity<UserResponse> resetPassword(
            @PathVariable String username,
            @Valid @RequestBody PasswordResetRequest request) {

        return ResponseEntity.ok(
                userService.resetPassword(
                        username,
                        request.getNewPassword()
                )
        );
    }
}