import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Task() {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        taskCode: "",
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "PENDING",
        dueDate: "",
        projectId: "",
        assignedToId: "",
    });

    const navigate = useNavigate();

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const getRole = () => {
        try {
            const token = getToken();

            if (!token) {
                return null;
            }

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            return (payload.role || "")
                .replace("ROLE_", "")
                .toUpperCase();
        } catch {
            return null;
        }
    };

    const authConfig = () => ({
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    useEffect(() => {
        loadPageData();
    }, []);

    const loadPageData = async () => {
        const token = getToken();
        const role = getRole();

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            setError("");

            if (role === "EMPLOYEE") {

                const response = await axios.get(
                    "https://smart-business-erp.onrender.com/api/tasks/my",
                    authConfig()
                );

                setTasks(
                    response.data.content ||
                    response.data ||
                    []
                );

                setProjects([]);
                setEmployees([]);

            } else {

                const [
                    taskResponse,
                    projectResponse,
                    employeeResponse,
                ] = await Promise.all([

                    axios.get(
                        "https://smart-business-erp.onrender.com/api/tasks",
                        {
                            ...authConfig(),
                            params: {
                                page: 0,
                                size: 50,
                                sortBy: "id",
                                direction: "asc",
                            },
                        }
                    ),

                    axios.get(
                        "https://smart-business-erp.onrender.com/api/projects",
                        authConfig()
                    ),

                    axios.get(
                        "https://smart-business-erp.onrender.com/api/employees",
                        {
                            ...authConfig(),
                            params: {
                                page: 0,
                                size: 100,
                                sortBy: "id",
                                direction: "asc",
                            },
                        }
                    ),
                ]);

                setTasks(
                    taskResponse.data.content ||
                    taskResponse.data ||
                    []
                );

                setProjects(
                    projectResponse.data || []
                );

                setEmployees(
                    employeeResponse.data.content ||
                    employeeResponse.data ||
                    []
                );
            }

            setMessage("");

        } catch (err) {

            console.error(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (err.response?.status === 403) {
                setError(
                    "You do not have permission to access tasks."
                );
            } else {
                setError(
                    err.response?.data?.message ||
                    "Unable to load task data."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            taskCode: "",
            title: "",
            description: "",
            priority: "MEDIUM",
            status: "PENDING",
            dueDate: "",
            projectId: "",
            assignedToId: "",
        });

        setEditingTask(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleAddClick = () => {
        resetForm();
        setMessage("");
        setError("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleEditClick = (task) => {
        setEditingTask(task);

        setFormData({
            taskCode: task.taskCode || "",
            title: task.title || "",
            description: task.description || "",
            priority: task.priority || "MEDIUM",
            status: task.status || "PENDING",
            dueDate: task.dueDate || "",

            projectId:
                task.project?.id ??
                task.projectId ??
                "",

            assignedToId:
                task.assignedTo?.id ??
                task.assignedToId ??
                "",
        });

        setMessage("");
        setError("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (taskId) => {
        const token = getToken();

        if (!token) {
            navigate("/login");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");

        try {

            await axios.delete(
                `https://smart-business-erp.onrender.com/api/tasks/${taskId}`,
                authConfig()
            );

            setMessage("Task deleted successfully.");

            await loadPageData();

        } catch (err) {

            console.error(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");

            } else if (err.response?.status === 403) {
                setError(
                    "You do not have permission to delete this task."
                );

            } else {
                setError("Unable to delete task.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = getToken();

        if (!token) {
            navigate("/login");
            return;
        }

        setFormLoading(true);
        setMessage("");
        setError("");

        const payload = {
            ...formData,
            projectId: Number(formData.projectId),
            assignedToId: Number(formData.assignedToId),
        };

        try {

            if (editingTask) {

                await axios.put(
                    `https://smart-business-erp.onrender.com/api/tasks/${editingTask.id}`,
                    payload,
                    authConfig()
                );

                setMessage(
                    "Task updated successfully."
                );

            } else {

                await axios.post(
                    "https://smart-business-erp.onrender.com/api/tasks",
                    payload,
                    authConfig()
                );

                setMessage(
                    "Task added successfully."
                );
            }

            resetForm();
            setShowForm(false);

            await loadPageData();

        } catch (err) {

            console.error(err);

            if (err.response?.status === 400) {

                const responseData =
                    err.response?.data;

                setError(
                    responseData?.message ||
                    "Please check the task details."
                );

            } else if (err.response?.status === 409) {

                setError(
                    err.response?.data?.message ||
                    "Task code already exists."
                );

            } else if (err.response?.status === 403) {

                setError(
                    "You do not have permission to modify this task."
                );

            } else if (err.response?.status === 401) {

                localStorage.removeItem("token");
                navigate("/login");

            } else {

                setError(
                    editingTask
                        ? "Unable to update task."
                        : "Unable to add task."
                );
            }

        } finally {
            setFormLoading(false);
        }
    };

    const getProjectName = (task) => {

        if (task.project?.name) {
            return task.project.name;
        }

        const project = projects.find(
            (item) =>
                item.id === task.projectId
        );

        return project?.name || "-";
    };

    const getEmployeeName = (task) => {

        if (task.assignedTo?.firstName) {
            return `${task.assignedTo.firstName} ${
                task.assignedTo.lastName || ""
            }`.trim();
        }

        const employee = employees.find(
            (item) =>
                item.id === task.assignedToId
        );

        if (employee) {
            return `${employee.firstName} ${
                employee.lastName || ""
            }`.trim();
        }

        return "-";
    };

    const getPriorityClass = (priority) => {

        switch (priority) {
            case "HIGH":
                return "status status-danger";

            case "MEDIUM":
                return "status status-warning";

            case "LOW":
                return "status status-info";

            default:
                return "status";
        }
    };

    const getStatusClass = (status) => {

        switch (status) {
            case "COMPLETED":
                return "status status-success";

            case "IN_PROGRESS":
                return "status status-info";

            case "CANCELLED":
                return "status status-danger";

            case "PENDING":
                return "status status-warning";

            default:
                return "status";
        }
    };

    const role = getRole();

    if (loading) {
        return (
            <div className="login-page">
                <div className="login-card">
                    <h2>Loading Tasks...</h2>
                    <p>Please wait...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="erp-layout">

            <Sidebar />

            <main className="main-content">

                <header className="topbar">
                    <div>
                        <h1>Tasks</h1>

                        <p>
                            Manage and track project tasks
                        </p>
                    </div>
                </header>

                <section className="page-content">

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "15px",
                            flexWrap: "wrap",
                            marginBottom: "24px",
                        }}
                    >
                        <div className="page-heading">
                            <h2>Task Management</h2>

                            <p>
                                {role === "EMPLOYEE"
                                    ? "View your assigned tasks."
                                    : "Create, assign and track project tasks."}
                            </p>
                        </div>

                        {role !== "EMPLOYEE" && (
                            <button
                                className="btn btn-primary"
                                onClick={handleAddClick}
                            >
                                + Add Task
                            </button>
                        )}
                    </div>

                    {message && (
                        <div className="card">
                            <p className="status status-success">
                                {message}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="card">
                            <p className="status status-danger">
                                {error}
                            </p>
                        </div>
                    )}

                    {showForm && role !== "EMPLOYEE" && (
                        <div className="card">

                            <div className="card-header">
                                <div>
                                    <h2>
                                        {editingTask
                                            ? "Edit Task"
                                            : "Add New Task"}
                                    </h2>

                                    <p>
                                        Enter task information
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>

                                <div className="form-grid">

                                    <div className="form-group">
                                        <label className="form-label">
                                            Task Code
                                        </label>

                                        <input
                                            className="form-input"
                                            name="taskCode"
                                            value={
                                                formData.taskCode
                                            }
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Task Title
                                        </label>

                                        <input
                                            className="form-input"
                                            name="title"
                                            value={
                                                formData.title
                                            }
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Priority
                                        </label>

                                        <select
                                            className="form-select"
                                            name="priority"
                                            value={
                                                formData.priority
                                            }
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="LOW">
                                                Low
                                            </option>

                                            <option value="MEDIUM">
                                                Medium
                                            </option>

                                            <option value="HIGH">
                                                High
                                            </option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Status
                                        </label>

                                        <select
                                            className="form-select"
                                            name="status"
                                            value={
                                                formData.status
                                            }
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="PENDING">
                                                Pending
                                            </option>

                                            <option value="IN_PROGRESS">
                                                In Progress
                                            </option>

                                            <option value="COMPLETED">
                                                Completed
                                            </option>

                                            <option value="CANCELLED">
                                                Cancelled
                                            </option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Due Date
                                        </label>

                                        <input
                                            className="form-input"
                                            type="date"
                                            name="dueDate"
                                            value={
                                                formData.dueDate
                                            }
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Project
                                        </label>

                                        <select
                                            className="form-select"
                                            name="projectId"
                                            value={
                                                formData.projectId
                                            }
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">
                                                Select Project
                                            </option>

                                            {projects.map(
                                                (project) => (
                                                    <option
                                                        key={
                                                            project.id
                                                        }
                                                        value={
                                                            project.id
                                                        }
                                                    >
                                                        {
                                                            project.name
                                                        }{" "}
                                                        (
                                                        {
                                                            project.projectCode
                                                        }
                                                        )
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Assigned Employee
                                        </label>

                                        <select
                                            className="form-select"
                                            name="assignedToId"
                                            value={
                                                formData.assignedToId
                                            }
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">
                                                Select Employee
                                            </option>

                                            {employees.map(
                                                (employee) => (
                                                    <option
                                                        key={
                                                            employee.id
                                                        }
                                                        value={
                                                            employee.id
                                                        }
                                                    >
                                                        {
                                                            employee.firstName
                                                        }{" "}
                                                        {
                                                            employee.lastName ||
                                                            ""
                                                        }{" "}
                                                        (
                                                        {
                                                            employee.employeeCode
                                                        }
                                                        )
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Description
                                        </label>

                                        <textarea
                                            className="form-textarea"
                                            name="description"
                                            value={
                                                formData.description
                                            }
                                            onChange={handleChange}
                                            rows="4"
                                        />
                                    </div>

                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: "10px",
                                        marginTop: "20px",
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowForm(false);
                                            resetForm();
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={formLoading}
                                    >
                                        {formLoading
                                            ? "Saving..."
                                            : editingTask
                                                ? "Update Task"
                                                : "Save Task"}
                                    </button>
                                </div>

                            </form>

                        </div>
                    )}

                    <div className="card">

                        <div className="card-header">
                            <div>
                                <h2>Task List</h2>

                                <p>
                                    {role === "EMPLOYEE"
                                        ? "Your assigned tasks"
                                        : "All project tasks"}
                                </p>
                            </div>
                        </div>

                        <div className="table-container">

                            <table className="data-table">

                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Task Code</th>
                                    <th>Title</th>
                                    <th>Project</th>
                                    <th>Assigned To</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Due Date</th>
                                    {role !== "EMPLOYEE" && (
                                        <th>Actions</th>
                                    )}
                                </tr>
                                </thead>

                                <tbody>

                                {tasks.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={
                                                role !== "EMPLOYEE"
                                                    ? "9"
                                                    : "8"
                                            }
                                            style={{
                                                textAlign: "center",
                                            }}
                                        >
                                            No tasks found.
                                        </td>
                                    </tr>
                                ) : (
                                    tasks.map((task) => (
                                        <tr key={task.id}>

                                            <td>
                                                {task.id}
                                            </td>

                                            <td>
                                                {task.taskCode || "-"}
                                            </td>

                                            <td>
                                                {task.title || "-"}
                                            </td>

                                            <td>
                                                {getProjectName(task)}
                                            </td>

                                            <td>
                                                {getEmployeeName(task)}
                                            </td>

                                            <td>
                                                    <span
                                                        className={getPriorityClass(
                                                            task.priority
                                                        )}
                                                    >
                                                        {
                                                            task.priority ||
                                                            "-"
                                                        }
                                                    </span>
                                            </td>

                                            <td>
                                                    <span
                                                        className={getStatusClass(
                                                            task.status
                                                        )}
                                                    >
                                                        {
                                                            task.status ||
                                                            "-"
                                                        }
                                                    </span>
                                            </td>

                                            <td>
                                                {task.dueDate || "-"}
                                            </td>

                                            {role !== "EMPLOYEE" && (
                                                <td>
                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            gap: "8px",
                                                            flexWrap:
                                                                "wrap",
                                                        }}
                                                    >
                                                        <button
                                                            className="btn btn-secondary"
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    task
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    task.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            )}

                                        </tr>
                                    ))
                                )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Task;