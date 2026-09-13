import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function User() {
    const [users, setUsers] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "EMPLOYEE",
        employeeId: "",
    });

    const [resetUsername, setResetUsername] = useState(null);
    const [newPassword, setNewPassword] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchData = async () => {
        try {
            setError("");

            const [usersResponse, employeesResponse] =
                await Promise.all([
                    axios.get(
                        "https://smart-business-erp.onrender.com/api/users",
                        authConfig
                    ),

                    axios.get(
                        "https://smart-business-erp.onrender.com/api/employees",
                        {
                            ...authConfig,
                            params: {
                                page: 0,
                                size: 100,
                                sortBy: "id",
                                direction: "asc",
                            },
                        }
                    ),
                ]);

            setUsers(usersResponse.data);

            setEmployees(
                employeesResponse.data.content ||
                employeesResponse.data ||
                []
            );
        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            if (err.response?.status === 403) {
                setError(
                    "Only Admin can manage users."
                );
                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to load user data."
            );
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchData();
    }, [token, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setFormData({
            username: "",
            password: "",
            role: "EMPLOYEE",
            employeeId: "",
        });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!formData.employeeId) {
            setError("Please select an employee.");
            return;
        }

        const payload = {
            username: formData.username.trim(),
            password: formData.password,
            role: formData.role,
            employeeId: Number(formData.employeeId),
        };

        try {
            await axios.post(
                "https://smart-business-erp.onrender.com/api/users",
                payload,
                authConfig
            );

            setMessage(
                "User created successfully!"
            );

            resetForm();

            await fetchData();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to create user."
            );
        }
    };

    const handleResetPassword = async (username) => {
        if (!newPassword || newPassword.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        setMessage("");
        setError("");

        try {
            await axios.put(
                `https://smart-business-erp.onrender.com/api/users/${encodeURIComponent(
                    username
                )}/reset-password`,
                {
                    newPassword: newPassword,
                },
                authConfig
            );

            setMessage(
                "Password reset successfully!"
            );

            setResetUsername(null);
            setNewPassword("");
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to reset password."
            );
        }
    };

    const formatRole = (role) => {
        if (!role) {
            return "-";
        }

        return role
            .replace("ROLE_", "")
            .replaceAll("_", " ");
    };

    const isEmployeeAlreadyLinked = (employeeId) => {
        return users.some(
            (user) =>
                user.employeeId === employeeId ||
                user.employee?.id === employeeId
        );
    };

    return (
        <div className="erp-layout">

            <Sidebar />

            <main className="main-content">

                <header className="topbar">

                    <div>
                        <h1>User Management</h1>

                        <p>
                            Manage system users, roles and passwords
                        </p>
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

                    {/* CREATE USER */}

                    <div className="card">

                        <div className="card-header">

                            <div>
                                <h2>
                                    Create New User
                                </h2>

                                <p>
                                    Create login credentials for
                                    an employee
                                </p>
                            </div>

                        </div>

                        <form onSubmit={handleCreateUser}>

                            <div className="form-grid">

                                <div className="form-group">

                                    <label className="form-label">
                                        Username
                                    </label>

                                    <input
                                        type="text"
                                        name="username"
                                        value={
                                            formData.username
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="form-input"
                                        placeholder="employee2"
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={
                                            formData.password
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="form-input"
                                        placeholder="Minimum 6 characters"
                                        minLength="6"
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label className="form-label">
                                        Role
                                    </label>

                                    <select
                                        name="role"
                                        value={
                                            formData.role
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="form-select"
                                        required
                                    >

                                        <option value="ADMIN">
                                            Admin
                                        </option>

                                        <option value="MANAGER">
                                            Manager
                                        </option>

                                        <option value="EMPLOYEE">
                                            Employee
                                        </option>

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label className="form-label">
                                        Employee
                                    </label>

                                    <select
                                        name="employeeId"
                                        value={
                                            formData.employeeId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="form-select"
                                        required
                                    >

                                        <option value="">
                                            Select Employee
                                        </option>

                                        {employees.map(
                                            (employee) => {

                                                const linked =
                                                    isEmployeeAlreadyLinked(
                                                        employee.id
                                                    );

                                                return (
                                                    <option
                                                        key={
                                                            employee.id
                                                        }
                                                        value={
                                                            employee.id
                                                        }
                                                        disabled={
                                                            linked
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
                                                        {linked
                                                            ? " - User Already Exists"
                                                            : ""}
                                                    </option>
                                                );
                                            }
                                        )}

                                    </select>

                                    <small>
                                        Only employees without an
                                        existing user account can
                                        be selected.
                                    </small>

                                </div>

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Create User
                            </button>

                        </form>

                    </div>

                    {/* USERS TABLE */}

                    <div className="card">

                        <div className="card-header">

                            <div>
                                <h2>
                                    System Users
                                </h2>

                                <p>
                                    Registered application users
                                </p>
                            </div>

                        </div>

                        <div className="table-container">

                            <table className="data-table">

                                <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Employee</th>
                                    <th>Actions</th>
                                </tr>

                                </thead>

                                <tbody>

                                {users.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="5"
                                            style={{
                                                textAlign:
                                                    "center",
                                            }}
                                        >
                                            No users found.
                                        </td>
                                    </tr>

                                ) : (

                                    users.map(
                                        (user) => (

                                            <tr
                                                key={
                                                    user.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        user.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        user.username
                                                    }
                                                </td>

                                                <td>
                                                        <span className="status status-info">
                                                            {
                                                                formatRole(
                                                                    user.role
                                                                )
                                                            }
                                                        </span>
                                                </td>

                                                <td>
                                                    {user.employee
                                                        ? `${user.employee.firstName || ""} ${
                                                            user.employee.lastName || ""
                                                        }`.trim()
                                                        : user.employeeId ||
                                                        "-"}
                                                </td>

                                                <td>

                                                    {resetUsername ===
                                                    user.username ? (

                                                        <div
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                gap:
                                                                    "8px",
                                                                flexWrap:
                                                                    "wrap",
                                                            }}
                                                        >

                                                            <input
                                                                type="password"
                                                                value={
                                                                    newPassword
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    setNewPassword(
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="New password"
                                                                className="form-input"
                                                                style={{
                                                                    maxWidth:
                                                                        "180px",
                                                                }}
                                                            />

                                                            <button
                                                                type="button"
                                                                className="btn btn-primary"
                                                                onClick={() =>
                                                                    handleResetPassword(
                                                                        user.username
                                                                    )
                                                                }
                                                            >
                                                                Save
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary"
                                                                onClick={() => {
                                                                    setResetUsername(
                                                                        null
                                                                    );
                                                                    setNewPassword(
                                                                        ""
                                                                    );
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>

                                                        </div>

                                                    ) : (

                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary"
                                                            onClick={() => {
                                                                setResetUsername(
                                                                    user.username
                                                                );
                                                                setNewPassword(
                                                                    ""
                                                                );
                                                                setMessage(
                                                                    ""
                                                                );
                                                                setError(
                                                                    ""
                                                                );
                                                            }}
                                                        >
                                                            Reset Password
                                                        </button>

                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )

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

export default User;