package com.erp.smartbusiness.repository;

import com.erp.smartbusiness.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmail(String email);

    boolean existsByEmployeeCode(String employeeCode);

    List<Employee> findByFirstNameContainingIgnoreCase(String firstName);

    List<Employee> findByDepartmentIgnoreCase(String department);
}