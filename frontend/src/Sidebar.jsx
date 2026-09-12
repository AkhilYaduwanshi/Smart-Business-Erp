import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

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

    const role = getRole();

    const navItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "📊",
            roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
        },
        {
            name: "Employees",
            path: "/employees",
            icon: "👥",
            roles: ["ADMIN"],
        },
        {
            name: "Projects",
            path: "/projects",
            icon: "📁",
            roles: ["ADMIN", "MANAGER"],
        },
        {
            name: "Tasks",
            path: "/tasks",
            icon: "✅",
            roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
        },
        {
            name: "Leaves",
            path: "/leaves",
            icon: "🗓️",
            roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
        },
        {
            name: "Attendance",
            path: "/attendance",
            icon: "⏱️",
            roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
        },
        {
            name: "Assets",
            path: "/assets",
            icon: "💻",
            roles: ["ADMIN", "MANAGER"],
        },
        {
            name: "Users",
            path: "/users",
            icon: "🔐",
            roles: ["ADMIN"],
        },
    ];

    const visibleItems = navItems.filter((item) =>
        item.roles.includes(role)
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <aside className="sidebar">

            <div className="sidebar-brand">

                <div className="sidebar-brand-icon">
                    ERP
                </div>

                <div>
                    <div className="sidebar-brand-title">
                        Smart Business ERP
                    </div>

                    <div className="sidebar-brand-subtitle">
                        Management System
                    </div>
                </div>

            </div>

            <nav className="sidebar-nav">

                {visibleItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <span className="sidebar-link-icon">
                            {item.icon}
                        </span>

                        <span>{item.name}</span>
                    </NavLink>
                ))}

            </nav>

            <div className="sidebar-footer">

                <button
                    className="btn btn-secondary"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;