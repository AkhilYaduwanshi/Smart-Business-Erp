package com.erp.smartbusiness.repository;

import com.erp.smartbusiness.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    boolean existsByProjectCode(String projectCode);

    List<Project> findByStatus(String status);

    List<Project> findByNameContainingIgnoreCase(String name);
}