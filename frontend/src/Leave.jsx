import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Leave() {
    const [leaves, setLeaves] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        leaveType: "CASUAL",
        reason: "",
        startDate: "",
        endDate: "",
    });

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const getRole = () => {
        try {
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

    const fetchLeaves = async () => {
        try {
            setError("");

            const role = getRole();

            const url =
                role === "EMPLOYEE"
                    ? "https://smart-business-erp.onrender.com/api/leaves/my"
                    : "https://smart-business-erp.onrender.com/api/leaves";

            const response = await axios.get(
                url,
                authConfig
            );

            setLeaves(
                response.data.content ||
                response.data ||
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
                    "You do not have permission to view leaves."
                );
            } else {
                setError(
                    err.response?.data?.message ||
                    "Unable to load leaves."
                );
            }
        }
    };

    useEffect(() => {

        if (!token) {
            navigate("/login");
            return;
        }

        fetchLeaves();

    }, [token, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {

            await axios.post(
                "https://smart-business-erp.onrender.com/api/leaves",
                formData,
                authConfig
            );

            setMessage(
                "Leave application submitted successfully!"
            );

            setFormData({
                leaveType: "CASUAL",
                reason: "",
                startDate: "",
                endDate: "",
            });

            fetchLeaves();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to submit leave application."
            );
        }
    };

    const getStatusClass = (status) => {

        switch (status) {

            case "APPROVED":
                return "status status-success";

            case "REJECTED":
                return "status status-danger";

            case "PENDING":
                return "status status-warning";

            default:
                return "status";
        }
    };

    const role = getRole();

    return (
        <div className="erp-layout">

            <Sidebar />

            <main className="main-content">

                <header className="topbar">
                    <div>
                        <h1>Leave Management</h1>

                        <p>
                            Manage employee leave applications
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

                    <div className="card">

                        <div className="card-header">
                            <div>

                                <h2>
                                    Apply for Leave
                                </h2>

                                <p>
                                    Submit a new leave application
                                </p>

                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label className="form-label">
                                        Leave Type
                                    </label>

                                    <select
                                        name="leaveType"
                                        value={
                                            formData.leaveType
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="form-select"
                                        required
                                    >
                                        <option value="CASUAL">
                                            Casual
                                        </option>

                                        <option value="SICK">
                                            Sick
                                        </option>

                                        <option value="ANNUAL">
                                            Annual
                                        </option>

                                        <option value="OTHER">
                                            Other
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        name="startDate"
                                        value={
                                            formData.startDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="form-input"
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
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
                                        value={
                                            formData.endDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="form-input"
                                        min={
                                            formData.startDate ||
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">

                                    <label className="form-label">
                                        Reason
                                    </label>

                                    <textarea
                                        name="reason"
                                        value={
                                            formData.reason
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="form-textarea"
                                        rows="4"
                                        placeholder="Enter reason for leave"
                                        required
                                    />

                                </div>

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Apply Leave
                            </button>

                        </form>

                    </div>

                    <div className="card">

                        <div className="card-header">
                            <div>

                                <h2>
                                    {role === "EMPLOYEE"
                                        ? "My Leave Applications"
                                        : "Leave Applications"}
                                </h2>

                                <p>
                                    {role === "EMPLOYEE"
                                        ? "Your leave history"
                                        : "Employee leave records"}
                                </p>

                            </div>
                        </div>

                        <div className="table-container">

                            <table className="data-table">

                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Employee</th>
                                    <th>Leave Type</th>
                                    <th>Reason</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                </tr>
                                </thead>

                                <tbody>

                                {leaves.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            style={{
                                                textAlign:
                                                    "center",
                                            }}
                                        >
                                            No leave applications
                                            found.
                                        </td>
                                    </tr>
                                ) : (
                                    leaves.map(
                                        (leave) => (
                                            <tr
                                                key={
                                                    leave.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        leave.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        leave.employee
                                                            ? `${leave.employee.firstName || ""} ${
                                                                leave.employee.lastName || ""
                                                            }`.trim()
                                                            : "You"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        leave.leaveType
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        leave.reason
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        leave.startDate
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        leave.endDate
                                                    }
                                                </td>

                                                <td>
                                                        <span
                                                            className={getStatusClass(
                                                                leave.status
                                                            )}
                                                        >
                                                            {
                                                                leave.status
                                                            }
                                                        </span>
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

export default Leave;