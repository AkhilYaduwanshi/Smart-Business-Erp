package com.erp.smartbusiness.controller;

import com.erp.smartbusiness.dto.EmployeeRequest;
import com.erp.smartbusiness.entity.Employee;
import com.erp.smartbusiness.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@Tag(
        name = "Employee Management",
        description = "APIs for employee management and employee profile access"
)
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // CREATE EMPLOYEE
    @PostMapping
    @Operation(
            summary = "Create Employee",
            description = "Create a new employee"
    )
    public ResponseEntity<Employee> createEmployee(
            @Valid @RequestBody EmployeeRequest request) {

        return ResponseEntity.ok(
                employeeService.createEmployee(request)
        );
    }

    // GET EMPLOYEES WITH PAGINATION + SORTING
    @GetMapping
    @Operation(
            summary = "Get Employees with Pagination and Sorting",
            description = "Get employees using page, size, sort field and sort direction"
    )
    public ResponseEntity<Page<Employee>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        return ResponseEntity.ok(
                employeeService.getAllEmployees(
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }

    // GET MY PROFILE
    @GetMapping("/me")
    @Operation(
            summary = "Get My Profile",
            description = "Get the employee profile linked to the logged-in user"
    )
    public ResponseEntity<Employee> getMyProfile() {

        return ResponseEntity.ok(
                employeeService.getMyProfile()
        );
    }

    // SEARCH BY NAME
    @GetMapping("/search/name")
    @Operation(
            summary = "Search Employees By Name",
            description = "Search employees by first name"
    )
    public ResponseEntity<List<Employee>> searchByName(
            @RequestParam String name) {

        return ResponseEntity.ok(
                employeeService.searchByName(name)
        );
    }

    // SEARCH BY DEPARTMENT
    @GetMapping("/search/department")
    @Operation(
            summary = "Search Employees By Department",
            description = "Find employees belonging to a department"
    )
    public ResponseEntity<List<Employee>> searchByDepartment(
            @RequestParam String department) {

        return ResponseEntity.ok(
                employeeService.searchByDepartment(department)
        );
    }

    // GET EMPLOYEE BY ID
    @GetMapping("/{id}")
    @Operation(
            summary = "Get Employee By ID",
            description = "Get employee details using employee ID"
    )
    public ResponseEntity<Employee> getEmployeeById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                employeeService.getEmployeeById(id)
        );
    }

    // UPDATE EMPLOYEE
    @PutMapping("/{id}")
    @Operation(
            summary = "Update Employee",
            description = "Update employee details"
    )
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {

        return ResponseEntity.ok(
                employeeService.updateEmployee(id, request)
        );
    }

    // DELETE EMPLOYEE
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete Employee",
            description = "Delete an employee"
    )
    public ResponseEntity<Void> deleteEmployee(
            @PathVariable Long id) {

        employeeService.deleteEmployee(id);

        return ResponseEntity.noContent().build();
    }
}