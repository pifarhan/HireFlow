import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    Save,
    Upload,
    User,
    Wrench,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/useAuth";

function StudentProfile() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        education: "",
        skills: "",
        resume: "",
    });

    const [resumeFile, setResumeFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [resumeSuccess, setResumeSuccess] = useState("");

    // =========================================
    // FETCH PROFILE
    // =========================================

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                const response = await api.get("/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const profile = response.data?.user;

                if (profile) {
                    setFormData({
                        name: profile.name || "",
                        email: profile.email || "",
                        phone: profile.phone || "",
                        location: profile.location || "",
                        education: profile.education || "",
                        skills: profile.skills?.join(", ") || "",
                        resume: profile.resume || "",
                    });
                }
            } catch (err) {
                console.error("Fetch Profile Error:", err);

                setError(
                    err.response?.data?.message ||
                        "Unable to load your profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // =========================================
    // HANDLE INPUT
    // =========================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setSuccess("");
        setError("");
    };

    // =========================================
    // HANDLE RESUME FILE
    // =========================================

    const handleResumeFileChange = (event) => {
        const file = event.target.files?.[0];

        setResumeSuccess("");
        setError("");

        if (!file) {
            setResumeFile(null);
            return;
        }

        if (file.type !== "application/pdf") {
            setResumeFile(null);
            setError("Only PDF resume files are allowed.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setResumeFile(null);
            setError("Resume file must be smaller than 5 MB.");
            event.target.value = "";
            return;
        }

        setResumeFile(file);
    };

    // =========================================
    // PROFILE COMPLETION
    // =========================================

    const profileCompletion = useMemo(() => {
        const fields = [
            formData.name,
            formData.phone,
            formData.location,
            formData.education,
            formData.skills,
            formData.resume,
        ];

        const completed = fields.filter(
            (field) =>
                field &&
                field.toString().trim() !== ""
        ).length;

        return Math.round(
            (completed / fields.length) * 100
        );
    }, [formData]);

    // =========================================
    // SAVE PROFILE
    // =========================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token");

            const skillsArray = formData.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean);

            const response = await api.put(
                "/auth/profile",
                {
                    name: formData.name,
                    phone: formData.phone,
                    location: formData.location,
                    education: formData.education,
                    skills: skillsArray,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedUser = response.data?.user;

            if (updatedUser) {
                setUser(updatedUser);

                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                );

                setFormData((previous) => ({
                    ...previous,
                    name: updatedUser.name || "",
                    phone: updatedUser.phone || "",
                    location: updatedUser.location || "",
                    education: updatedUser.education || "",
                    skills:
                        updatedUser.skills?.join(", ") || "",
                    resume: updatedUser.resume || "",
                }));
            }

            setSuccess(
                response.data?.message ||
                    "Profile updated successfully."
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (err) {
            console.error(
                "Update Profile Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Unable to update your profile."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================
    // UPLOAD RESUME
    // =========================================

    const handleResumeUpload = async () => {
        if (!resumeFile) {
            setError("Please choose a PDF resume first.");
            return;
        }

        try {
            setUploadingResume(true);
            setError("");
            setResumeSuccess("");

            const token = localStorage.getItem("token");

            const uploadData = new FormData();

            uploadData.append("resume", resumeFile);

            const response = await fetch(
                "http://localhost:5000/api/auth/profile/resume",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: uploadData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        "Unable to upload your resume."
                );
            }

            const updatedUser = data?.user;

            if (updatedUser) {
                setUser(updatedUser);

                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                );

                setFormData((previous) => ({
                    ...previous,
                    resume: updatedUser.resume || "",
                }));
            }

            setResumeSuccess(
                data?.message ||
                    "Resume uploaded successfully."
            );

            setResumeFile(null);

            const fileInput =
                document.getElementById("resume-upload");

            if (fileInput) {
                fileInput.value = "";
            }
        } catch (err) {
            console.error(
                "Resume Upload Error:",
                err
            );

            setError(
                err.message ||
                    "Unable to upload your resume."
            );
        } finally {
            setUploadingResume(false);
        }
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-72px)] bg-slate-50">
                <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-5">
                    <div className="text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

                        <p className="mt-4 text-sm font-semibold text-slate-600">
                            Loading your profile...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-72px)] bg-slate-50">
            <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-10">

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
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md">
                                    <User size={30} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-indigo-100">
                                        Student Profile
                                    </p>

                                    <h1 className="mt-1 text-2xl font-black sm:text-3xl">
                                        {formData.name ||
                                            "Your Profile"}
                                    </h1>

                                    <p className="mt-1 text-sm text-indigo-100">
                                        Keep your profile updated
                                        for better opportunities.
                                    </p>
                                </div>
                            </div>

                            {/* PROFILE STRENGTH */}

                            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:min-w-[190px]">

                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-indigo-100">
                                        Profile Strength
                                    </span>

                                    <span className="text-lg font-black">
                                        {profileCompletion}%
                                    </span>
                                </div>

                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                                    <div
                                        className="h-full rounded-full bg-white transition-all duration-500"
                                        style={{
                                            width: `${profileCompletion}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                    <div className="absolute -bottom-28 right-32 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl" />
                </section>

                {/* ALERTS */}

                {success && (
                    <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
                        <CheckCircle2 size={19} />
                        {success}
                    </div>
                )}

                {resumeSuccess && (
                    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
                        <CheckCircle2 size={19} />
                        {resumeSuccess}
                    </div>
                )}

                {error && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                        {error}
                    </div>
                )}

                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="mt-7 grid gap-7 lg:grid-cols-[1fr_300px]"
                >

                    {/* MAIN FORM */}

                    <div className="hf-card p-6 sm:p-8">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <User size={19} />
                            </div>

                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900">
                                    Personal Information
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Tell recruiters a little about
                                    yourself.
                                </p>
                            </div>
                        </div>

                        <div className="mt-7 grid gap-5 sm:grid-cols-2">

                            {/* NAME */}

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <User
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your full name"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>

                            {/* EMAIL */}

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 pl-10 pr-4 text-sm font-medium text-slate-500"
                                    />
                                </div>

                                <p className="mt-1.5 text-xs text-slate-400">
                                    Email cannot be changed.
                                </p>
                            </div>

                            {/* PHONE */}

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Phone Number
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 XXXXX XXXXX"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>

                            {/* LOCATION */}

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Location
                                </label>

                                <div className="relative">
                                    <MapPin
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Kolkata, India"
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>

                            {/* EDUCATION */}

                            <div className="sm:col-span-2">

                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Education
                                </label>

                                <div className="relative">
                                    <GraduationCap
                                        size={17}
                                        className="absolute left-3.5 top-3.5 text-slate-400"
                                    />

                                    <textarea
                                        name="education"
                                        value={formData.education}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="B.Tech in Computer Science"
                                        className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>

                            {/* SKILLS */}

                            <div className="sm:col-span-2">

                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Skills
                                </label>

                                <div className="relative">
                                    <Wrench
                                        size={17}
                                        className="absolute left-3.5 top-3.5 text-slate-400"
                                    />

                                    <textarea
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="React.js, JavaScript, Java, MongoDB, Node.js"
                                        className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                                    />
                                </div>

                                <p className="mt-1.5 text-xs text-slate-400">
                                    Separate skills with commas.
                                </p>
                            </div>

                            {/* RESUME */}

                            <div className="sm:col-span-2">

                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Resume
                                </label>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                <FileText size={21} />
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold text-slate-800">
                                                    Upload Resume
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    PDF only • Maximum 5 MB
                                                </p>
                                            </div>
                                        </div>

                                        <label
                                            htmlFor="resume-upload"
                                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-bold text-indigo-600 transition-colors hover:bg-indigo-50"
                                        >
                                            <Upload size={16} />
                                            Choose PDF
                                        </label>

                                        <input
                                            id="resume-upload"
                                            type="file"
                                            accept=".pdf,application/pdf"
                                            onChange={handleResumeFileChange}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* SELECTED FILE */}

                                    {resumeFile && (
                                        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-indigo-900">
                                                    {resumeFile.name}
                                                </p>

                                                <p className="mt-1 text-xs text-indigo-500">
                                                    {(
                                                        resumeFile.size /
                                                        1024 /
                                                        1024
                                                    ).toFixed(2)}{" "}
                                                    MB
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleResumeUpload}
                                                disabled={uploadingResume}
                                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {uploadingResume ? (
                                                    <>
                                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload size={16} />
                                                        Upload Resume
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    {/* EXISTING RESUME */}

                                    {formData.resume && (
                                        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                                            <div className="flex min-w-0 items-center gap-3">

                                                <CheckCircle2
                                                    size={19}
                                                    className="shrink-0 text-emerald-600"
                                                />

                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-emerald-800">
                                                        Resume uploaded
                                                    </p>

                                                    <p className="text-xs text-emerald-600">
                                                        Your resume is available to recruiters.
                                                    </p>
                                                </div>
                                            </div>

                                            <a
                                                href={`http://localhost:5000${formData.resume}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="shrink-0 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                                            >
                                                View
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SAVE */}

                        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/student/dashboard")
                                }
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={17} />
                                        Save Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* SIDEBAR */}

                    <aside className="space-y-5">

                        {/* COMPLETION */}

                        <div className="hf-card p-6">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <CheckCircle2 size={19} />
                                </div>

                                <div>
                                    <h3 className="font-extrabold text-slate-900">
                                        Profile Strength
                                    </h3>

                                    <p className="text-xs text-slate-400">
                                        Complete your profile
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5">

                                <div className="flex items-end justify-between">

                                    <span className="text-3xl font-black text-slate-900">
                                        {profileCompletion}%
                                    </span>

                                    <span className="text-xs font-semibold text-slate-400">
                                        Complete
                                    </span>
                                </div>

                                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                                        style={{
                                            width: `${profileCompletion}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* TIP */}

                        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white shadow-lg">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                <BookOpen size={19} />
                            </div>

                            <h3 className="mt-5 text-lg font-extrabold">
                                Profile Tip
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                A complete profile with a strong
                                resume helps recruiters understand
                                your skills and experience before
                                reviewing your application.
                            </p>
                        </div>
                    </aside>
                </form>
            </div>
        </main>
    );
}

export default StudentProfile;