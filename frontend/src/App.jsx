import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/common/Home";
import Jobs from "./pages/common/Jobs";
import JobDetails from "./pages/common/JobDetails";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import SavedJobs from "./pages/student/SavedJobs";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CreateJob from "./pages/recruiter/CreateJob";
import EditJob from "./pages/recruiter/EditJob";
import Applications from "./pages/recruiter/Applications";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                {/* =========================================
                    PUBLIC ROUTES
                ========================================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/jobs"
                    element={<Jobs />}
                />

                <Route
                    path="/jobs/:id"
                    element={<JobDetails />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/about"
                    element={
                        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
                            <h1 className="text-4xl font-black text-slate-900">
                                About HireFlow
                            </h1>

                            <p className="mt-4 text-slate-500">
                                A modern platform connecting
                                students with career
                                opportunities.
                            </p>
                        </div>
                    }
                />

                {/* =========================================
                    STUDENT PROTECTED ROUTES
                ========================================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRole="student"
                        />
                    }
                >
                    <Route
                        path="/student/dashboard"
                        element={
                            <StudentDashboard />
                        }
                    />

                    <Route
                        path="/student/profile"
                        element={
                            <StudentProfile />
                        }
                    />

                    <Route
                        path="/student/saved-jobs"
                        element={
                            <SavedJobs />
                        }
                    />
                </Route>

                {/* =========================================
                    RECRUITER PROTECTED ROUTES
                ========================================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRole="recruiter"
                        />
                    }
                >
                    <Route
                        path="/recruiter/dashboard"
                        element={
                            <RecruiterDashboard />
                        }
                    />

                    <Route
                        path="/recruiter/jobs/create"
                        element={
                            <CreateJob />
                        }
                    />

                    <Route
                        path="/recruiter/jobs/edit/:id"
                        element={
                            <EditJob />
                        }
                    />

                    <Route
                        path="/recruiter/applications"
                        element={
                            <Applications />
                        }
                    />
                </Route>

                {/* =========================================
                    404
                ========================================= */}

                <Route
                    path="*"
                    element={
                        <div className="flex min-h-[70vh] items-center justify-center px-5">
                            <div className="text-center">
                                <h1 className="text-7xl font-black text-indigo-600">
                                    404
                                </h1>

                                <p className="mt-3 text-lg font-semibold text-slate-800">
                                    Page not found
                                </p>

                                <p className="mt-2 text-sm text-slate-500">
                                    The page you're looking
                                    for doesn't exist.
                                </p>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;