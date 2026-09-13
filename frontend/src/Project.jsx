import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Project() {
    const [projects, setProjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        projectCode: "",
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "PLANNED",
        budget: "",
        managerId: "",
    });

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchProjects = async () => {
        try {
            setError("");

            const response = await axios.get(
                "https://smart-business-erp.onrender.com/api/projects",
                authConfig
            );

            setProjects(response.data);
        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to load projects."
            );
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchProjects();
    }, [token, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setEditingId(null);

        setFormData({
            projectCode: "",
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            status: "PLANNED",
            budget: "",
            managerId: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const payload = {
            projectCode: formData.projectCode,
            name: formData.name,
            description: formData.description,
            startDate: formData.startDate,
            endDate: formData.endDate || null,
            status: formData.status,
            budget: Number(formData.budget),
            managerId: Number(formData.managerId),
        };

        try {
            if (editingId) {
                await axios.put(
                    `https://smart-business-erp.onrender.com/api/projects/${editingId}`,
                    payload,
                    authConfig
                );

                setMessage("Project updated successfully!");
            } else {
                await axios.post(
                    "https://smart-business-erp.onrender.com/api/projects",
                    payload,
                    authConfig
                );

                setMessage("Project created successfully!");
            }

            resetForm();
            fetchProjects();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to save project."
            );
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);

        setFormData({
            projectCode: project.projectCode || "",
            name: project.name || "",
            description: project.description || "",
            startDate: project.startDate || "",
            endDate: project.endDate || "",
            status: project.status || "PLANNED",
            budget:
                project.budget !== null &&
                project.budget !== undefined
                    ? String(project.budget)
                    : "",
            managerId: project.manager?.id
                ? String(project.manager.id)
                : "",
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");

        try {
            await axios.delete(
                `https://smart-business-erp.onrender.com/api/projects/${id}`,
                authConfig
            );

            setMessage("Project deleted successfully!");
            fetchProjects();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete project."
            );
        }
    };

    return (
        <div className="erp-layout">

            <Sidebar />

            <main className="main-content">

                <header className="topbar">
                    <div>
                        <h1>Projects</h1>
                        <p>Manage company projects</p>
                    </div>
                </header>

                <div className="page-content">

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

                    <div className="card">

                        <div className="card-header">
                            <div>
                                <h2>
                                    {editingId
                                        ? "Edit Project"
                                        : "Add New Project"}
                                </h2>

                                <p>
                                    {editingId
                                        ? "Update project information"
                                        : "Enter project details"}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label className="form-label">
                                        Project Code
                                    </label>

                                    <input
                                        type="text"
                                        name="projectCode"
                                        value={formData.projectCode}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="PROJ003"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Project Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="PLANNED">
                                            Planned
                                        </option>

                                        <option value="IN_PROGRESS">
                                            In Progress
                                        </option>

                                        <option value="COMPLETED">
                                            Completed
                                        </option>

                                        <option value="ON_HOLD">
                                            On Hold
                                        </option>

                                        <option value="CANCELLED">
                                            Cancelled
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Budget
                                    </label>

                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="form-input"
                                        min="1"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Manager Employee ID
                                    </label>

                                    <input
                                        type="number"
                                        name="managerId"
                                        value={formData.managerId}
                                        onChange={handleChange}
                                        className="form-input"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="form-textarea"
                                        rows="3"
                                    />
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                {editingId
                                    ? "Update Project"
                                    : "Add Project"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    style={{ marginLeft: "10px" }}
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}

                        </form>

                    </div>

                    <div className="card">

                        <div className="card-header">
                            <div>
                                <h2>Project List</h2>
                                <p>All company projects</p>
                            </div>
                        </div>

                        <div className="table-container">

                            <table className="data-table">

                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>Budget</th>
                                    <th>Manager</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>

                                <tbody>

                                {projects.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            style={{
                                                textAlign: "center",
                                            }}
                                        >
                                            No projects found.
                                        </td>
                                    </tr>
                                ) : (
                                    projects.map((project) => (
                                        <tr key={project.id}>

                                            <td>
                                                {project.id}
                                            </td>

                                            <td>
                                                {project.projectCode}
                                            </td>

                                            <td>
                                                {project.name}
                                            </td>

                                            <td>
                                                {project.startDate}
                                            </td>

                                            <td>
                                                {project.endDate || "-"}
                                            </td>

                                            <td>
                                                    <span className="status status-info">
                                                        {project.status}
                                                    </span>
                                            </td>

                                            <td>
                                                ₹ {project.budget}
                                            </td>

                                            <td>
                                                {project.manager
                                                    ? `${project.manager.firstName || ""} ${
                                                        project.manager.lastName || ""
                                                    }`.trim()
                                                    : "N/A"}
                                            </td>

                                            <td>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() =>
                                                        handleEdit(
                                                            project
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn btn-danger"
                                                    style={{
                                                        marginLeft: "8px",
                                                    }}
                                                    onClick={() =>
                                                        handleDelete(
                                                            project.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Project;