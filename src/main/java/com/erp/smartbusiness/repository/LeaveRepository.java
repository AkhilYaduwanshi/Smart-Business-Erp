package com.erp.smartbusiness.repository;

import com.erp.smartbusiness.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {

    List<Leave> findByEmployeeId(Long employeeId);

    long countByStatus(String status);

    List<Leave> findByStatus(String status);
}