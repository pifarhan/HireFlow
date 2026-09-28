import {
    ArrowRight,
    BriefcaseBusiness,
    Search,
    Sparkles,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <main className="overflow-hidden">

            {/* Hero */}
            <section className="relative">
                {/* Background glow */}
                <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
                <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-violet-300/20 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-2 lg:pb-28 lg:pt-24">

                    {/* Left */}
                    <div className="hf-fade-in">

                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                            <Sparkles size={16} />
                            Your next opportunity starts here
                        </div>

                        <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                            Build your career.
                            <span className="hf-gradient-text block">
                                Find your flow.
                            </span>
                        </h1>

                        <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500 sm:text-xl">
                            HireFlow connects ambitious students with
                            meaningful opportunities and helps recruiters
                            discover the talent they need.
                        </p>

                        {/* CTAs */}
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                            <Link
                                to="/jobs"
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-indigo-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-200"
                            >
                                <Search size={19} />
                                Explore Jobs
                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>

                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-lg"
                            >
                                <BriefcaseBusiness size={19} />
                                I'm Hiring
                            </Link>

                        </div>

                        {/* Stats */}
                        <div className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-slate-200">

                            <div className="pr-5">
                                <p className="text-2xl font-black text-slate-900">
                                    1K+
                                </p>
                                <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">
                                    Opportunities
                                </p>
                            </div>

                            <div className="px-5">
                                <p className="text-2xl font-black text-slate-900">
                                    500+
                                </p>
                                <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">
                                    Candidates
                                </p>
                            </div>

                            <div className="pl-5">
                                <p className="text-2xl font-black text-slate-900">
                                    100+
                                </p>
                                <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">
                                    Recruiters
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Right visual */}
                    <div className="relative hidden lg:block">

                        <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-purple-500/10 blur-2xl" />

                        <div className="relative hf-glass rounded-[2rem] p-6 shadow-2xl shadow-indigo-100">

                            {/* Dashboard header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">
                                        Discover opportunities
                                    </p>
                                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                                        Recommended for you
                                    </h3>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Search size={20} />
                                </div>
                            </div>

                            {/* Job preview cards */}
                            <div className="mt-6 space-y-4">

                                <div className="hf-card hf-card-hover p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600">
                                                G
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-slate-900">
                                                    Software Engineer
                                                </h4>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    Google • Bengaluru
                                                </p>
                                            </div>
                                        </div>

                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                                            Full Time
                                        </span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                            React
                                        </span>
                                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                            JavaScript
                                        </span>
                                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                            Node.js
                                        </span>
                                    </div>
                                </div>

                                <div className="hf-card hf-card-hover p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 font-bold text-violet-600">
                                                M
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-slate-900">
                                                    Frontend Developer
                                                </h4>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    Microsoft • Hyderabad
                                                </p>
                                            </div>
                                        </div>

                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                                            Internship
                                        </span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                            React
                                        </span>
                                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                            TypeScript
                                        </span>
                                    </div>
                                </div>

                            </div>

                            {/* Bottom mini stat */}
                            <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-950 px-5 py-4 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                                        <Users size={17} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">
                                            Your career journey
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            One platform. Endless possibilities.
                                        </p>
                                    </div>
                                </div>

                                <ArrowRight
                                    size={18}
                                    className="text-slate-400"
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* Bottom feature strip */}
            <section className="border-y border-slate-200/70 bg-white">
                <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 md:grid-cols-3">

                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Search size={20} />
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900">
                                Find the right role
                            </h3>
                            <p className="text-sm text-slate-500">
                                Search opportunities that fit you.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                            <Users size={20} />
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900">
                                Connect with recruiters
                            </h3>
                            <p className="text-sm text-slate-500">
                                Put your profile in front of employers.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <BriefcaseBusiness size={20} />
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900">
                                Track your journey
                            </h3>
                            <p className="text-sm text-slate-500">
                                Manage applications in one place.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

        </main>
    );
}

export default Home;