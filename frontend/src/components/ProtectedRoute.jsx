import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/useAuth";

function ProtectedRoute({ allowedRole }) {
    const {
        user,
        loading,
        isAuthenticated,
    } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-5">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

                    <p className="mt-4 text-sm font-medium text-slate-500">
                        Loading your account...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (
        allowedRole &&
        user.role !== allowedRole
    ) {
        return (
            <Navigate
                to={
                    user.role === "recruiter"
                        ? "/recruiter/dashboard"
                        : "/student/dashboard"
                }
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;