import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";
import Employee from "./Employee";
import Project from "./Project";
import Task from "./Task";
import Leave from "./Leave";
import Attendance from "./Attendance";
import Assets from "./Assets";
import User from "./User";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/employees"
                    element={<Employee />}
                />

                <Route
                    path="/projects"
                    element={<Project />}
                />

                <Route
                    path="/tasks"
                    element={<Task />}
                />

                <Route
                    path="/leaves"
                    element={<Leave />}
                />

                <Route
                    path="/attendance"
                    element={<Attendance />}
                />

                <Route
                    path="/assets"
                    element={<Assets />}
                />
                <Route
                    path="/users"
                    element={<User />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;