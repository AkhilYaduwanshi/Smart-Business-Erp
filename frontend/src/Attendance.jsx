import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Attendance() {
    const [attendance, setAttendance] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        attendanceDate: "",
        checkIn: "",
        checkOut: "",
        status: "PRESENT",
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

    const fetchAttendance = async () => {

        try {

            setError("");

            const role = getRole();

            const url =
                role === "EMPLOYEE"
                    ? "https://smart-business-erp.onrender.com/api/attendance/my"
                    : "https://smart-business-erp.onrender.com/api/attendance";

            const response = await axios.get(
                url,
                authConfig
            );

            setAttendance(
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
                    "You do not have permission to view attendance."
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    "Unable to load attendance data."
                );
            }
        }
    };

    useEffect(() => {

        if (!token) {
            navigate("/login");
            return;
        }

        fetchAttendance();

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
                "https://smart-business-erp.onrender.com/api/attendance",
                formData,
                authConfig
            );

            setMessage(
                "Attendance marked successfully!"
            );

            setFormData({
                attendanceDate: "",
                checkIn: "",
                checkOut: "",
                status: "PRESENT",
            });

            fetchAttendance();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to mark attendance."
            );
        }
    };

    const getStatusClass = (status) => {

        switch (status) {

            case "PRESENT":
                return "status status-success";

            case "ABSENT":
                return "status status-danger";

            case "LATE":
                return "status status-warning";

            case "HALF_DAY":
                return "status status-info";

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

                        <h1>
                            Attendance
                        </h1>

                        <p>
                            Track and manage employee attendance
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
                                    Mark Attendance
                                </h2>

                                <p>
                                    Enter attendance details
                                </p>

                            </div>

                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="form-grid">

                                <div className="form-group">

                                    <label className="form-label">
                                        Attendance Date
                                    </label>

                                    <input
                                        type="date"
                                        name="attendanceDate"
                                        value={
                                            formData.attendanceDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="form-input"
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label className="form-label">
                                        Check In
                                    </label>

                                    <input
                                        type="time"
                                        name="checkIn"
                                        value={
                                            formData.checkIn
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="form-input"
                                    />

                                </div>

                                <div className="form-group">

                                    <label className="form-label">
                                        Check Out
                                    </label>

                                    <input
                                        type="time"
                                        name="checkOut"
                                        value={
                                            formData.checkOut
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="form-input"
                                    />

                                </div>

                                <div className="form-group">

                                    <label className="form-label">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="form-select"
                                        required
                                    >

                                        <option value="PRESENT">
                                            Present
                                        </option>

                                        <option value="ABSENT">
                                            Absent
                                        </option>

                                        <option value="LATE">
                                            Late
                                        </option>

                                        <option value="HALF_DAY">
                                            Half Day
                                        </option>

                                    </select>

                                </div>

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Mark Attendance
                            </button>

                        </form>

                    </div>

                    <div className="card">

                        <div className="card-header">

                            <div>

                                <h2>
                                    {role === "EMPLOYEE"
                                        ? "My Attendance"
                                        : "Attendance Records"}
                                </h2>

                                <p>
                                    {role === "EMPLOYEE"
                                        ? "Your attendance history"
                                        : "Employee attendance history"}
                                </p>

                            </div>

                        </div>

                        <div className="table-container">

                            <table className="data-table">

                                <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Employee</th>
                                    <th>Date</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Status</th>
                                </tr>

                                </thead>

                                <tbody>

                                {attendance.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            style={{
                                                textAlign:
                                                    "center",
                                            }}
                                        >
                                            No attendance records
                                            found.
                                        </td>

                                    </tr>

                                ) : (

                                    attendance.map(
                                        (record) => (

                                            <tr
                                                key={
                                                    record.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        record.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        record.employee
                                                            ? `${record.employee.firstName || ""} ${
                                                                record.employee.lastName || ""
                                                            }`.trim()
                                                            : "You"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        record.attendanceDate
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        record.checkIn ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        record.checkOut ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>

                                                        <span
                                                            className={getStatusClass(
                                                                record.status
                                                            )}
                                                        >
                                                            {
                                                                record.status
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

export default Attendance;