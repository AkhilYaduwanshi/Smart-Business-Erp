package com.erp.smartbusiness.dto;

public class DashboardResponse {

    private long totalEmployees;
    private long totalProjects;
    private long totalTasks;
    private long pendingLeaves;
    private long approvedLeaves;
    private long totalAssets;

    public DashboardResponse() {
    }

    public DashboardResponse(
            long totalEmployees,
            long totalProjects,
            long totalTasks,
            long pendingLeaves,
            long approvedLeaves,
            long totalAssets) {

        this.totalEmployees = totalEmployees;
        this.totalProjects = totalProjects;
        this.totalTasks = totalTasks;
        this.pendingLeaves = pendingLeaves;
        this.approvedLeaves = approvedLeaves;
        this.totalAssets = totalAssets;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getPendingLeaves() {
        return pendingLeaves;
    }

    public void setPendingLeaves(long pendingLeaves) {
        this.pendingLeaves = pendingLeaves;
    }

    public long getApprovedLeaves() {
        return approvedLeaves;
    }

    public void setApprovedLeaves(long approvedLeaves) {
        this.approvedLeaves = approvedLeaves;
    }

    public long getTotalAssets() {
        return totalAssets;
    }

    public void setTotalAssets(long totalAssets) {
        this.totalAssets = totalAssets;
    }
}