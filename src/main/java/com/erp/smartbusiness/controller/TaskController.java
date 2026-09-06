package com.erp.smartbusiness.controller;

import com.erp.smartbusiness.dto.TaskRequest;
import com.erp.smartbusiness.entity.Task;
import com.erp.smartbusiness.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@Tag(
        name = "Task Management",
        description = "APIs for task creation, assignment, filtering, pagination and management"
)
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // CREATE TASK
    @PostMapping
    @Operation(
            summary = "Create Task",
            description = "Create a new task and assign it to an employee"
    )
    public ResponseEntity<Task> createTask(
            @Valid @RequestBody TaskRequest request) {

        return ResponseEntity.ok(
                taskService.createTask(request)
        );
    }

    // GET ALL / FILTER / PAGINATION / SORTING
    @GetMapping
    @Operation(
            summary = "Get Tasks",
            description = "Get tasks with optional status, priority, pagination and sorting"
    )
    public ResponseEntity<Page<Task>> getAllTasks(

            @RequestParam(required = false)
            String status,

            @RequestParam(required = false)
            String priority,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "id")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String direction) {

        return ResponseEntity.ok(
                taskService.getAllTasks(
                        status,
                        priority,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }

    // GET MY TASKS
    @GetMapping("/my")
    @Operation(
            summary = "Get My Tasks",
            description = "Get tasks assigned to the currently logged-in employee"
    )
    public ResponseEntity<List<Task>> getMyTasks() {

        return ResponseEntity.ok(
                taskService.getMyTasks()
        );
    }

    // GET TASK BY ID
    @GetMapping("/{id}")
    @Operation(
            summary = "Get Task By ID",
            description = "Get task details using task ID"
    )
    public ResponseEntity<Task> getTaskById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                taskService.getTaskById(id)
        );
    }

    // UPDATE TASK
    @PutMapping("/{id}")
    @Operation(
            summary = "Update Task",
            description = "Update an existing task"
    )
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {

        return ResponseEntity.ok(
                taskService.updateTask(id, request)
        );
    }

    // DELETE TASK
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete Task",
            description = "Delete an existing task"
    )
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id) {

        taskService.deleteTask(id);

        return ResponseEntity.noContent().build();
    }
}