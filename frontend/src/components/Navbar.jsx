import { useState } from "react";
import { Link } from "react-router-dom";
import {
    BriefcaseBusiness,
    Menu,
    X,
    LayoutDashboard,
    LogOut,
    UserCircle,
} from "lucide-react";

import { useAuth } from "../context/useAuth";

function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const {
        user,
        isAuthenticated,
        logout,
    } = useAuth();

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">

                {/* Logo */}
                <Link
                    to="/"
                    className="group flex items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white shadow-lg shadow-indigo-200 transition-transform duration-300 group-hover:scale-105">
                        <BriefcaseBusiness
                            size={21}
                            strokeWidth={2.2}
                        />
                    </div>

                    <div className="leading-none">
                        <span className="text-xl font-extrabold tracking-tight text-slate-900">
                            Hire
                            <span className="text-indigo-600">
                                Flow
                            </span>
                        </span>

                        <p className="mt-1 hidden text-[10px] font-medium tracking-widest text-slate-400 sm:block">
                            CAREER • CONNECT • GROW
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-7 md:flex">

                    <Link
                        to="/jobs"
                        className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
                    >
                        Find Jobs
                    </Link>

                    <Link
                        to="/about"
                        className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
                    >
                        About
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {/* User Info */}
                            <Link
                                to={
                                    user?.role === "recruiter"
                                        ? "/recruiter/dashboard"
                                        : "/student/profile"
                                }
                                className="flex items-center gap-3 border-l border-slate-200 pl-6 rounded-xl pr-2 py-1.5 transition-colors hover:bg-slate-50"
                                aria-label="Open profile"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                    <UserCircle size={21} />
                                </div>

                                <div className="leading-tight">
                                    <p className="max-w-32 truncate text-sm font-bold text-slate-800">
                                        {user?.name ||
                                            "User"}
                                    </p>

                                    <p className="text-[11px] font-medium capitalize text-slate-400">
                                        {user?.role ||
                                            "student"}
                                    </p>
                                </div>
                            </Link>

                            {/* Dashboard */}
                            <Link
                                to={
                                    user?.role ===
                                    "recruiter"
                                        ? "/recruiter/dashboard"
                                        : "/student/dashboard"
                                }
                                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md"
                            >
                                <LayoutDashboard
                                    size={17}
                                />
                                Dashboard
                            </Link>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                                <LogOut size={17} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-slate-700 transition-colors hover:text-indigo-600"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() =>
                        setMobileOpen(!mobileOpen)
                    }
                    className="rounded-xl p-2 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
                    aria-label="Toggle navigation"
                >
                    {mobileOpen ? (
                        <X size={23} />
                    ) : (
                        <Menu size={23} />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileOpen && (
                <div className="border-t border-slate-100 bg-white px-5 py-5 shadow-lg md:hidden">
                    <div className="flex flex-col gap-2">

                        <Link
                            to="/jobs"
                            onClick={() =>
                                setMobileOpen(false)
                            }
                            className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Find Jobs
                        </Link>

                        <Link
                            to="/about"
                            onClick={() =>
                                setMobileOpen(false)
                            }
                            className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            About
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={
                                        user?.role === "recruiter"
                                            ? "/recruiter/dashboard"
                                            : "/student/profile"
                                    }
                                    onClick={() =>
                                        setMobileOpen(false)
                                    }
                                    className="my-2 flex items-center gap-3 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-indigo-50"
                                    aria-label="Open profile"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                        <UserCircle
                                            size={22}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            {user?.name ||
                                                "User"}
                                        </p>

                                        <p className="text-xs capitalize text-slate-400">
                                            {user?.role ||
                                                "student"}
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    to={
                                        user?.role ===
                                        "recruiter"
                                            ? "/recruiter/dashboard"
                                            : "/student/dashboard"
                                    }
                                    onClick={() =>
                                        setMobileOpen(
                                            false
                                        )
                                    }
                                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    <LayoutDashboard
                                        size={18}
                                    />
                                    Dashboard
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() =>
                                        setMobileOpen(
                                            false
                                        )
                                    }
                                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={() =>
                                        setMobileOpen(
                                            false
                                        )
                                    }
                                    className="mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;