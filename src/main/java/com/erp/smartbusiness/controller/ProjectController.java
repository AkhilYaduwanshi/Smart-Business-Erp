package com.erp.smartbusiness.controller;

import com.erp.smartbusiness.dto.ProjectRequest;
import com.erp.smartbusiness.entity.Project;
import com.erp.smartbusiness.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@Tag(
        name = "Project Management",
        description = "APIs for project creation, search, filtering and management"
)
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // CREATE
    @PostMapping
    @Operation(
            summary = "Create Project",
            description = "Create a new project"
    )
    public ResponseEntity<Project> createProject(
            @Valid @RequestBody ProjectRequest request) {

        return ResponseEntity.ok(
                projectService.createProject(request)
        );
    }

    // GET ALL / FILTER BY STATUS
    @GetMapping
    @Operation(
            summary = "Get Projects",
            description = "Get all projects or filter projects by status"
    )
    public ResponseEntity<List<Project>> getAllProjects(
            @RequestParam(required = false) String status) {

        return ResponseEntity.ok(
                projectService.getAllProjects(status)
        );
    }

    // SEARCH BY NAME
    @GetMapping("/search")
    @Operation(
            summary = "Search Projects By Name",
            description = "Search projects by project name"
    )
    public ResponseEntity<List<Project>> searchByName(
            @RequestParam String name) {

        return ResponseEntity.ok(
                projectService.searchByName(name)
        );
    }

    // GET BY ID
    @GetMapping("/{id}")
    @Operation(
            summary = "Get Project By ID",
            description = "Get project details using project ID"
    )
    public ResponseEntity<Project> getProjectById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                projectService.getProjectById(id)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    @Operation(
            summary = "Update Project",
            description = "Update an existing project"
    )
    public ResponseEntity<Project> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request) {

        return ResponseEntity.ok(
                projectService.updateProject(id, request)
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete Project",
            description = "Delete an existing project"
    )
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id) {

        projectService.deleteProject(id);

        return ResponseEntity.noContent().build();
    }
}