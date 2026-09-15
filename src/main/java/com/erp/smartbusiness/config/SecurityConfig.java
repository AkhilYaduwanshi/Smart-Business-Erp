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

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "https://*.vercel.app"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // Disable CSRF for JWT-based REST API
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // Stateless JWT authentication
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // AUTH
                        // =========================

                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()


                        // =========================
                        // SWAGGER
                        // =========================

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()


                        // =========================
                        // USERS
                        // ADMIN ONLY
                        // =========================

                        .requestMatchers(
                                "/api/users/**"
                        ).hasRole("ADMIN")


                        // =========================
                        // EMPLOYEES
                        // =========================

                        // Logged-in employees can view own profile
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/employees/me"
                        ).hasAnyRole(
                                "ADMIN",
                                "EMPLOYEE"
                        )

                        // ADMIN + MANAGER can view employee list
                        // Needed for Manager task assignment
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/employees"
                        ).hasAnyRole(
                                "ADMIN",
                                "MANAGER"
                        )

                        // ADMIN only for employee management
                        .requestMatchers(
                                "/api/employees/**"
                        ).hasRole("ADMIN")


                        // =========================
                        // PROJECTS
                        // ADMIN + MANAGER
                        // =========================

                        .requestMatchers(
                                "/api/projects/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "MANAGER"
                        )


                        // =========================
                        // TASKS
                        // =========================

                        // ADMIN + MANAGER can view all tasks
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/tasks"
                        ).hasAnyRole(
                                "ADMIN",
                                "MANAGER"
                        )

                        // EMPLOYEE can view own tasks
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/tasks/my"
                        ).hasRole("EMPLOYEE")

                        // Task create/update/delete
                        .requestMatchers(
                                "/api/tasks/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "MANAGER",
                                "EMPLOYEE"
                        )


                        // =========================
                        // LEAVES
                        // =========================

                        // ADMIN + MANAGER can view all leaves
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/leaves"
                        ).hasAnyRole(
                                "ADMIN",
                                "MANAGER"
                        )

                        // EMPLOYEE can view own leaves
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/leaves/my"
                        ).hasRole("EMPLOYEE")

                        // Approve leave
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/leaves/*/approve"
                        ).hasAnyRole(
                                "ADMIN",
                                "MANAGER"
                        )

                        // Reject leave
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/leaves/*/reject"
                        ).hasAnyRole(
                                "ADMIN",
                                "MANAGER"
                        )

                        // Other leave operations
                        .requestMatchers(
                                "/api/leaves/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "MANAGER",
                                "EMPLOYEE"
                        )


                        // =========================
                        // ATTENDANCE
                        // =========================

                        // ADMIN + MANAGER can view all attendance
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/attendance"
                        ).hasAnyRole(
                                "ADMIN",
                                "MANAGER"
                        )

                        // EMPLOYEE can view own attendance
                        .requestMatchers(
                                "/api/attendance/my"
                        ).hasRole("EMPLOYEE")

                        // Other attendance operations
                        .requestMatchers(
                                "/api/attendance/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "MANAGER",
                                "EMPLOYEE"
                        )


                        // =========================
                        // ASSETS
                        // ADMIN + MANAGER
                        // =========================

                        .requestMatchers(
                                "/api/assets/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "MANAGER"
                        )


                        // =========================
                        // DASHBOARD
                        // ALL AUTHENTICATED ROLES
                        // =========================

                        .requestMatchers(
                                "/api/dashboard/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "MANAGER",
                                "EMPLOYEE"
                        )


                        // =========================
                        // EVERYTHING ELSE
                        // =========================

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}