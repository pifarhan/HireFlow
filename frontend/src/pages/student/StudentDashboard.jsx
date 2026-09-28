import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    FileText,
    Search,
    Sparkles,
    Target,
    TrendingUp,
    XCircle,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";
import api from "../../services/api";

function StudentDashboard() {
    const { user } = useAuth();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [profile, setProfile] = useState(user || null);

    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingApplications, setLoadingApplications] =
        useState(true);
    const [loadingProfile, setLoadingProfile] =
        useState(true);

    // =========================================
    // FETCH JOBS
    // =========================================

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/jobs");

                setJobs(
                    response.data?.jobs ||
                        response.data ||
                        []
                );
            } catch (error) {
                console.error(
                    "Failed to load jobs:",
                    error
                );
            } finally {
                setLoadingJobs(false);
            }
        };

        const timer = setTimeout(() => {
            fetchJobs();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    // =========================================
    // FETCH APPLICATIONS
    // =========================================

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                const response = await api.get(
                    "/applications/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setApplications(
                    response.data?.applications || []
                );
            } catch (error) {
                console.error(
                    "Failed to load applications:",
                    error
                );
            } finally {
                setLoadingApplications(false);
            }
        };

        const timer = setTimeout(() => {
            fetchApplications();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    // =========================================
    // FETCH PROFILE
    // =========================================

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                const response = await api.get(
                    "/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data?.user) {
                    setProfile(response.data.user);
                }
            } catch (error) {
                console.error(
                    "Failed to load profile:",
                    error
                );

                setProfile(user || null);
            } finally {
                setLoadingProfile(false);
            }
        };

        const timer = setTimeout(() => {
            fetchProfile();
        }, 0);

        return () => clearTimeout(timer);
    }, [user]);

    // =========================================
    // JOB DATA
    // =========================================

    const displayJobs = jobs.slice(0, 4);

    // =========================================
    // APPLICATION DATA
    // =========================================

    const totalApplications = applications.length;

    const underReview = applications.filter(
        (application) =>
            application.status === "Under Review"
    ).length;

    const shortlisted = applications.filter(
        (application) =>
            application.status === "Shortlisted"
    ).length;

    // =========================================
    // PROFILE COMPLETION
    // =========================================

    const profileCompletion = useMemo(() => {
        if (!profile) {
            return 0;
        }

        const fields = [
            profile.name,
            profile.phone,
            profile.location,
            profile.education,
            profile.skills?.length > 0
                ? profile.skills
                : "",
            profile.resume,
        ];

        const completedFields = fields.filter(
            (field) => {
                if (Array.isArray(field)) {
                    return field.length > 0;
                }

                return (
                    field &&
                    field.toString().trim() !== ""
                );
            }
        ).length;

        return Math.round(
            (completedFields / fields.length) * 100
        );
    }, [profile]);

    // =========================================
    // STATS
    // =========================================

    const stats = [
        {
            label: "Applications",
            value: totalApplications,
            icon: FileText,
            description: "Total submitted",
            iconClass:
                "bg-indigo-50 text-indigo-600",
        },
        {
            label: "Under Review",
            value: underReview,
            icon: Clock3,
            description: "Waiting for response",
            iconClass:
                "bg-amber-50 text-amber-600",
        },
        {
            label: "Shortlisted",
            value: shortlisted,
            icon: CheckCircle2,
            description: "Recruiter interest",
            iconClass:
                "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Profile Strength",
            value: loadingProfile
                ? "..."
                : `${profileCompletion}%`,
            icon: TrendingUp,
            description:
                profileCompletion === 100
                    ? "Profile complete"
                    : "Complete your profile",
            iconClass:
                "bg-violet-50 text-violet-600",
        },
    ];

    // =========================================
    // APPLICATION STATUS STYLE
    // =========================================

    const getStatusStyle = (status) => {
        switch (status) {
            case "Selected":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";

            case "Shortlisted":
                return "bg-indigo-50 text-indigo-700 border-indigo-200";

            case "Interview":
                return "bg-violet-50 text-violet-700 border-violet-200";

            case "Under Review":
                return "bg-amber-50 text-amber-700 border-amber-200";

            case "Rejected":
                return "bg-red-50 text-red-700 border-red-200";

            default:
                return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };

    // =========================================
    // APPLICATION STATUS ICON
    // =========================================

    const getStatusIcon = (status) => {
        if (status === "Selected") {
            return <CheckCircle2 size={14} />;
        }

        if (status === "Rejected") {
            return <XCircle size={14} />;
        }

        if (status === "Under Review") {
            return <Clock3 size={14} />;
        }

        return <FileText size={14} />;
    };

    return (
        <main className="min-h-[calc(100vh-72px)] bg-slate-50">
            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">

                {/* =========================================
                    WELCOME HEADER
                ========================================= */}

                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-7 text-white shadow-xl shadow-indigo-200 sm:p-10">

                    <div className="relative z-10 max-w-2xl">

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                            <Sparkles size={14} />
                            Student Dashboard
                        </div>

                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                            Welcome back,{" "}
                            {user?.name?.split(" ")[0] ||
                                "Student"}
                            !
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
                            Discover opportunities, track your
                            applications, and take the next step
                            toward your career.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">

                            <Link
                                to="/jobs"
                                className="inline-flex min-w-[145px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                <Search size={17} className="shrink-0 text-indigo-700" />
                                <span className="text-indigo-700">
                                    Explore Jobs
                                </span>
                                <ArrowRight
                                    size={16}
                                    className="shrink-0 text-indigo-700"
                                />
                            </Link>

                            <Link
                                to="/student/profile"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                            >
                                <Target size={17} />
                                {profileCompletion >= 100
                                    ? "Edit Profile"
                                    : "Complete Profile"}
                            </Link>
                        </div>
                    </div>

                    {/* Decorative Elements */}

                    <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

                    <div className="absolute -bottom-24 right-20 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />

                    <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 lg:block">
                        <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur-md">
                            <BriefcaseBusiness
                                size={64}
                                strokeWidth={1.4}
                                className="text-white/90"
                            />
                        </div>
                    </div>
                </section>

                {/* =========================================
                    STATS
                ========================================= */}

                <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="hf-card hf-card-hover p-5"
                            >
                                <div className="flex items-start justify-between">

                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            {stat.label}
                                        </p>

                                        <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                                            {stat.value}
                                        </p>
                                    </div>

                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                                    >
                                        <Icon size={21} />
                                    </div>
                                </div>

                                <p className="mt-3 text-xs font-medium text-slate-400">
                                    {stat.description}
                                </p>
                            </div>
                        );
                    })}
                </section>

                {/* =========================================
                    MAIN GRID
                ========================================= */}

                <section className="mt-7 grid gap-7 lg:grid-cols-[1fr_320px]">

                    {/* =====================================
                        APPLICATIONS
                    ===================================== */}

                    <div className="hf-card p-6 sm:p-7">

                        <div className="flex items-center justify-between gap-4">

                            <div>
                                <div className="flex items-center gap-2">

                                    <FileText
                                        size={18}
                                        className="text-indigo-600"
                                    />

                                    <h2 className="text-xl font-extrabold text-slate-900">
                                        My Applications
                                    </h2>
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Track your latest job applications
                                </p>
                            </div>

                            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
                                {totalApplications} Total
                            </span>
                        </div>

                        <div className="mt-6 space-y-3">

                            {loadingApplications ? (
                                <>
                                    {[1, 2, 3].map((item) => (
                                        <div
                                            key={item}
                                            className="animate-pulse rounded-2xl border border-slate-100 p-5"
                                        >
                                            <div className="h-5 w-1/2 rounded bg-slate-100" />

                                            <div className="mt-3 h-4 w-1/3 rounded bg-slate-100" />

                                            <div className="mt-4 h-6 w-24 rounded-full bg-slate-100" />
                                        </div>
                                    ))}
                                </>
                            ) : applications.length > 0 ? (
                                applications
                                    .slice(0, 5)
                                    .map((application) => (
                                        <div
                                            key={application._id}
                                            className="rounded-2xl border border-slate-100 p-5 transition-all hover:border-indigo-100 hover:bg-indigo-50/20"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                                <div className="min-w-0">

                                                    <h3 className="font-bold text-slate-900">
                                                        {application.job?.title ||
                                                            "Job Application"}
                                                    </h3>

                                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                                        {application.job?.company ||
                                                            "Company"}
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap gap-2">

                                                        {application.job?.location && (
                                                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                                                                {
                                                                    application
                                                                        .job
                                                                        .location
                                                                }
                                                            </span>
                                                        )}

                                                        {application.job?.jobType && (
                                                            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                                                                {
                                                                    application
                                                                        .job
                                                                        .jobType
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">

                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                                                            application.status
                                                        )}`}
                                                    >
                                                        {getStatusIcon(
                                                            application.status
                                                        )}

                                                        {
                                                            application.status
                                                        }
                                                    </span>

                                                    {application.job?._id && (
                                                        <Link
                                                            to={`/jobs/${application.job._id}`}
                                                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                                                        >
                                                            View Job
                                                            <ArrowRight
                                                                size={14}
                                                            />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">

                                    <FileText
                                        size={34}
                                        className="mx-auto text-slate-300"
                                    />

                                    <h3 className="mt-4 font-bold text-slate-800">
                                        No applications yet
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Apply to a job to start tracking
                                        your applications here.
                                    </p>

                                    <Link
                                        to="/jobs"
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                                    >
                                        Find Jobs
                                        <ArrowRight size={15} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* =====================================
                        QUICK ACTIONS
                    ===================================== */}

                    <aside className="space-y-5">

                        <div className="hf-card p-6">

                            <h2 className="text-lg font-extrabold text-slate-900">
                                Quick Actions
                            </h2>

                            <div className="mt-4 space-y-2">

                                <Link
                                    to="/jobs"
                                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-indigo-50"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Search size={18} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            Find Jobs
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Explore opportunities
                                        </p>
                                    </div>
                                </Link>

                                <Link
                                    to="/student/profile"
                                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-violet-50"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                        <Target size={18} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            {profileCompletion >= 100
                                                ? "Update Profile"
                                                : "Complete Profile"}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Improve your profile
                                        </p>
                                    </div>
                                </Link>

                                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                        <FileText size={18} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            Applications
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {totalApplications} submitted
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =================================
                            PROFILE PROGRESS
                        ================================= */}

                        <div className="overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-lg">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm font-bold">
                                        Profile Strength
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {profileCompletion >= 100
                                            ? "Your profile is complete"
                                            : "Complete your profile"}
                                    </p>
                                </div>

                                <span className="text-2xl font-black">
                                    {loadingProfile
                                        ? "..."
                                        : `${profileCompletion}%`}
                                </span>
                            </div>

                            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-700">

                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 transition-all duration-700"
                                    style={{
                                        width: `${profileCompletion}%`,
                                    }}
                                />
                            </div>

                            <p className="mt-4 text-xs leading-5 text-slate-400">
                                Add your phone, location, skills,
                                education and resume to improve your
                                profile.
                            </p>

                            <Link
                                to="/student/profile"
                                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 transition-colors hover:text-white"
                            >
                                {profileCompletion >= 100
                                    ? "Edit Profile"
                                    : "Complete Profile"}
                                <ArrowRight size={13} />
                            </Link>
                        </div>
                    </aside>
                </section>

                {/* =========================================
                    RECOMMENDED JOBS
                ========================================= */}

                <section className="mt-7 hf-card p-6 sm:p-7">

                    <div className="flex items-center justify-between gap-4">

                        <div>
                            <div className="flex items-center gap-2">

                                <Sparkles
                                    size={18}
                                    className="text-indigo-600"
                                />

                                <h2 className="text-xl font-extrabold text-slate-900">
                                    Recommended Jobs
                                </h2>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Explore more opportunities
                            </p>
                        </div>

                        <Link
                            to="/jobs"
                            className="hidden items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 sm:flex"
                        >
                            View all
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="mt-6 grid gap-3 md:grid-cols-2">

                        {loadingJobs ? (
                            <>
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="animate-pulse rounded-2xl border border-slate-100 p-5"
                                    >
                                        <div className="h-5 w-1/2 rounded bg-slate-100" />

                                        <div className="mt-3 h-4 w-1/3 rounded bg-slate-100" />

                                        <div className="mt-4 h-3 w-2/3 rounded bg-slate-100" />
                                    </div>
                                ))}
                            </>
                        ) : displayJobs.length > 0 ? (
                            displayJobs.map((job) => (
                                <Link
                                    key={job._id}
                                    to={`/jobs/${job._id}`}
                                    className="group block rounded-2xl border border-slate-100 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-100 hover:bg-indigo-50/30 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-4">

                                        <div className="min-w-0">

                                            <h3 className="truncate font-bold text-slate-900 group-hover:text-indigo-600">
                                                {job.title ||
                                                    "Job Opportunity"}
                                            </h3>

                                            <p className="mt-1 text-sm font-medium text-slate-500">
                                                {job.company ||
                                                    "Company"}
                                            </p>
                                        </div>

                                        <ArrowRight
                                            size={18}
                                            className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500"
                                        />
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">

                                        {job.location && (
                                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                                                {job.location}
                                            </span>
                                        )}

                                        {job.jobType && (
                                            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                                                {job.jobType}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center md:col-span-2">

                                <BriefcaseBusiness
                                    size={34}
                                    className="mx-auto text-slate-300"
                                />

                                <h3 className="mt-4 font-bold text-slate-800">
                                    No jobs available yet
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    New opportunities will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default StudentDashboard;