import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    FileText,
    MapPin,
    Pencil,
    Plus,
    Trash2,
    TrendingUp,
    Users,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";
import api from "../../services/api";

function RecruiterDashboard() {
    const { user } = useAuth();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [applicationsLoading, setApplicationsLoading] =
        useState(true);

    const [error, setError] = useState("");
    const [applicationsError, setApplicationsError] =
        useState("");

    const [deletingId, setDeletingId] = useState(null);

    // =========================================
    // FETCH RECRUITER JOBS
    // =========================================

    const fetchMyJobs = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/jobs/recruiter/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setJobs(response.data?.jobs || []);
        } catch (err) {
            console.error(
                "Fetch Recruiter Jobs Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to load your jobs."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // =========================================
    // FETCH RECRUITER APPLICATIONS
    // =========================================

    const fetchApplications = useCallback(async () => {
        try {
            setApplicationsLoading(true);
            setApplicationsError("");

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/applications/recruiter",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setApplications(
                response.data?.applications || []
            );
        } catch (err) {
            console.error(
                "Fetch Recruiter Applications Error:",
                err
            );

            setApplicationsError(
                err.response?.data?.message ||
                    "Unable to load application statistics."
            );
        } finally {
            setApplicationsLoading(false);
        }
    }, []);

    // =========================================
    // INITIAL DATA LOAD
    // =========================================

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMyJobs();
            fetchApplications();
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchMyJobs, fetchApplications]);

    // =========================================
    // DELETE JOB
    // =========================================

    const handleDelete = async (jobId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(jobId);

            const token = localStorage.getItem("token");

            await api.delete(`/jobs/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setJobs((previousJobs) =>
                previousJobs.filter(
                    (job) => job._id !== jobId
                )
            );
        } catch (err) {
            console.error(
                "Delete Job Error:",
                err
            );

            alert(
                err.response?.data?.message ||
                    "Unable to delete this job."
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =========================================
    // JOB STATISTICS
    // =========================================

    const activeJobs = jobs.filter(
        (job) => job.status === "Active"
    );

    const closedJobs = jobs.filter(
        (job) => job.status === "Closed"
    );

    // =========================================
    // APPLICATION STATISTICS
    // =========================================

    const totalApplicants = applications.length;

    const underReviewApplicants =
        applications.filter(
            (application) =>
                application.status === "Under Review"
        ).length;

    const selectedApplicants =
        applications.filter(
            (application) =>
                application.status === "Selected"
        ).length;

    const stats = [
        {
            label: "Active Jobs",
            value: activeJobs.length,
            description: "Currently published",
            icon: BriefcaseBusiness,
            iconClass:
                "bg-indigo-50 text-indigo-600",
        },
        {
            label: "Total Applicants",
            value: applicationsLoading
                ? "..."
                : totalApplicants,
            description: "Across all jobs",
            icon: Users,
            iconClass:
                "bg-violet-50 text-violet-600",
        },
        {
            label: "Under Review",
            value: applicationsLoading
                ? "..."
                : underReviewApplicants,
            description: "Applications to review",
            icon: Clock3,
            iconClass:
                "bg-amber-50 text-amber-600",
        },
        {
            label: "Selected",
            value: applicationsLoading
                ? "..."
                : selectedApplicants,
            description: "Successful candidates",
            icon: CheckCircle2,
            iconClass:
                "bg-emerald-50 text-emerald-600",
        },
    ];

    return (
        <main className="min-h-[calc(100vh-72px)] bg-slate-50">
            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">

                {/* =========================================
                    HERO
                ========================================= */}

                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-7 text-white shadow-xl shadow-indigo-200 sm:p-10">
                    <div className="relative z-10 max-w-2xl">

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                            <BriefcaseBusiness size={14} />
                            Recruiter Dashboard
                        </div>

                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                            Welcome back,{" "}
                            {user?.name?.split(" ")[0] ||
                                "Recruiter"}
                            !
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                            Manage your job openings, discover
                            talented candidates, and build your
                            next great team.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                to="/recruiter/jobs/create"
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                <Plus size={18} />
                                Post a Job
                            </Link>

                            <Link
                                to="/recruiter/applications"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                            >
                                <Users size={17} />
                                View Applicants
                            </Link>
                        </div>
                    </div>

                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

                    <div className="absolute -bottom-24 right-16 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

                    <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 lg:block">
                        <div className="flex h-40 w-40 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md">
                            <Users
                                size={68}
                                strokeWidth={1.3}
                                className="text-white/80"
                            />
                        </div>
                    </div>
                </section>

                {/* =========================================
                    STATISTICS
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

                {/* Application statistics warning */}
                {applicationsError && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                        {applicationsError}
                    </div>
                )}

                {/* =========================================
                    MAIN CONTENT
                ========================================= */}

                <section className="mt-7 grid gap-7 lg:grid-cols-[1fr_320px]">

                    {/* =====================================
                        JOB MANAGEMENT
                    ===================================== */}

                    <div className="hf-card p-6 sm:p-7">

                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <BriefcaseBusiness
                                        size={19}
                                        className="text-indigo-600"
                                    />

                                    <h2 className="text-xl font-extrabold text-slate-900">
                                        Your Job Postings
                                    </h2>
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage your published opportunities
                                </p>
                            </div>

                            <Link
                                to="/recruiter/jobs/create"
                                className="hidden items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 sm:flex"
                            >
                                <Plus size={16} />
                                Post Job
                            </Link>
                        </div>

                        <div className="mt-6">

                            {/* Loading */}
                            {loading && (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-16 text-center">
                                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

                                    <p className="mt-4 text-sm font-semibold text-slate-600">
                                        Loading your jobs...
                                    </p>
                                </div>
                            )}

                            {/* Error */}
                            {!loading && error && (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
                                    <p className="text-sm font-semibold text-red-600">
                                        {error}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={fetchMyJobs}
                                        className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading &&
                                !error &&
                                jobs.length === 0 && (
                                    <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-14 text-center">

                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                                            <BriefcaseBusiness
                                                size={29}
                                            />
                                        </div>

                                        <h3 className="mt-5 text-lg font-extrabold text-slate-800">
                                            No jobs posted yet
                                        </h3>

                                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                            Create your first job posting
                                            and start discovering talented
                                            candidates on HireFlow.
                                        </p>

                                        <Link
                                            to="/recruiter/jobs/create"
                                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                                        >
                                            <Plus size={17} />
                                            Create Your First Job
                                        </Link>
                                    </div>
                                )}

                            {/* Jobs */}
                            {!loading &&
                                !error &&
                                jobs.length > 0 && (
                                    <div className="space-y-4">
                                        {jobs.map((job) => (
                                            <div
                                                key={job._id}
                                                className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-indigo-200 hover:shadow-md"
                                            >
                                                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                                                    {/* Job Info */}
                                                    <div className="min-w-0">
                                                        <div className="flex items-start gap-3">

                                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                                <BriefcaseBusiness
                                                                    size={20}
                                                                />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <h3 className="truncate text-lg font-extrabold text-slate-900">
                                                                    {job.title}
                                                                </h3>

                                                                <p className="mt-1 text-sm font-medium text-slate-500">
                                                                    {job.company}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 flex flex-wrap gap-2">

                                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                                                                <MapPin
                                                                    size={13}
                                                                />
                                                                {job.location}
                                                            </span>

                                                            <span className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-600">
                                                                {job.jobType}
                                                            </span>

                                                            <span
                                                                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                                                                    job.status ===
                                                                    "Active"
                                                                        ? "bg-emerald-50 text-emerald-600"
                                                                        : "bg-slate-100 text-slate-500"
                                                                }`}
                                                            >
                                                                {job.status}
                                                            </span>
                                                        </div>

                                                        {job.skills?.length >
                                                            0 && (
                                                            <div className="mt-4 flex flex-wrap gap-2">
                                                                {job.skills
                                                                    .slice(
                                                                        0,
                                                                        5
                                                                    )
                                                                    .map(
                                                                        (
                                                                            skill
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    skill
                                                                                }
                                                                                className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500"
                                                                            >
                                                                                {
                                                                                    skill
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex shrink-0 items-center gap-2">

                                                        <Link
                                                            to={`/jobs/${job._id}`}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                                        >
                                                            View
                                                        </Link>

                                                        <Link
                                                            to={`/recruiter/jobs/edit/${job._id}`}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-100"
                                                        >
                                                            <Pencil
                                                                size={13}
                                                            />
                                                            Edit
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    job._id
                                                                )
                                                            }
                                                            disabled={
                                                                deletingId ===
                                                                job._id
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {deletingId ===
                                                            job._id ? (
                                                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                                                            ) : (
                                                                <Trash2
                                                                    size={
                                                                        13
                                                                    }
                                                                />
                                                            )}
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* =====================================
                        SIDEBAR
                    ===================================== */}

                    <aside className="space-y-5">

                        {/* Quick Actions */}
                        <div className="hf-card p-6">

                            <h2 className="text-lg font-extrabold text-slate-900">
                                Quick Actions
                            </h2>

                            <div className="mt-4 space-y-2">

                                <Link
                                    to="/recruiter/jobs/create"
                                    className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-indigo-50"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Plus size={18} />
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">
                                            Post a Job
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Find your next candidate
                                        </p>
                                    </div>

                                    <ArrowRight
                                        size={15}
                                        className="text-slate-300 transition-transform group-hover:translate-x-1"
                                    />
                                </Link>

                                <Link
                                    to="/recruiter/applications"
                                    className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-violet-50"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                        <Users size={18} />
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">
                                            Applicants
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Review candidates
                                        </p>
                                    </div>

                                    <ArrowRight
                                        size={15}
                                        className="text-slate-300 transition-transform group-hover:translate-x-1"
                                    />
                                </Link>

                                <Link
                                    to="/recruiter/jobs"
                                    className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-emerald-50"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <FileText size={18} />
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">
                                            Manage Jobs
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Edit your postings
                                        </p>
                                    </div>

                                    <ArrowRight
                                        size={15}
                                        className="text-slate-300 transition-transform group-hover:translate-x-1"
                                    />
                                </Link>
                            </div>
                        </div>

                        {/* Hiring Insight */}
                        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-lg shadow-indigo-200">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                                <TrendingUp size={21} />
                            </div>

                            <h3 className="mt-5 text-lg font-extrabold">
                                Build your team
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-indigo-100">
                                Post detailed job requirements to attract
                                candidates who are a better match for your
                                openings.
                            </p>

                            <Link
                                to="/recruiter/jobs/create"
                                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-indigo-100"
                            >
                                Create a job
                                <ArrowRight size={15} />
                            </Link>
                        </div>

                        {/* Job Summary */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5">

                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Job Summary
                            </p>

                            <div className="mt-4 space-y-3">

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Total jobs
                                    </span>

                                    <span className="font-black text-slate-900">
                                        {jobs.length}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Active
                                    </span>

                                    <span className="font-black text-emerald-600">
                                        {activeJobs.length}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Closed
                                    </span>

                                    <span className="font-black text-slate-500">
                                        {closedJobs.length}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Applicants
                                    </span>

                                    <span className="font-black text-violet-600">
                                        {applicationsLoading
                                            ? "..."
                                            : totalApplicants}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        </main>
    );
}

export default RecruiterDashboard;