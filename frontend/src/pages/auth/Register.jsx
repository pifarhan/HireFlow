import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    UserRound,
    UsersRound,
} from "lucide-react";

import api from "../../services/api";

function Register() {
    const navigate = useNavigate();

    const [role, setRole] = useState("student");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const {
            name,
            email,
            password,
            confirmPassword,
        } = formData;

        /* Validation */

        if (
            !name.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters long."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            /* Register with backend */

            const response = await api.post("/auth/register", {
                name: name.trim(),
                email: email.trim(),
                password,
                role,
            });

            /* Save JWT if backend returns one */

            if (response.data?.token) {
                localStorage.setItem(
                    "token",
                    response.data.token
                );
            }

            /* Go to login after successful registration */

            navigate("/login");
        } catch (err) {
            console.error("Registration Error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to create your account right now."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="grid min-h-screen lg:grid-cols-2">

                {/* =========================================
                    LEFT — BRAND PANEL
                ========================================= */}

                <section className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 lg:flex">

                    <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

                    <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />

                    <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

                        {/* Logo */}

                        <Link
                            to="/"
                            className="flex w-fit items-center gap-3"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                                <BriefcaseBusiness size={23} />
                            </div>

                            <span className="text-2xl font-black tracking-tight text-white">
                                HireFlow
                            </span>
                        </Link>

                        {/* Main Content */}

                        <div className="max-w-xl">

                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-white/90 backdrop-blur-sm">
                                <UsersRound size={15} />
                                BUILD YOUR CAREER NETWORK
                            </span>

                            <h1 className="mt-7 text-5xl font-black leading-tight tracking-tight text-white xl:text-6xl">
                                Your next
                                <span className="block text-indigo-200">
                                    opportunity awaits.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-lg text-base leading-7 text-indigo-100/80">
                                Create your HireFlow account and
                                connect with opportunities that
                                match your ambitions.
                            </p>

                            {/* Benefits */}

                            <div className="mt-8 space-y-4">

                                <div className="flex items-center gap-3 text-sm text-indigo-100">
                                    <CheckCircle2
                                        size={18}
                                        className="text-indigo-200"
                                    />
                                    Discover relevant job opportunities
                                </div>

                                <div className="flex items-center gap-3 text-sm text-indigo-100">
                                    <CheckCircle2
                                        size={18}
                                        className="text-indigo-200"
                                    />
                                    Track your applications
                                </div>

                                <div className="flex items-center gap-3 text-sm text-indigo-100">
                                    <CheckCircle2
                                        size={18}
                                        className="text-indigo-200"
                                    />
                                    Build your professional profile
                                </div>

                            </div>
                        </div>

                        {/* Bottom */}

                        <div className="flex items-center gap-8 text-sm text-indigo-100/70">
                            <span>Career • Connect • Grow</span>

                            <span className="h-1 w-1 rounded-full bg-indigo-200/50" />

                            <span>HireFlow</span>
                        </div>

                    </div>
                </section>

                {/* =========================================
                    RIGHT — REGISTER FORM
                ========================================= */}

                <section className="flex items-center justify-center px-5 py-10 sm:px-8">

                    <div className="w-full max-w-md">

                        {/* Mobile Logo */}

                        <Link
                            to="/"
                            className="mb-8 flex items-center justify-center gap-2 lg:hidden"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white shadow-lg shadow-indigo-200">
                                <BriefcaseBusiness size={21} />
                            </div>

                            <span className="text-2xl font-black tracking-tight text-slate-900">
                                Hire
                                <span className="text-indigo-600">
                                    Flow
                                </span>
                            </span>
                        </Link>

                        {/* Heading */}

                        <div>
                            <span className="text-sm font-bold text-indigo-600">
                                GET STARTED
                            </span>

                            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                                Create your account
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Join HireFlow and take the next step
                                in your career journey.
                            </p>
                        </div>

                        {/* Error */}

                        {error && (
                            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Role Selection */}

                        <div className="mt-7">

                            <p className="mb-3 text-sm font-semibold text-slate-700">
                                I am registering as
                            </p>

                            <div className="grid grid-cols-2 gap-3">

                                {/* Student */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setRole("student")
                                    }
                                    className={`rounded-xl border p-4 text-left transition-all ${
                                        role === "student"
                                            ? "border-indigo-500 bg-indigo-50 shadow-sm"
                                            : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
                                    }`}
                                >
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                            role === "student"
                                                ? "bg-indigo-600 text-white"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        <UserRound size={18} />
                                    </div>

                                    <p className="mt-3 text-sm font-bold text-slate-900">
                                        Student
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Find opportunities
                                    </p>
                                </button>

                                {/* Recruiter */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setRole("recruiter")
                                    }
                                    className={`rounded-xl border p-4 text-left transition-all ${
                                        role === "recruiter"
                                            ? "border-indigo-500 bg-indigo-50 shadow-sm"
                                            : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
                                    }`}
                                >
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                            role === "recruiter"
                                                ? "bg-indigo-600 text-white"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        <Building2 size={18} />
                                    </div>

                                    <p className="mt-3 text-sm font-bold text-slate-900">
                                        Recruiter
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Hire great talent
                                    </p>
                                </button>

                            </div>
                        </div>

                        {/* Form */}

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 space-y-4"
                        >

                            {/* Name */}

                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Full name
                                </label>

                                <div className="relative">

                                    <UserRound
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                    />

                                </div>
                            </div>

                            {/* Email */}

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Email address
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                    />

                                </div>
                            </div>

                            {/* Password */}

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>

                                <div className="relative">

                                    <LockKeyhole
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                        autoComplete="new-password"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* Confirm Password */}

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Confirm password
                                </label>

                                <div className="relative">

                                    <LockKeyhole
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            formData.confirmPassword
                                        }
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* Submit */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create Account"}

                                {!loading && (
                                    <ArrowRight
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                )}
                            </button>

                        </form>

                        {/* Login */}

                        <p className="mt-7 text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-bold text-indigo-600 hover:text-indigo-700"
                            >
                                Sign in
                            </Link>
                        </p>

                        {/* Terms */}

                        <p className="mt-7 text-center text-xs leading-5 text-slate-400">
                            By creating an account, you agree to
                            HireFlow's terms and privacy policy.
                        </p>

                    </div>
                </section>
            </div>
        </main>
    );
}

export default Register;