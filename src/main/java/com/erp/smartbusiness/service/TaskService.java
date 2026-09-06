package com.erp.smartbusiness.service;

import com.erp.smartbusiness.dto.TaskRequest;
import com.erp.smartbusiness.entity.Employee;
import com.erp.smartbusiness.entity.Project;
import com.erp.smartbusiness.entity.Task;
import com.erp.smartbusiness.entity.User;
import com.erp.smartbusiness.exception.ResourceNotFoundException;
import com.erp.smartbusiness.repository.EmployeeRepository;
import com.erp.smartbusiness.repository.ProjectRepository;
import com.erp.smartbusiness.repository.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;
    private final CurrentUserService currentUserService;

    public TaskService(
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            EmployeeRepository employeeRepository,
            CurrentUserService currentUserService) {

        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
        this.currentUserService = currentUserService;
    }

    // CREATE TASK
    public Task createTask(TaskRequest request) {

        if (taskRepository.existsByTaskCode(request.getTaskCode())) {
            throw new RuntimeException("Task code already exists");
        }

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: "
                                        + request.getProjectId()
                        ));

        Employee employee = employeeRepository.findById(request.getAssignedToId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: "
                                        + request.getAssignedToId()
                        ));

        Task task = new Task();

        task.setTaskCode(request.getTaskCode());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());
        task.setProject(project);
        task.setAssignedTo(employee);

        return taskRepository.save(task);
    }

    // GET ALL TASKS + FILTER + PAGINATION + SORTING
    public Page<Task> getAllTasks(
            String status,
            String priority,
            int page,
            int size,
            String sortBy,
            String direction) {

        if (page < 0) {
            throw new IllegalArgumentException(
                    "Page number cannot be negative"
            );
        }

        if (size <= 0) {
            throw new IllegalArgumentException(
                    "Page size must be greater than zero"
            );
        }

        List<Task> tasks;

        if (status != null && !status.isBlank()) {

            if (priority != null && !priority.isBlank()) {

                tasks = taskRepository.findByStatus(status)
                        .stream()
                        .filter(task ->
                                task.getPriority() != null
                                        && task.getPriority()
                                        .equalsIgnoreCase(priority))
                        .toList();

            } else {

                tasks = taskRepository.findByStatus(status);
            }

        } else if (priority != null && !priority.isBlank()) {

            tasks = taskRepository.findByPriority(priority);

        } else {

            tasks = taskRepository.findAll();
        }

        Sort sort;

        if ("desc".equalsIgnoreCase(direction)) {
            sort = Sort.by(sortBy).descending();
        } else {
            sort = Sort.by(sortBy).ascending();
        }

        // Apply pagination and sorting to filtered result
        int start = page * size;

        if (start >= tasks.size()) {

            return new org.springframework.data.domain.PageImpl<>(
                    List.of(),
                    PageRequest.of(page, size, sort),
                    tasks.size()
            );
        }

        int end = Math.min(start + size, tasks.size());

        List<Task> pageContent = tasks.subList(start, end);

        Pageable pageable = PageRequest.of(page, size, sort);

        pageContent = pageContent.stream()
                .sorted((task1, task2) -> {

                    Object value1 = getSortValue(task1, sortBy);
                    Object value2 = getSortValue(task2, sortBy);

                    if (value1 == null && value2 == null) {
                        return 0;
                    }

                    if (value1 == null) {
                        return 1;
                    }

                    if (value2 == null) {
                        return -1;
                    }

                    int result = compareValues(value1, value2);

                    return "desc".equalsIgnoreCase(direction)
                            ? -result
                            : result;
                })
                .toList();

        return new org.springframework.data.domain.PageImpl<>(
                pageContent,
                pageable,
                tasks.size()
        );
    }

    // GET MY TASKS
    public List<Task> getMyTasks() {

        User currentUser = currentUserService.getCurrentUser();

        Employee employee = currentUser.getEmployee();

        if (employee == null) {
            throw new ResourceNotFoundException(
                    "No employee profile linked to current user"
            );
        }

        return taskRepository.findByAssignedToId(employee.getId());
    }

    // GET TASK BY ID
    public Task getTaskById(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found with id: " + id
                        ));

        verifyEmployeeOwnership(task);

        return task;
    }

    // UPDATE TASK
    public Task updateTask(Long id, TaskRequest request) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found with id: " + id
                        ));

        verifyEmployeeOwnership(task);

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: "
                                        + request.getProjectId()
                        ));

        Employee employee = employeeRepository.findById(
                request.getAssignedToId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Employee not found with id: "
                                + request.getAssignedToId()
                ));

        task.setTaskCode(request.getTaskCode());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());
        task.setProject(project);
        task.setAssignedTo(employee);

        return taskRepository.save(task);
    }

    // DELETE TASK
    public void deleteTask(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found with id: " + id
                        ));

        verifyEmployeeOwnership(task);

        taskRepository.delete(task);
    }

    // CHECK EMPLOYEE OWNERSHIP
    private void verifyEmployeeOwnership(Task task) {

        User currentUser = currentUserService.getCurrentUser();

        // ADMIN and MANAGER can access any task
        if (!"EMPLOYEE".equalsIgnoreCase(currentUser.getRole())) {
            return;
        }

        Employee employee = currentUser.getEmployee();

        if (employee == null
                || task.getAssignedTo() == null
                || !task.getAssignedTo()
                .getId()
                .equals(employee.getId())) {

            throw new AccessDeniedException(
                    "You are not allowed to access this task"
            );
        }
    }

    // Get value used for sorting
    private Object getSortValue(Task task, String sortBy) {

        return switch (sortBy) {

            case "id" -> task.getId();

            case "taskCode" -> task.getTaskCode();

            case "title" -> task.getTitle();

            case "priority" -> task.getPriority();

            case "status" -> task.getStatus();

            case "dueDate" -> task.getDueDate();

            default -> throw new IllegalArgumentException(
                    "Invalid sort field: " + sortBy
            );
        };
    }

    // Compare sort values
    @SuppressWarnings({"unchecked", "rawtypes"})
    private int compareValues(Object value1, Object value2) {

        return ((Comparable) value1).compareTo(value2);
    }
}