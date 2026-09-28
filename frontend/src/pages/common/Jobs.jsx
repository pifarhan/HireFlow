import { useCallback, useEffect, useState } from "react";
import {
    BriefcaseBusiness,
    Building2,
    ChevronDown,
    Clock3,
    MapPin,
    Search,
    SlidersHorizontal,
} from "lucide-react";

import api from "../../services/api";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");

    const fetchJobs = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (location.trim()) {
                params.location = location.trim();
            }

            if (jobType) {
                params.jobType = jobType;
            }

            const response = await api.get("/jobs", {
                params,
            });

            setJobs(response.data.jobs || []);
        } catch (err) {
            console.error("Fetch Jobs Error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load jobs right now."
            );
        } finally {
            setLoading(false);
        }
    }, [search, location, jobType]);

    /*
     * Initial jobs load.
     *
     * setTimeout prevents the initial fetch from causing
     * a synchronous cascading render inside useEffect.
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchJobs();
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchJobs]);

    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setJobType("");
    };

    return (
        <main className="min-h-screen bg-slate-50">

            {/* =========================================
                PAGE HEADER
            ========================================= */}

            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">

                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-600">
                            <BriefcaseBusiness size={14} />
                            EXPLORE OPPORTUNITIES
                        </span>

                        <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                            Find your next{" "}
                            <span className="hf-gradient-text">
                                opportunity
                            </span>
                        </h1>

                        <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">
                            Discover jobs and internships that match
                            your skills, goals, and career ambitions.
                        </p>
                    </div>

                    {/* Search Area */}

                    <div className="mt-9 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
                        <div className="flex flex-col gap-2 lg:flex-row">

                            {/* Search */}

                            <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3.5">
                                <Search
                                    size={20}
                                    className="shrink-0 text-slate-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Search jobs, companies, skills..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            fetchJobs();
                                        }
                                    }}
                                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                />
                            </div>

                            {/* Location */}

                            <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3.5">
                                <MapPin
                                    size={20}
                                    className="shrink-0 text-slate-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            fetchJobs();
                                        }
                                    }}
                                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                />
                            </div>

                            {/* Search Button */}

                            <button
                                onClick={fetchJobs}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                <Search size={18} />
                                Search Jobs
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

                <div className="flex flex-col gap-8 lg:flex-row">

                    {/* =================================
                        FILTER SIDEBAR
                    ================================= */}

                    <aside className="w-full shrink-0 lg:w-64">

                        <div className="hf-card p-5">

                            {/* Filter Header */}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal
                                        size={18}
                                        className="text-indigo-600"
                                    />

                                    <h2 className="font-bold text-slate-900">
                                        Filters
                                    </h2>
                                </div>

                                <button
                                    onClick={clearFilters}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                >
                                    Clear
                                </button>
                            </div>

                            {/* Job Type */}

                            <div className="mt-7">
                                <h3 className="text-sm font-bold text-slate-800">
                                    Job Type
                                </h3>

                                <select
                                    value={jobType}
                                    onChange={(e) =>
                                        setJobType(e.target.value)
                                    }
                                    className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">
                                        All Job Types
                                    </option>

                                    <option value="Full Time">
                                        Full Time
                                    </option>

                                    <option value="Part Time">
                                        Part Time
                                    </option>

                                    <option value="Internship">
                                        Internship
                                    </option>

                                    <option value="Contract">
                                        Contract
                                    </option>
                                </select>

                                <button
                                    onClick={fetchJobs}
                                    className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
                                >
                                    Apply Filters
                                </button>
                            </div>

                            {/* Experience */}

                            <div className="mt-7 border-t border-slate-100 pt-6">
                                <h3 className="text-sm font-bold text-slate-800">
                                    Experience
                                </h3>

                                <button
                                    type="button"
                                    className="mt-3 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600"
                                >
                                    Fresher
                                    <ChevronDown size={16} />
                                </button>
                            </div>

                            {/* Location */}

                            <div className="mt-7 border-t border-slate-100 pt-6">
                                <h3 className="text-sm font-bold text-slate-800">
                                    Location
                                </h3>

                                <div className="relative mt-3">
                                    <MapPin
                                        size={16}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        placeholder="e.g. Kolkata"
                                        value={location}
                                        onChange={(e) =>
                                            setLocation(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                fetchJobs();
                                            }
                                        }}
                                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>

                        </div>
                    </aside>

                    {/* =================================
                        JOB RESULTS
                    ================================= */}

                    <div className="min-w-0 flex-1">

                        {/* Results Header */}

                        <div className="mb-5 flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    {loading
                                        ? "Loading..."
                                        : `${jobs.length} opportunities`}
                                </p>

                                <h2 className="text-xl font-bold text-slate-900">
                                    Latest opportunities
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm sm:flex"
                            >
                                Newest
                                <ChevronDown size={16} />
                            </button>

                        </div>

                        {/* =================================
                            LOADING
                        ================================= */}

                        {loading && (
                            <div className="space-y-4">

                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                                    >
                                        <div className="flex gap-4">

                                            <div className="h-12 w-12 rounded-xl bg-slate-200" />

                                            <div className="flex-1">
                                                <div className="h-5 w-48 rounded bg-slate-200" />

                                                <div className="mt-3 h-4 w-32 rounded bg-slate-200" />

                                                <div className="mt-4 h-4 w-64 rounded bg-slate-200" />
                                            </div>

                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}

                        {/* =================================
                            ERROR
                        ================================= */}

                        {!loading && error && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

                                <p className="font-semibold text-red-700">
                                    {error}
                                </p>

                                <button
                                    onClick={fetchJobs}
                                    className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                                >
                                    Try Again
                                </button>

                            </div>
                        )}

                        {/* =================================
                            EMPTY
                        ================================= */}

                        {!loading &&
                            !error &&
                            jobs.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                        <BriefcaseBusiness size={24} />
                                    </div>

                                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                                        No jobs found
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Try changing your search or
                                        filters.
                                    </p>

                                </div>
                            )}

                        {/* =================================
                            JOB LIST
                        ================================= */}

                        {!loading &&
                            !error &&
                            jobs.length > 0 && (
                                <div className="space-y-4">

                                    {jobs.map((job) => (
                                        <div
                                            key={job._id}
                                            className="hf-card hf-card-hover p-5 sm:p-6"
                                        >

                                            {/* Job Top */}

                                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                                                <div className="flex gap-4">

                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                        <Building2 size={22} />
                                                    </div>

                                                    <div>

                                                        <h3 className="text-lg font-bold text-slate-900">
                                                            {job.title}
                                                        </h3>

                                                        <p className="mt-1 text-sm font-medium text-slate-500">
                                                            {job.company}
                                                        </p>

                                                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">

                                                            <span className="flex items-center gap-1.5">
                                                                <MapPin size={14} />
                                                                {job.location}
                                                            </span>

                                                            <span className="flex items-center gap-1.5">
                                                                <Clock3 size={14} />
                                                                {job.jobType}
                                                            </span>

                                                        </div>

                                                    </div>
                                                </div>

                                                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                                                    {job.status || "Active"}
                                                </span>

                                            </div>

                                            {/* Skills */}

                                            {job.skills?.length > 0 && (
                                                <div className="mt-5 flex flex-wrap gap-2">

                                                    {job.skills.map(
                                                        (skill) => (
                                                            <span
                                                                key={skill}
                                                                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                                                            >
                                                                {skill}
                                                            </span>
                                                        )
                                                    )}

                                                </div>
                                            )}

                                            {/* Bottom */}

                                            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                                                <div>

                                                    <span className="text-sm font-bold text-slate-800">
                                                        {job.salary ||
                                                            "Salary not specified"}
                                                    </span>

                                                    <span className="ml-2 text-xs text-slate-400">
                                                        •{" "}
                                                        {job.experience ||
                                                            "Experience not specified"}
                                                    </span>

                                                </div>

                                                <button
                                                    onClick={() => {
                                                        window.location.href =
                                                            `/jobs/${job._id}`;
                                                    }}
                                                    className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-600"
                                                >
                                                    View Details
                                                </button>

                                            </div>

                                        </div>
                                    ))}

                                </div>
                            )}

                    </div>
                </div>
            </section>
        </main>
    );
}

export default Jobs;