import { useCallback, useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";
import {
    ArrowLeft,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckCircle2,
    FileText,
    IndianRupee,
    MapPin,
    Pencil,
    Plus,
    Save,
    Sparkles,
    Trash2,
} from "lucide-react";

import api from "../../services/api";

function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        description: "",
        requirements: [""],
        skills: [""],
        salary: "",
        location: "",
        jobType: "Full Time",
        experience: "Fresher",
        deadline: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchJob = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/jobs/${id}`
            );

            const job = response.data?.job;

            if (!job) {
                setError("Job not found.");
                return;
            }

            setFormData({
                title: job.title || "",
                company: job.company || "",
                description:
                    job.description || "",
                requirements:
                    job.requirements?.length > 0
                        ? job.requirements
                        : [""],
                skills:
                    job.skills?.length > 0
                        ? job.skills
                        : [""],
                salary: job.salary || "",
                location: job.location || "",
                jobType:
                    job.jobType || "Full Time",
                experience:
                    job.experience || "Fresher",
                deadline: job.deadline
                    ? new Date(job.deadline)
                          .toISOString()
                          .split("T")[0]
                    : "",
            });
        } catch (err) {
            console.error(
                "Fetch Job Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to load this job."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchJob();
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchJob]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleArrayChange = (
        field,
        index,
        value
    ) => {
        setFormData((previous) => {
            const updated = [
                ...previous[field],
            ];

            updated[index] = value;

            return {
                ...previous,
                [field]: updated,
            };
        });

        setError("");
        setSuccess("");
    };

    const addArrayItem = (field) => {
        setFormData((previous) => ({
            ...previous,
            [field]: [
                ...previous[field],
                "",
            ],
        }));
    };

    const removeArrayItem = (
        field,
        index
    ) => {
        setFormData((previous) => {
            const updated =
                previous[field].filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                );

            return {
                ...previous,
                [field]:
                    updated.length > 0
                        ? updated
                        : [""],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const cleanRequirements =
            formData.requirements
                .map((item) => item.trim())
                .filter(Boolean);

        const cleanSkills =
            formData.skills
                .map((item) => item.trim())
                .filter(Boolean);

        if (
            !formData.title.trim() ||
            !formData.company.trim() ||
            !formData.description.trim() ||
            !formData.location.trim() ||
            !formData.deadline
        ) {
            setError(
                "Please complete all required fields."
            );
            return;
        }

        if (
            new Date(formData.deadline) <
            new Date()
        ) {
            setError(
                "Application deadline cannot be in the past."
            );
            return;
        }

        try {
            setSaving(true);

            const token =
                localStorage.getItem("token");

            const response = await api.put(
                `/jobs/${id}`,
                {
                    title: formData.title.trim(),
                    company:
                        formData.company.trim(),
                    description:
                        formData.description.trim(),
                    requirements:
                        cleanRequirements,
                    skills: cleanSkills,
                    salary:
                        formData.salary.trim() ||
                        "Not disclosed",
                    location:
                        formData.location.trim(),
                    jobType:
                        formData.jobType,
                    experience:
                        formData.experience.trim() ||
                        "Fresher",
                    deadline:
                        formData.deadline,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data?.job) {
                setSuccess(
                    "Job updated successfully!"
                );

                setTimeout(() => {
                    navigate(
                        "/recruiter/dashboard"
                    );
                }, 900);
            }
        } catch (err) {
            console.error(
                "Update Job Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to update this job."
            );
        } finally {
            setSaving(false);
        }
    };

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    if (loading) {
        return (
            <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-5">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

                    <p className="mt-4 text-sm font-semibold text-slate-600">
                        Loading job details...
                    </p>
                </div>
            </main>
        );
    }

    if (error && !formData.title) {
        return (
            <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-5">
                <div className="hf-card max-w-md p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <BriefcaseBusiness
                            size={25}
                        />
                    </div>

                    <h1 className="mt-5 text-xl font-black text-slate-900">
                        Unable to load job
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        {error}
                    </p>

                    <Link
                        to="/recruiter/dashboard"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-72px)] bg-slate-50">
            <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-10">

                {/* Back */}
                <Link
                    to="/recruiter/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-indigo-600"
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <div className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-7 text-white shadow-xl shadow-indigo-200 sm:p-9">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                                <Pencil size={13} />
                                Recruiter Workspace
                            </div>

                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                Edit job posting
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
                                Update your opportunity and keep
                                candidates informed with the latest
                                details.
                            </p>
                        </div>

                        <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 sm:flex">
                            <FileText
                                size={35}
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-7"
                >
                    {error && (
                        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
                            <CheckCircle2
                                size={18}
                            />
                            {success}
                        </div>
                    )}

                    <div className="grid gap-7 lg:grid-cols-[1fr_320px]">

                        {/* Main */}
                        <div className="space-y-7">

                            {/* Basic Information */}
                            <section className="hf-card p-6 sm:p-7">
                                <div className="mb-6 flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <BriefcaseBusiness
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <h2 className="font-extrabold text-slate-900">
                                            Basic Information
                                        </h2>

                                        <p className="text-xs text-slate-400">
                                            Update the core job details
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-5">

                                    {/* Title */}
                                    <div>
                                        <label
                                            htmlFor="title"
                                            className="mb-2 block text-sm font-bold text-slate-700"
                                        >
                                            Job Title
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <BriefcaseBusiness
                                                size={18}
                                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                id="title"
                                                name="title"
                                                value={
                                                    formData.title
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                            />
                                        </div>
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label
                                            htmlFor="company"
                                            className="mb-2 block text-sm font-bold text-slate-700"
                                        >
                                            Company
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <Building2
                                                size={18}
                                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                id="company"
                                                name="company"
                                                value={
                                                    formData.company
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                            />
                                        </div>
                                    </div>

                                    {/* Location + Job Type */}
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="location"
                                                className="mb-2 block text-sm font-bold text-slate-700"
                                            >
                                                Location
                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <div className="relative">
                                                <MapPin
                                                    size={18}
                                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                                />

                                                <input
                                                    id="location"
                                                    name="location"
                                                    value={
                                                        formData.location
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="jobType"
                                                className="mb-2 block text-sm font-bold text-slate-700"
                                            >
                                                Job Type
                                            </label>

                                            <select
                                                id="jobType"
                                                name="jobType"
                                                value={
                                                    formData.jobType
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-700 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                            >
                                                <option>
                                                    Full Time
                                                </option>
                                                <option>
                                                    Part Time
                                                </option>
                                                <option>
                                                    Internship
                                                </option>
                                                <option>
                                                    Contract
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Salary + Experience */}
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="salary"
                                                className="mb-2 block text-sm font-bold text-slate-700"
                                            >
                                                Salary
                                            </label>

                                            <div className="relative">
                                                <IndianRupee
                                                    size={17}
                                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                                />

                                                <input
                                                    id="salary"
                                                    name="salary"
                                                    value={
                                                        formData.salary
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="e.g. ₹6–10 LPA"
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="experience"
                                                className="mb-2 block text-sm font-bold text-slate-700"
                                            >
                                                Experience
                                            </label>

                                            <input
                                                id="experience"
                                                name="experience"
                                                value={
                                                    formData.experience
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                            />
                                        </div>
                                    </div>

                                    {/* Deadline */}
                                    <div>
                                        <label
                                            htmlFor="deadline"
                                            className="mb-2 block text-sm font-bold text-slate-700"
                                        >
                                            Application Deadline
                                            <span className="ml-1 text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <CalendarDays
                                                size={18}
                                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                id="deadline"
                                                name="deadline"
                                                type="date"
                                                min={today}
                                                value={
                                                    formData.deadline
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Description */}
                            <section className="hf-card p-6 sm:p-7">
                                <div className="mb-6 flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                        <FileText
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <h2 className="font-extrabold text-slate-900">
                                            Job Description
                                        </h2>

                                        <p className="text-xs text-slate-400">
                                            Update the role description
                                        </p>
                                    </div>
                                </div>

                                <textarea
                                    id="description"
                                    name="description"
                                    rows={8}
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-6 text-slate-900 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                />
                            </section>

                            {/* Skills */}
                            <section className="hf-card p-6 sm:p-7">
                                <div className="mb-6 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                            <Sparkles
                                                size={18}
                                            />
                                        </div>

                                        <div>
                                            <h2 className="font-extrabold text-slate-900">
                                                Required Skills
                                            </h2>

                                            <p className="text-xs text-slate-400">
                                                Update required skills
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            addArrayItem(
                                                "skills"
                                            )
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-100"
                                    >
                                        <Plus size={14} />
                                        Add
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {formData.skills.map(
                                        (
                                            skill,
                                            index
                                        ) => (
                                            <div
                                                key={`skill-${index}`}
                                                className="flex gap-2"
                                            >
                                                <input
                                                    value={
                                                        skill
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleArrayChange(
                                                            "skills",
                                                            index,
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="e.g. React.js"
                                                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                                                />

                                                {formData
                                                    .skills
                                                    .length >
                                                    1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeArrayItem(
                                                                "skills",
                                                                index
                                                            )
                                                        }
                                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500"
                                                    >
                                                        <Trash2
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>

                            {/* Requirements */}
                            <section className="hf-card p-6 sm:p-7">
                                <div className="mb-6 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                            <CheckCircle2
                                                size={18}
                                            />
                                        </div>

                                        <div>
                                            <h2 className="font-extrabold text-slate-900">
                                                Requirements
                                            </h2>

                                            <p className="text-xs text-slate-400">
                                                Update candidate requirements
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            addArrayItem(
                                                "requirements"
                                            )
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-100"
                                    >
                                        <Plus size={14} />
                                        Add
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {formData.requirements.map(
                                        (
                                            requirement,
                                            index
                                        ) => (
                                            <div
                                                key={`requirement-${index}`}
                                                className="flex gap-2"
                                            >
                                                <input
                                                    value={
                                                        requirement
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleArrayChange(
                                                            "requirements",
                                                            index,
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="e.g. Strong problem-solving skills"
                                                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                                                />

                                                {formData
                                                    .requirements
                                                    .length >
                                                    1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeArrayItem(
                                                                "requirements",
                                                                index
                                                            )
                                                        }
                                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500"
                                                    >
                                                        <Trash2
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                            <div className="hf-card p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Save size={19} />
                                    </div>

                                    <div>
                                        <h3 className="font-extrabold text-slate-900">
                                            Save Changes
                                        </h3>

                                        <p className="text-xs text-slate-400">
                                            Update this job posting
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-5 text-sm leading-6 text-slate-500">
                                    Your changes will be saved to
                                    the existing job posting.
                                </p>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                                >
                                    {saving ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={17} />
                                            Save Changes
                                        </>
                                    )}
                                </button>

                                <Link
                                    to="/recruiter/dashboard"
                                    className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                                >
                                    Cancel
                                </Link>
                            </div>

                            <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
                                <Sparkles
                                    size={20}
                                    className="text-indigo-300"
                                />

                                <h3 className="mt-4 font-extrabold">
                                    Keep it updated
                                </h3>

                                <p className="mt-2 text-xs leading-5 text-slate-400">
                                    Accurate job details help candidates
                                    understand the opportunity and decide
                                    whether to apply.
                                </p>
                            </div>
                        </aside>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default EditJob;