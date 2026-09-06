package com.erp.smartbusiness.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class TaskRequest {

    @NotBlank(message = "Task code is required")
    private String taskCode;

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    @NotBlank(message = "Priority is required")
    private String priority;

    @NotBlank(message = "Status is required")
    private String status;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotNull(message = "Assigned employee ID is required")
    private Long assignedToId;

    public TaskRequest() {
    }

    public String getTaskCode() {
        return taskCode;
    }

    public void setTaskCode(String taskCode) {
        this.taskCode = taskCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getAssignedToId() {
        return assignedToId;
    }

    public void setAssignedToId(Long assignedToId) {
        this.assignedToId = assignedToId;
    }
}