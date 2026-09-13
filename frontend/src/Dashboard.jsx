import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [message, setMessage] = useState("");

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

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(
                    "https://smart-business-erp.onrender.com/api/dashboard/summary",
                    authConfig
                );

                setDashboard(response.data);
                setMessage("");
            } catch (error) {
                console.error(error);

                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                if (error.response?.status === 403) {
                    setMessage(
                        "You do not have permission to access the dashboard."
                    );
                } else {
                    setMessage(
                        "Unable to load dashboard data."
                    );
                }
            }
        };

        fetchDashboard();
    }, [navigate, token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const role = getRole();

    if (message) {
        return (
            <div className="login-page">
                <div className="login-card">

                    <div className="login-logo">
                        ERP
                    </div>

                    <h2>
                        Dashboard
                    </h2>

                    <p className="status status-danger">
                        {message}
                    </p>

                    <button
                        className="btn btn-secondary"
                        onClick={handleLogout}
                    >
                        Back to Login
                    </button>

                </div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="login-page">
                <div className="login-card">

                    <div className="login-logo">
                        ERP
                    </div>

                    <h2>
                        Loading Dashboard...
                    </h2>

                    <p>
                        Please wait...
                    </p>

                </div>
            </div>
        );
    }

    const stats = [
        {
            title: "Total Employees",
            value: dashboard.totalEmployees ?? 0,
            icon: "👥",
        },
        {
            title: "Total Projects",
            value: dashboard.totalProjects ?? 0,
            icon: "📁",
        },
        {
            title: "Total Tasks",
            value: dashboard.totalTasks ?? 0,
            icon: "✅",
        },
        {
            title: "Pending Leaves",
            value: dashboard.pendingLeaves ?? 0,
            icon: "🕐",
        },
        {
            title: "Approved Leaves",
            value: dashboard.approvedLeaves ?? 0,
            icon: "✔",
        },
        {
            title: "Total Assets",
            value: dashboard.totalAssets ?? 0,
            icon: "💻",
        },
    ];

    return (
        <div className="erp-layout">

            {/* COMMON ROLE-BASED SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <main className="main-content">

                {/* TOP BAR */}
                <header className="topbar">

                    <div>
                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Overview of your business operations
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >

                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#e5efff",
                                color: "#2563eb",
                                fontWeight: "700",
                                fontSize: "18px",
                            }}
                        >
                            {role
                                ? role.charAt(0)
                                : "U"}
                        </div>

                        <div>
                            <strong>
                                {role || "USER"}
                            </strong>
                        </div>

                        <button
                            className="btn btn-secondary"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </header>

                {/* PAGE CONTENT */}
                <div className="page-content">

                    <div className="page-heading">

                        <div>

                            <h2>
                                Business Overview
                            </h2>

                            <p>
                                Monitor your business operations
                                from one place.
                            </p>

                        </div>

                    </div>

                    {/* STAT CARDS */}
                    <div className="stats-grid">

                        {stats.map((stat) => (

                            <div
                                className="stat-card"
                                key={stat.title}
                            >

                                <div className="stat-card-header">

                                    <span className="stat-card-title">
                                        {stat.title}
                                    </span>

                                    <span className="stat-card-icon">
                                        {stat.icon}
                                    </span>

                                </div>

                                <div className="stat-card-value">
                                    {stat.value}
                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;