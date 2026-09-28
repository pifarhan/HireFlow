import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    BriefcaseBusiness,
    CheckCircle2,
    ChevronDown,
    Clock3,
    FileText,
    Mail,
    MapPin,
    Phone,
    Search,
    User,
    Users,
    XCircle,
} from "lucide-react";

import api from "../../services/api";

const STATUS_OPTIONS = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview",
    "Selected",
    "Rejected",
];

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

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

            setError(
                err.response?.data?.message ||
                    "Unable to load applications."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchApplications();
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchApplications]);

    const handleStatusChange = async (
        applicationId,
        status
    ) => {
        try {
            setUpdatingId(applicationId);

            const token = localStorage.getItem("token");

            const response = await api.put(
                `/applications/${applicationId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedApplication =
                response.data?.application;

            if (updatedApplication) {
                setApplications((previous) =>
                    previous.map((application) =>
                        application._id === applicationId
                            ? updatedApplication
                            : application
                    )
                );
            }
        } catch (err) {
            console.error(
                "Update Application Status Error:",
                err
            );

            alert(
                err.response?.data?.message ||
                    "Unable to update application status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

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

    const getStatusIcon = (status) => {
        switch (status) {
            case "Selected":
                return <CheckCircle2 size={14} />;

            case "Rejected":
                return <XCircle size={14} />;

            case "Under Review":
                return <Clock3 size={14} />;

            default:
                return <FileText size={14} />;
        }
    };

    const filteredApplications = applications.filter(
        (application) => {
            const student = application.student;
            const job = application.job;

            const searchText = search
                .toLowerCase()
                .trim();

            const matchesSearch =
                !searchText ||
                student?.name
                    ?.toLowerCase()
                    .includes(searchText) ||
                student?.email
                    ?.toLowerCase()
                    .includes(searchText) ||
                job?.title
                    ?.toLowerCase()
                    .includes(searchText) ||
                job?.company
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === "All" ||
                application.status === statusFilter;

            return matchesSearch && matchesStatus;
        }
    );

    const totalApplicants = applications.length;

    const underReviewCount = applications.filter(
        (application) =>
            application.status === "Under Review"
    ).length;

    const shortlistedCount = applications.filter(
        (application) =>
            application.status === "Shortlisted"
    ).length;

    const selectedCount = applications.filter(
        (application) =>
            application.status === "Selected"
    ).length;

    const interviewCount = applications.filter(
        (application) =>
            application.status === "Interview"
    ).length;

    const rejectedCount = applications.filter(
        (application) =>
            application.status === "Rejected"
    ).length;

    return (
        <main className="min-h-[calc(100vh-72px)] bg-slate-50">
            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">

                {/* Header */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-7 text-white shadow-xl shadow-indigo-200 sm:p-10">
                    <div className="relative z-10">
                        <Link
                            to="/recruiter/dashboard"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </Link>

                        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                                    <Users size={14} />
                                    Candidate Management
                                </div>

                                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                                    Applications
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                                    Review candidates, evaluate their
                                    profiles, and manage application
                                    statuses from one place.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md">
                                <p className="text-xs font-medium text-slate-400">
                                    Total Applicants
                                </p>

                                <p className="mt-1 text-3xl font-black">
                                    {totalApplicants}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="absolute -bottom-24 right-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
                </section>

                {/* Stats */}
                <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <div className="hf-card p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Applications
                                </p>

                                <p className="mt-2 text-3xl font-black text-slate-900">
                                    {totalApplicants}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <Users size={21} />
                            </div>
                        </div>
                    </div>

                    <div className="hf-card p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Under Review
                                </p>

                                <p className="mt-2 text-3xl font-black text-slate-900">
                                    {underReviewCount}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <Clock3 size={21} />
                            </div>
                        </div>
                    </div>

                    <div className="hf-card p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Shortlisted
                                </p>

                                <p className="mt-2 text-3xl font-black text-slate-900">
                                    {shortlistedCount}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <CheckCircle2 size={21} />
                            </div>
                        </div>
                    </div>

                    <div className="hf-card p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Selected
                                </p>

                                <p className="mt-2 text-3xl font-black text-slate-900">
                                    {selectedCount}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 size={21} />
                            </div>
                        </div>
                    </div>

                    <div className="hf-card p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Interview
                                </p>

                                <p className="mt-2 text-3xl font-black text-slate-900">
                                    {interviewCount}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <BriefcaseBusiness size={21} />
                            </div>
                        </div>
                    </div>

                    <div className="hf-card p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Rejected
                                </p>

                                <p className="mt-2 text-3xl font-black text-slate-900">
                                    {rejectedCount}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <XCircle size={21} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters */}
                <section className="mt-7 hf-card p-5 sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search candidate, email or job..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm font-bold text-slate-700 transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50 lg:w-52"
                            >
                                <option value="All">
                                    All Statuses
                                </option>

                                {STATUS_OPTIONS.map(
                                    (status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>
                                    )
                                )}
                            </select>

                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-400">
                            Showing{" "}
                            <span className="text-slate-700">
                                {filteredApplications.length}
                            </span>{" "}
                            of{" "}
                            <span className="text-slate-700">
                                {totalApplicants}
                            </span>{" "}
                            applications
                        </p>

                        {(search || statusFilter !== "All") && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("All");
                                }}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </section>

                {/* Applications */}
                <section className="mt-7">
                    {loading && (
                        <div className="hf-card px-6 py-20 text-center">
                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

                            <p className="mt-4 text-sm font-semibold text-slate-600">
                                Loading applications...
                            </p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
                            <XCircle
                                size={40}
                                className="mx-auto text-red-400"
                            />

                            <h2 className="mt-4 text-lg font-black text-red-700">
                                Unable to load applications
                            </h2>

                            <p className="mt-2 text-sm text-red-600">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={fetchApplications}
                                className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        filteredApplications.length === 0 && (
                            <div className="hf-card px-6 py-20 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                                    <Users size={30} />
                                </div>

                                <h2 className="mt-5 text-xl font-black text-slate-900">
                                    No applications found
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                    {applications.length === 0
                                        ? "Applications from students will appear here when they apply to your jobs."
                                        : "Try changing your search or status filter."}
                                </p>
                            </div>
                        )}

                    {!loading &&
                        !error &&
                        filteredApplications.length > 0 && (
                            <div className="space-y-5">
                                {filteredApplications.map(
                                    (application) => {
                                        const student =
                                            application.student;
                                        const job =
                                            application.job;

                                        return (
                                            <div
                                                key={
                                                    application._id
                                                }
                                                className="hf-card overflow-hidden transition-all hover:border-indigo-200 hover:shadow-md"
                                            >
                                                <div className="p-6">
                                                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

                                                        {/* Candidate */}
                                                        <div className="flex min-w-0 gap-4">
                                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-black text-white shadow-lg shadow-indigo-100">
                                                                {student?.name
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    ?.toUpperCase() ||
                                                                    "U"}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <h2 className="text-lg font-black text-slate-900">
                                                                    {student?.name ||
                                                                        "Unknown Candidate"}
                                                                </h2>

                                                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                                                                    {student?.email && (
                                                                        <span className="inline-flex items-center gap-1.5">
                                                                            <Mail
                                                                                size={
                                                                                    15
                                                                                }
                                                                            />
                                                                            {
                                                                                student.email
                                                                            }
                                                                        </span>
                                                                    )}

                                                                    {student?.phone && (
                                                                        <span className="inline-flex items-center gap-1.5">
                                                                            <Phone
                                                                                size={
                                                                                    15
                                                                                }
                                                                            />
                                                                            {
                                                                                student.phone
                                                                            }
                                                                        </span>
                                                                    )}

                                                                    {student?.location && (
                                                                        <span className="inline-flex items-center gap-1.5">
                                                                            <MapPin
                                                                                size={
                                                                                    15
                                                                                }
                                                                            />
                                                                            {
                                                                                student.location
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Status */}
                                                        <div className="flex shrink-0 items-center gap-3">
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

                                                            <div className="relative">
                                                                <select
                                                                    value={
                                                                        application.status
                                                                    }
                                                                    disabled={
                                                                        updatingId ===
                                                                        application._id
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        handleStatusChange(
                                                                            application._id,
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-xs font-bold text-slate-700 transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 disabled:opacity-50"
                                                                >
                                                                    {STATUS_OPTIONS.map(
                                                                        (
                                                                            status
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    status
                                                                                }
                                                                                value={
                                                                                    status
                                                                                }
                                                                            >
                                                                                {status}
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>

                                                                <ChevronDown
                                                                    size={
                                                                        14
                                                                    }
                                                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Job */}
                                                    <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                                                                <BriefcaseBusiness
                                                                    size={
                                                                        18
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                                                    Applied For
                                                                </p>

                                                                <p className="mt-1 font-bold text-slate-900">
                                                                    {job?.title ||
                                                                        "Job"}
                                                                </p>

                                                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                                                    {job?.company && (
                                                                        <span>
                                                                            {
                                                                                job.company
                                                                            }
                                                                        </span>
                                                                    )}

                                                                    {job?.location && (
                                                                        <span className="inline-flex items-center gap-1">
                                                                            <MapPin
                                                                                size={
                                                                                    12
                                                                                }
                                                                            />
                                                                            {
                                                                                job.location
                                                                            }
                                                                        </span>
                                                                    )}

                                                                    {job?.jobType && (
                                                                        <span>
                                                                            {
                                                                                job.jobType
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Skills */}
                                                    {student?.skills?.length >
                                                        0 && (
                                                        <div className="mt-5">
                                                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                                                Skills
                                                            </p>

                                                            <div className="mt-2 flex flex-wrap gap-2">
                                                                {student.skills.map(
                                                                    (
                                                                        skill
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                skill
                                                                            }
                                                                            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
                                                                        >
                                                                            {
                                                                                skill
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Bottom */}
                                                    <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                                                            <span className="inline-flex items-center gap-1.5">
                                                                <FileText
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                                Application
                                                                received
                                                            </span>

                                                            {student?.education && (
                                                                <span className="inline-flex items-center gap-1.5">
                                                                    <User
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    {
                                                                        student.education
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>

                                                        {student?.resume && (
                                                            <a
                                                                href={`http://localhost:5000${student.resume}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100"
                                                            >
                                                                <FileText
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                                View Resume
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                </section>
            </div>
        </main>
    );
}

export default Applications;