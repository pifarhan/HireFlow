import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    BriefcaseBusiness,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/useAuth";

function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const email = formData.email.trim();
        const password = formData.password;

        if (!email || !password) {
            setError(
                "Please enter your email and password."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password,
                }
            );

            const token = response.data?.token;
            const loggedInUser = response.data?.user;

            if (token) {
                localStorage.setItem(
                    "token",
                    token
                );
            }

            if (loggedInUser) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(loggedInUser)
                );

                // Immediately update AuthContext
                // so Navbar knows the user is logged in.
                setUser(loggedInUser);
            }

            // Send the user to the correct dashboard.
            if (loggedInUser?.role === "recruiter") {
                navigate("/recruiter/dashboard");
            } else {
                navigate("/student/dashboard");
            }
        } catch (err) {
            console.error(
                "Login Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-72px)] bg-slate-50 px-5 py-10 sm:py-14">
            <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 lg:grid-cols-2">

                {/* Left Brand Panel */}
                <section className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="relative z-10">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-3"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                                <BriefcaseBusiness
                                    size={23}
                                />
                            </div>

                            <span className="text-2xl font-black tracking-tight">
                                HireFlow
                            </span>
                        </Link>

                        <div className="mt-20 max-w-md">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                                <ShieldCheck
                                    size={14}
                                />
                                Secure career platform
                            </div>

                            <h1 className="text-4xl font-black leading-tight xl:text-5xl">
                                Your next opportunity
                                starts here.
                            </h1>

                            <p className="mt-5 text-sm leading-7 text-indigo-100 xl:text-base">
                                Sign in to discover opportunities,
                                manage your applications, and
                                connect with recruiters.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-16 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                            <p className="text-2xl font-black">
                                1K+
                            </p>
                            <p className="mt-1 text-[11px] text-indigo-100">
                                Opportunities
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                            <p className="text-2xl font-black">
                                500+
                            </p>
                            <p className="mt-1 text-[11px] text-indigo-100">
                                Candidates
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                            <p className="text-2xl font-black">
                                100+
                            </p>
                            <p className="mt-1 text-[11px] text-indigo-100">
                                Recruiters
                            </p>
                        </div>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

                    <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
                </section>

                {/* Login Panel */}
                <section className="p-7 sm:p-10 lg:p-12">
                    <div className="mx-auto max-w-md">

                        {/* Mobile Brand */}
                        <div className="mb-8 flex items-center gap-3 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white shadow-lg shadow-indigo-200">
                                <BriefcaseBusiness
                                    size={21}
                                />
                            </div>

                            <span className="text-xl font-black text-slate-900">
                                Hire
                                <span className="text-indigo-600">
                                    Flow
                                </span>
                            </span>
                        </div>

                        {/* Heading */}
                        <div>
                            <p className="text-sm font-bold text-indigo-600">
                                Welcome back
                            </p>

                            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                                Sign in to HireFlow
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Access your account and continue
                                your career journey.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-5"
                        >
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-bold text-slate-700"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-bold text-slate-700"
                                    >
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <div className="relative">
                                    <LockKeyhole
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            formData.password
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff
                                                size={18}
                                            />
                                        ) : (
                                            <Eye
                                                size={18}
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                                {loading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight
                                            size={17}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Register */}
                        <div className="mt-8 border-t border-slate-100 pt-7 text-center">
                            <p className="text-sm text-slate-500">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-bold text-indigo-600 hover:text-indigo-700"
                                >
                                    Create one
                                </Link>
                            </p>
                        </div>

                        {/* Security Note */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                            <ShieldCheck size={14} />
                            Your account is securely authenticated.
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Login;