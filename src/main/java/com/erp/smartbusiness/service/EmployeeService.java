package com.erp.smartbusiness.service;

import com.erp.smartbusiness.dto.EmployeeRequest;
import com.erp.smartbusiness.entity.Employee;
import com.erp.smartbusiness.entity.User;
import com.erp.smartbusiness.exception.ResourceNotFoundException;
import com.erp.smartbusiness.repository.EmployeeRepository;
import com.erp.smartbusiness.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            UserRepository userRepository,
            CurrentUserService currentUserService) {

        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    // CREATE EMPLOYEE
    public Employee createEmployee(EmployeeRequest request) {

        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new RuntimeException("Employee code already exists");
        }

        Employee employee = new Employee();

        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setSalary(request.getSalary());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setStatus(request.getStatus());

        return employeeRepository.save(employee);
    }

    // GET ALL EMPLOYEES WITH PAGINATION + SORTING
    public Page<Employee> getAllEmployees(
            int page,
            int size,
            String sortBy,
            String direction) {

        if (page < 0) {
            throw new IllegalArgumentException("Page number cannot be negative");
        }

        if (size <= 0) {
            throw new IllegalArgumentException("Page size must be greater than zero");
        }

        Sort sort;

        if ("desc".equalsIgnoreCase(direction)) {
            sort = Sort.by(sortBy).descending();
        } else {
            sort = Sort.by(sortBy).ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        return employeeRepository.findAll(pageable);
    }

    // GET MY PROFILE
    public Employee getMyProfile() {

        User currentUser = currentUserService.getCurrentUser();

        Employee employee = currentUser.getEmployee();

        if (employee == null) {
            throw new ResourceNotFoundException(
                    "No employee profile linked to current user"
            );
        }

        return employee;
    }

    // GET EMPLOYEE BY ID
    public Employee getEmployeeById(Long id) {

        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: " + id
                        ));
    }

    // UPDATE EMPLOYEE
    public Employee updateEmployee(
            Long id,
            EmployeeRequest request) {

        Employee employee = getEmployeeById(id);

        if (!employee.getEmail().equals(request.getEmail())
                && employeeRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException("Email already exists");
        }

        if (!employee.getEmployeeCode().equals(request.getEmployeeCode())
                && employeeRepository.existsByEmployeeCode(
                request.getEmployeeCode())) {

            throw new RuntimeException(
                    "Employee code already exists"
            );
        }

        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setSalary(request.getSalary());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setStatus(request.getStatus());

        return employeeRepository.save(employee);
    }

    // DELETE EMPLOYEE
    public void deleteEmployee(Long id) {

        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Employee not found with id: " + id
            );
        }

        employeeRepository.deleteById(id);
    }

    // SEARCH EMPLOYEES BY NAME
    public List<Employee> searchByName(String name) {

        return employeeRepository
                .findByFirstNameContainingIgnoreCase(name);
    }

    // SEARCH EMPLOYEES BY DEPARTMENT
    public List<Employee> searchByDepartment(String department) {

        return employeeRepository
                .findByDepartmentIgnoreCase(department);
    }
}