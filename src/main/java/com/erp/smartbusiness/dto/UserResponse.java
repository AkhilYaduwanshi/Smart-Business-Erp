package com.erp.smartbusiness.dto;

import com.erp.smartbusiness.entity.Employee;

public class UserResponse {

    private Long id;
    private String username;
    private String role;
    private Employee employee;

    public UserResponse() {
    }

    public UserResponse(Long id, String username, String role, Employee employee) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.employee = employee;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}