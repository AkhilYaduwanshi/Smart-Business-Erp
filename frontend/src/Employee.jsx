import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Employee() {
    const [employees, setEmployees] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        employeeCode: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        salary: "",
        joiningDate: "",
        status: "ACTIVE",
    });

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchEmployees = async () => {
        try {
            setError("");

            const response = await axios.get(
                "http://localhost:8081/api/employees?page=0&size=50&sortBy=id&direction=asc",
                authConfig
            );

            setEmployees(response.data.content || response.data);
        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to load employees."
            );
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchEmployees();
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
            employeeCode: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            department: "",
            designation: "",
            salary: "",
            joiningDate: "",
            status: "ACTIVE",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const payload = {
            employeeCode: formData.employeeCode,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            department: formData.department,
            designation: formData.designation,
            salary: Number(formData.salary),
            joiningDate: formData.joiningDate,
            status: formData.status,
        };

        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:8081/api/employees/${editingId}`,
                    payload,
                    authConfig
                );

                setMessage("Employee updated successfully!");
            } else {
                await axios.post(
                    "http://localhost:8081/api/employees",
                    payload,
                    authConfig
                );

                setMessage("Employee added successfully!");
            }

            resetForm();
            fetchEmployees();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to save employee."
            );
        }
    };

    const handleEdit = (employee) => {
        setEditingId(employee.id);

        setFormData({
            employeeCode: employee.employeeCode || "",
            firstName: employee.firstName || "",
            lastName: employee.lastName || "",
            email: employee.email || "",
            phone: employee.phone || "",
            department: employee.department || "",
            designation: employee.designation || "",
            salary:
                employee.salary !== null &&
                employee.salary !== undefined
                    ? String(employee.salary)
                    : "",
            joiningDate: employee.joiningDate || "",
            status: employee.status || "ACTIVE",
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
            "Are you sure you want to delete this employee?"
        );

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");

        try {
            await axios.delete(
                `http://localhost:8081/api/employees/${id}`,
                authConfig
            );

            setMessage("Employee deleted successfully!");
            fetchEmployees();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete employee."
            );
        }
    };

    return (
        <div className="erp-layout">

            <Sidebar />

            <main className="main-content">

                <header className="topbar">
                    <div>
                        <h1>Employees</h1>
                        <p>Manage employee information</p>
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
                                        ? "Edit Employee"
                                        : "Add New Employee"}
                                </h2>

                                <p>
                                    {editingId
                                        ? "Update employee information"
                                        : "Enter employee details"}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label className="form-label">
                                        Employee Code
                                    </label>

                                    <input
                                        type="text"
                                        name="employeeCode"
                                        value={formData.employeeCode}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="EMP005"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Department
                                    </label>

                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Designation
                                    </label>

                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Salary
                                    </label>

                                    <input
                                        type="number"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        className="form-input"
                                        min="1"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Joining Date
                                    </label>

                                    <input
                                        type="date"
                                        name="joiningDate"
                                        value={formData.joiningDate}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
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
                                        <option value="ACTIVE">
                                            Active
                                        </option>

                                        <option value="INACTIVE">
                                            Inactive
                                        </option>

                                        <option value="ON_LEAVE">
                                            On Leave
                                        </option>

                                        <option value="TERMINATED">
                                            Terminated
                                        </option>
                                    </select>
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                {editingId
                                    ? "Update Employee"
                                    : "Add Employee"}
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
                                <h2>Employee List</h2>
                                <p>All registered employees</p>
                            </div>
                        </div>

                        <div className="table-container">

                            <table className="data-table">

                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th>Salary</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>

                                <tbody>

                                {employees.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            style={{
                                                textAlign: "center",
                                            }}
                                        >
                                            No employees found.
                                        </td>
                                    </tr>
                                ) : (
                                    employees.map((employee) => (
                                        <tr key={employee.id}>

                                            <td>
                                                {employee.id}
                                            </td>

                                            <td>
                                                {employee.employeeCode}
                                            </td>

                                            <td>
                                                {employee.firstName}{" "}
                                                {employee.lastName || ""}
                                            </td>

                                            <td>
                                                {employee.email}
                                            </td>

                                            <td>
                                                {employee.department}
                                            </td>

                                            <td>
                                                {employee.designation}
                                            </td>

                                            <td>
                                                ₹{" "}
                                                {employee.salary}
                                            </td>

                                            <td>
                                                    <span className="status status-success">
                                                        {employee.status}
                                                    </span>
                                            </td>

                                            <td>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() =>
                                                        handleEdit(
                                                            employee
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn btn-danger"
                                                    style={{
                                                        marginLeft:
                                                            "8px",
                                                    }}
                                                    onClick={() =>
                                                        handleDelete(
                                                            employee.id
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

export default Employee;