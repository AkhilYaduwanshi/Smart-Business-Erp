package com.erp.smartbusiness.service;

import com.erp.smartbusiness.dto.ProjectRequest;
import com.erp.smartbusiness.entity.Employee;
import com.erp.smartbusiness.entity.Project;
import com.erp.smartbusiness.exception.ResourceNotFoundException;
import com.erp.smartbusiness.repository.EmployeeRepository;
import com.erp.smartbusiness.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;

    public ProjectService(ProjectRepository projectRepository,
                          EmployeeRepository employeeRepository) {
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
    }

    // Create Project
    public Project createProject(ProjectRequest request) {

        if (projectRepository.existsByProjectCode(request.getProjectCode())) {
            throw new RuntimeException("Project code already exists");
        }

        Employee manager = employeeRepository.findById(request.getManagerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Manager not found with id: " + request.getManagerId()
                        ));

        Project project = new Project();

        project.setProjectCode(request.getProjectCode());
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStatus(request.getStatus());
        project.setBudget(request.getBudget());
        project.setManager(manager);

        return projectRepository.save(project);
    }

    // Get All Projects / Filter By Status
    public List<Project> getAllProjects(String status) {

        if (status == null || status.isBlank()) {
            return projectRepository.findAll();
        }

        return projectRepository.findByStatus(status);
    }

    // Search Projects By Name
    public List<Project> searchByName(String name) {

        return projectRepository.findByNameContainingIgnoreCase(name);
    }

    // Get Project By ID
    public Project getProjectById(Long id) {

        return projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: " + id
                        ));
    }

    // Update Project
    public Project updateProject(Long id, ProjectRequest request) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: " + id
                        ));

        Employee manager = employeeRepository.findById(request.getManagerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Manager not found with id: " + request.getManagerId()
                        ));

        project.setProjectCode(request.getProjectCode());
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStatus(request.getStatus());
        project.setBudget(request.getBudget());
        project.setManager(manager);

        return projectRepository.save(project);
    }

    // Delete Project
    public void deleteProject(Long id) {

        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Project not found with id: " + id
            );
        }

        projectRepository.deleteById(id);
    }
}