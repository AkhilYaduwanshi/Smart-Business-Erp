package com.erp.smartbusiness.service;

import com.erp.smartbusiness.dto.UserRequest;
import com.erp.smartbusiness.dto.UserResponse;
import com.erp.smartbusiness.entity.Employee;
import com.erp.smartbusiness.entity.User;
import com.erp.smartbusiness.exception.ResourceNotFoundException;
import com.erp.smartbusiness.repository.EmployeeRepository;
import com.erp.smartbusiness.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET ALL USERS
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // CREATE USER
    public UserResponse createUser(UserRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        Employee employee = employeeRepository.findById(
                request.getEmployeeId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Employee not found with id: "
                                + request.getEmployeeId()
                )
        );

        boolean employeeAlreadyLinked = userRepository.findAll()
                .stream()
                .anyMatch(user ->
                        user.getEmployee() != null
                                && user.getEmployee()
                                .getId()
                                .equals(employee.getId())
                );

        if (employeeAlreadyLinked) {
            throw new RuntimeException(
                    "Employee already has a user account"
            );
        }

        User user = new User();

        user.setUsername(request.getUsername());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(
                request.getRole().toUpperCase()
        );

        user.setEmployee(employee);

        User savedUser = userRepository.save(user);

        return mapToResponse(savedUser);
    }

    // RESET PASSWORD
    public UserResponse resetPassword(
            String username,
            String newPassword
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found: " + username
                        )
                );

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        User updatedUser = userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    // MAP ENTITY TO RESPONSE
    private UserResponse mapToResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.getEmployee()
        );
    }
}