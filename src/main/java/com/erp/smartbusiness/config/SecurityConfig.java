package com.erp.smartbusiness.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Login
                        .requestMatchers("/api/auth/**").permitAll()

                        // Swagger / OpenAPI
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // User management
                        .requestMatchers("/api/users/**")
                        .hasRole("ADMIN")

                        // Employee
                        .requestMatchers(HttpMethod.GET, "/api/employees/me")
                        .hasAnyRole("ADMIN", "EMPLOYEE")

                        .requestMatchers("/api/employees/**")
                        .hasRole("ADMIN")

                        // Projects
                        .requestMatchers("/api/projects/**")
                        .hasAnyRole("ADMIN", "MANAGER")

                                // Tasks - Admin and Manager can access all tasks
                                .requestMatchers(HttpMethod.GET, "/api/tasks")
                                .hasAnyRole("ADMIN", "MANAGER")

                               // Employee can see only assigned tasks
                                .requestMatchers(HttpMethod.GET, "/api/tasks/my")
                                .hasRole("EMPLOYEE")

                              // Other task operations
                                .requestMatchers("/api/tasks/**")
                                .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")
                        // Leave - only ADMIN and MANAGER can see all leaves
                        .requestMatchers(HttpMethod.GET, "/api/leaves")
                        .hasAnyRole("ADMIN", "MANAGER")

                        // Employee can see only own leaves
                        .requestMatchers(HttpMethod.GET, "/api/leaves/my")
                        .hasRole("EMPLOYEE")

                        // Leave approval
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/leaves/*/approve"
                        )
                        .hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/leaves/*/reject"
                        )
                        .hasAnyRole("ADMIN", "MANAGER")

                        // Other leave operations require login;
                        // ownership is checked inside LeaveService
                        .requestMatchers("/api/leaves/**")
                        .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

                        // Attendance - Admin and Manager can access all attendance
                        .requestMatchers(HttpMethod.GET, "/api/attendance")
                        .hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers("/api/attendance/my")
                        .hasRole("EMPLOYEE")

                        .requestMatchers("/api/attendance/**")
                        .hasAnyRole("ADMIN", "MANAGER", "EMPLOYEE")

                        // Assets
                        .requestMatchers("/api/assets/**")
                        .hasAnyRole("ADMIN", "MANAGER")

                        // Dashboard - Admin and Manager only
                        .requestMatchers("/api/dashboard/**")
                        .hasAnyRole("ADMIN", "MANAGER")

                        // Everything else
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}