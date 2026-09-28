import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    ArrowLeft,
    Bookmark,
    BookmarkX,
    BriefcaseBusiness,
    MapPin,
    IndianRupee,
    Clock3,
    Search,
} from "lucide-react";

import api from "../../services/api";

function SavedJobs() {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [removingId, setRemovingId] = useState(null);

    // =========================================
    // FETCH SAVED JOBS
    // =========================================

    const fetchSavedJobs = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                "/saved-jobs",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSavedJobs(
                response.data?.savedJobs || []
            );
        } catch (err) {
            console.error(
                "Fetch Saved Jobs Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to load saved jobs."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSavedJobs();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    // =========================================
    // REMOVE SAVED JOB
    // =========================================

    const handleRemove = async (jobId) => {
        try {
            setRemovingId(jobId);
            setError("");

            const token = localStorage.getItem("token");

            await api.delete(
                `/saved-jobs/${jobId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSavedJobs((previous) =>
                previous.filter(
                    (item) =>
                        item.job?._id !== jobId
                )
            );
        } catch (err) {
            console.error(
                "Remove Saved Job Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to remove saved job."
            );
        } finally {
            setRemovingId(null);
        }
    };

    // =========================================
    // SEARCH
    // =========================================

    const filteredJobs = savedJobs.filter(
        (item) => {
            const job = item.job;

            if (!job) {
                return false;
            }

            const searchText = search
                .toLowerCase()
                .trim();

            if (!searchText) {
                return true;
            }

            return (
                job.title
                    ?.toLowerCase()
                    .includes(searchText) ||
                job.company
                    ?.toLowerCase()
                    .includes(searchText) ||
                job.location
                    ?.toLowerCase()
                    .includes(searchText)
            );
        }
    );

    return (
        <main className="min-h-[calc(100vh-72px)] bg-slate-50">
            <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">

                {/* BACK */}

                <Link
                    to="/student/dashboard"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-indigo-600"
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </Link>

                {/* HEADER */}

                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-7 text-white shadow-xl shadow-indigo-200 sm:p-9">

                    <div className="relative z-10">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                            <div>
                                <div className="flex items-center gap-3">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                                        <Bookmark size={23} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-indigo-100">
                                            Student Workspace
                                        </p>

                                        <h1 className="text-2xl font-black sm:text-3xl">
                                            Saved Jobs
                                        </h1>
                                    </div>

                                </div>

                                <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100">
                                    Keep interesting opportunities
                                    bookmarked so you can come back
                                    and apply when you're ready.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md">

                                <p className="text-xs font-bold text-indigo-100">
                                    SAVED
                                </p>

                                <p className="mt-1 text-3xl font-black">
                                    {savedJobs.length}
                                </p>

                            </div>

                        </div>
                    </div>

                    <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                    <div className="absolute -bottom-28 right-32 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl" />

                </section>

                {/* SEARCH */}

                <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="relative">

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
                            placeholder="Search your saved jobs..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        />

                    </div>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                        {error}
                    </div>
                )}

                {/* LOADING */}

                {loading ? (

                    <div className="flex min-h-[350px] items-center justify-center">

                        <div className="text-center">

                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

                            <p className="mt-4 text-sm font-semibold text-slate-500">
                                Loading saved jobs...
                            </p>

                        </div>

                    </div>

                ) : filteredJobs.length === 0 ? (

                    /* EMPTY STATE */

                    <div className="mt-7 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                            <Bookmark size={28} />
                        </div>

                        <h2 className="mt-5 text-xl font-black text-slate-900">
                            {search
                                ? "No matching jobs"
                                : "No saved jobs yet"}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            {search
                                ? "Try a different search term."
                                : "Browse available opportunities and save the ones you want to explore later."}
                        </p>

                        {!search && (
                            <Link
                                to="/jobs"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
                            >
                                <BriefcaseBusiness size={17} />
                                Browse Jobs
                            </Link>
                        )}

                    </div>

                ) : (

                    /* JOB GRID */

                    <div className="mt-7 grid gap-5 lg:grid-cols-2">

                        {filteredJobs.map(
                            (savedItem) => {
                                const job =
                                    savedItem.job;

                                return (
                                    <article
                                        key={
                                            savedItem._id
                                        }
                                        className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50"
                                    >

                                        {/* JOB HEADER */}

                                        <div className="flex items-start justify-between gap-4">

                                            <div className="min-w-0">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-black text-indigo-600">
                                                        {job.company
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase() ||
                                                            "J"}
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="truncate text-xs font-bold uppercase tracking-wide text-indigo-600">
                                                            {
                                                                job.company
                                                            }
                                                        </p>

                                                        <h2 className="mt-1 truncate text-lg font-black text-slate-900">
                                                            {
                                                                job.title
                                                            }
                                                        </h2>

                                                    </div>

                                                </div>

                                            </div>

                                            {/* REMOVE */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(
                                                        job._id
                                                    )
                                                }
                                                disabled={
                                                    removingId ===
                                                    job._id
                                                }
                                                title="Remove saved job"
                                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-indigo-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                            >

                                                {removingId ===
                                                job._id ? (
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-red-500" />
                                                ) : (
                                                    <BookmarkX
                                                        size={18}
                                                    />
                                                )}

                                            </button>

                                        </div>

                                        {/* JOB TYPE */}

                                        <div className="mt-5 flex flex-wrap gap-2">

                                            {job.jobType && (
                                                <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
                                                    {
                                                        job.jobType
                                                    }
                                                </span>
                                            )}

                                            {job.experience && (
                                                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                                                    {
                                                        job.experience
                                                    }
                                                </span>
                                            )}

                                        </div>

                                        {/* JOB INFO */}

                                        <div className="mt-5 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">

                                            {job.location && (
                                                <div className="flex items-center gap-2">

                                                    <MapPin
                                                        size={16}
                                                        className="text-indigo-500"
                                                    />

                                                    <span className="truncate">
                                                        {
                                                            job.location
                                                        }
                                                    </span>

                                                </div>
                                            )}

                                            {job.salary && (
                                                <div className="flex items-center gap-2">

                                                    <IndianRupee
                                                        size={16}
                                                        className="text-emerald-500"
                                                    />

                                                    <span className="truncate">
                                                        {
                                                            job.salary
                                                        }
                                                    </span>

                                                </div>
                                            )}

                                            {job.deadline && (
                                                <div className="flex items-center gap-2">

                                                    <Clock3
                                                        size={16}
                                                        className="text-orange-500"
                                                    />

                                                    <span>
                                                        Deadline:{" "}
                                                        {new Date(
                                                            job.deadline
                                                        ).toLocaleDateString()}
                                                    </span>

                                                </div>
                                            )}

                                        </div>

                                        {/* SKILLS */}

                                        {job.skills?.length > 0 && (
                                            <div className="mt-5 flex flex-wrap gap-2">

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
                                                                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600"
                                                            >
                                                                {
                                                                    skill
                                                                }
                                                            </span>
                                                        )
                                                    )}

                                            </div>
                                        )}

                                        {/* DETAILS BUTTON */}

                                        <div className="mt-6 border-t border-slate-100 pt-5">

                                            <Link
                                                to={`/jobs/${job._id}`}
                                                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-600"
                                            >
                                                View Job Details
                                            </Link>

                                        </div>

                                    </article>
                                );
                            }
                        )}

                    </div>
                )}

            </div>
        </main>
    );
}

export default SavedJobs;