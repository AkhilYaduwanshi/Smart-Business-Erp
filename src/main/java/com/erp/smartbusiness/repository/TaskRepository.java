package com.erp.smartbusiness.repository;

import com.erp.smartbusiness.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    boolean existsByTaskCode(String taskCode);

    List<Task> findByAssignedToId(Long employeeId);

    List<Task> findByStatus(String status);

    List<Task> findByPriority(String priority);
}