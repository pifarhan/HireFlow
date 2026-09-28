import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Bookmark,
    BookmarkCheck,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Loader2,
    MapPin,
    Send,
    Users,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/useAuth";

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [applicationMessage, setApplicationMessage] =
        useState("");
    const [applicationError, setApplicationError] =
        useState("");

    const [saved, setSaved] = useState(false);
    const [savingJob, setSavingJob] = useState(false);

    // =========================================
    // FETCH JOB
    // =========================================

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/jobs/${id}`
                );

                setJob(response.data.job);
            } catch (error) {
                console.error(
                    "Fetch Job Details Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                        "Unable to load job details."
                );
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchJob();
        }, 0);

        return () => clearTimeout(timer);
    }, [id]);

    // =========================================
    // CHECK SAVED STATUS
    // =========================================

    useEffect(() => {
        const checkSavedStatus = async () => {
            if (!user || user.role !== "student") {
                setSaved(false);
                return;
            }

            try {
                const token =
                    localStorage.getItem("token");

                const response = await api.get(
                    "/saved-jobs",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const savedJobs =
                    response.data?.savedJobs || [];

                const alreadySaved = savedJobs.some(
                    (item) =>
                        item.job?._id === id
                );

                setSaved(alreadySaved);
            } catch (error) {
                console.error(
                    "Check Saved Job Error:",
                    error
                );
            }
        };

        const timer = setTimeout(() => {
            checkSavedStatus();
        }, 0);

        return () => clearTimeout(timer);
    }, [id, user]);

    // =========================================
    // APPLY
    // =========================================

    const handleApply = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "student") {
            setApplicationError(
                "Only students can apply for jobs."
            );
            return;
        }

        try {
            setApplying(true);
            setApplicationMessage("");
            setApplicationError("");

            const token =
                localStorage.getItem("token");

            const response = await api.post(
                `/applications/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setApplied(true);

            setApplicationMessage(
                response.data?.message ||
                    "Application submitted successfully!"
            );
        } catch (error) {
            console.error(
                "Apply Job Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Unable to submit your application.";

            if (
                message
                    .toLowerCase()
                    .includes("already applied")
            ) {
                setApplied(true);
            }

            setApplicationError(message);
        } finally {
            setApplying(false);
        }
    };

    // =========================================
    // SAVE / UNSAVE JOB
    // =========================================

    const handleSaveJob = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "student") {
            setApplicationError(
                "Only students can save jobs."
            );
            return;
        }

        try {
            setSavingJob(true);
            setApplicationError("");

            const token =
                localStorage.getItem("token");

            if (saved) {
                await api.delete(
                    `/saved-jobs/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setSaved(false);
            } else {
                await api.post(
                    `/saved-jobs/${id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setSaved(true);
            }
        } catch (error) {
            console.error(
                "Save Job Error:",
                error
            );

            setApplicationError(
                error.response?.data?.message ||
                    "Unable to update saved job."
            );
        } finally {
            setSavingJob(false);
        }
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

                    <div className="animate-pulse">

                        <div className="h-5 w-32 rounded bg-slate-200" />

                        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8">

                            <div className="flex gap-5">

                                <div className="h-16 w-16 rounded-2xl bg-slate-200" />

                                <div className="flex-1">
                                    <div className="h-7 w-72 rounded bg-slate-200" />

                                    <div className="mt-3 h-4 w-40 rounded bg-slate-200" />
                                </div>

                            </div>

                            <div className="mt-8 h-32 rounded-2xl bg-slate-100" />

                        </div>

                    </div>

                </div>
            </main>
        );
    }

    // =========================================
    // ERROR
    // =========================================

    if (error || !job) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">

                <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <BriefcaseBusiness size={28} />
                    </div>

                    <h1 className="mt-5 text-2xl font-black text-slate-900">
                        Job not found
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {error ||
                            "This job may have been removed or is no longer available."}
                    </p>

                    <Link
                        to="/jobs"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-600"
                    >
                        <ArrowLeft size={17} />
                        Back to Jobs
                    </Link>

                </div>

            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">

            {/* HEADER */}

            <section className="border-b border-slate-200 bg-white">

                <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

                    <Link
                        to="/jobs"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
                    >
                        <ArrowLeft size={17} />
                        Back to Jobs
                    </Link>

                    <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                        <div className="flex gap-5">

                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                <Building2 size={29} />
                            </div>

                            <div>

                                <div className="flex flex-wrap items-center gap-3">

                                    <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                                        {job.title}
                                    </h1>

                                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                                        {job.status}
                                    </span>

                                </div>

                                <p className="mt-2 text-base font-semibold text-slate-500">
                                    {job.company}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">

                                    <span className="flex items-center gap-1.5">
                                        <MapPin size={16} />
                                        {job.location}
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <Clock3 size={16} />
                                        {job.jobType}
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <BriefcaseBusiness
                                            size={16}
                                        />
                                        {job.experience}
                                    </span>

                                </div>

                            </div>

                        </div>

                        <div className="lg:text-right">

                            <p className="text-2xl font-black text-slate-900">
                                {job.salary}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Compensation
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* CONTENT */}

            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

                <div className="grid gap-8 lg:grid-cols-[1fr_350px]">

                    {/* MAIN */}

                    <div className="space-y-6">

                        {/* DESCRIPTION */}

                        <div className="hf-card p-6 sm:p-8">

                            <h2 className="text-xl font-black text-slate-900">
                                Job Description
                            </h2>

                            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                                {job.description ||
                                    "No job description has been provided."}
                            </p>

                        </div>

                        {/* SKILLS */}

                        <div className="hf-card p-6 sm:p-8">

                            <h2 className="text-xl font-black text-slate-900">
                                Required Skills
                            </h2>

                            <div className="mt-5 flex flex-wrap gap-2.5">

                                {job.skills?.length > 0 ? (
                                    job.skills.map(
                                        (skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        No specific skills listed.
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* REQUIREMENTS */}

                        <div className="hf-card p-6 sm:p-8">

                            <h2 className="text-xl font-black text-slate-900">
                                What We're Looking For
                            </h2>

                            <div className="mt-5 space-y-4">

                                {job.requirements?.length > 0 ? (
                                    job.requirements.map(
                                        (item) => (
                                            <div
                                                key={item}
                                                className="flex items-start gap-3"
                                            >
                                                <CheckCircle2
                                                    size={19}
                                                    className="mt-0.5 shrink-0 text-emerald-500"
                                                />

                                                <p className="text-sm leading-6 text-slate-600">
                                                    {item}
                                                </p>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        No specific requirements listed.
                                    </p>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* SIDEBAR */}

                    <aside className="space-y-5">

                        {/* APPLY CARD */}

                        <div className="hf-card p-6">

                            <h2 className="text-lg font-black text-slate-900">
                                Interested in this role?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Submit your application and take the next
                                step toward your career.
                            </p>

                            {/* APPLICATION SUCCESS */}

                            {applicationMessage && (
                                <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                                    <CheckCircle2
                                        size={19}
                                        className="mt-0.5 shrink-0 text-emerald-600"
                                    />

                                    <p className="text-sm font-semibold leading-5 text-emerald-700">
                                        {applicationMessage}
                                    </p>

                                </div>
                            )}

                            {/* APPLICATION ERROR */}

                            {applicationError && (
                                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">

                                    <p className="text-sm font-semibold leading-5 text-red-600">
                                        {applicationError}
                                    </p>

                                </div>
                            )}

                            {/* APPLY */}

                            <button
                                onClick={handleApply}
                                disabled={
                                    applying || applied
                                }
                                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white transition ${
                                    applied
                                        ? "cursor-default bg-emerald-500"
                                        : "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl"
                                } disabled:opacity-70`}
                            >

                                {applying ? (
                                    <>
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                        Applying...
                                    </>
                                ) : applied ? (
                                    <>
                                        <CheckCircle2 size={17} />
                                        Applied
                                    </>
                                ) : (
                                    <>
                                        <Send size={17} />
                                        Apply Now
                                    </>
                                )}

                            </button>

                            {/* SAVE */}

                            <button
                                type="button"
                                onClick={handleSaveJob}
                                disabled={savingJob}
                                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                                    saved
                                        ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                } disabled:cursor-not-allowed disabled:opacity-60`}
                            >

                                {savingJob ? (
                                    <>
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                        Updating...
                                    </>
                                ) : saved ? (
                                    <>
                                        <BookmarkCheck
                                            size={17}
                                        />
                                        Saved
                                    </>
                                ) : (
                                    <>
                                        <Bookmark size={17} />
                                        Save Job
                                    </>
                                )}

                            </button>

                        </div>

                        {/* JOB OVERVIEW */}

                        <div className="hf-card p-6">

                            <h2 className="text-lg font-black text-slate-900">
                                Job Overview
                            </h2>

                            <div className="mt-5 space-y-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <BriefcaseBusiness size={18} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Job Type
                                        </p>

                                        <p className="mt-0.5 text-sm font-bold text-slate-800">
                                            {job.jobType}
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                        <Users size={18} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Experience
                                        </p>

                                        <p className="mt-0.5 text-sm font-bold text-slate-800">
                                            {job.experience}
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <MapPin size={18} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Location
                                        </p>

                                        <p className="mt-0.5 text-sm font-bold text-slate-800">
                                            {job.location}
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                        <CalendarDays size={18} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Posted
                                        </p>

                                        <p className="mt-0.5 text-sm font-bold text-slate-800">
                                            Recently
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </aside>

                </div>

            </section>

        </main>
    );
}

export default JobDetails;