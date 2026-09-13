import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(
                "https://smart-business-erp.onrender.com/api/auth/login",
                {
                    username,
                    password,
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            setMessage("Login successful!");

            setTimeout(() => {
                navigate("/dashboard");
            }, 500);

        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Invalid username or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                {/* LOGO */}

                <div className="login-logo">
                    ERP
                </div>

                {/* TITLE */}

                <h1>
                    Smart Business ERP
                </h1>

                <p className="login-subtitle">
                    Business Management System
                </p>

                {/* LOGIN FORM */}

                <form onSubmit={handleLogin}>

                    <div className="form-group">

                        <label className="form-label">
                            Username
                        </label>

                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            autoComplete="username"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label className="form-label">
                            Password
                        </label>

                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            autoComplete="current-password"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>

                {/* MESSAGE */}

                {message && (
                    <div
                        className={
                            message === "Login successful!"
                                ? "status status-success login-message"
                                : "status status-danger login-message"
                        }
                    >
                        {message}
                    </div>
                )}

                {/* FOOTER */}

                <div className="login-footer">
                    <p>
                        Smart Business ERP
                    </p>

                    <span>
                        Secure Business Management
                    </span>
                </div>

            </div>

        </div>
    );
}

export default Login;