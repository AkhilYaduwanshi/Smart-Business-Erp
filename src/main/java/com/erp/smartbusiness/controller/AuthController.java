package com.erp.smartbusiness.controller;

import com.erp.smartbusiness.dto.LoginRequest;
import com.erp.smartbusiness.dto.LoginResponse;
import com.erp.smartbusiness.entity.User;
import com.erp.smartbusiness.repository.UserRepository;
import com.erp.smartbusiness.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(
        name = "Authentication",
        description = "Login and JWT authentication APIs"
)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    @Operation(
            summary = "User Login",
            description = "Authenticate user and generate a JWT token"
    )
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        String token = jwtService.generateToken(
                user.getUsername(),
                user.getRole()
        );

        LoginResponse response = new LoginResponse(
                token,
                user.getUsername(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }
}