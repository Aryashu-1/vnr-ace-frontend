import { DUMMY_JOBS } from "../data";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    Building2, MapPin, Calendar, ChevronLeft,
    IndianRupee, Briefcase, Code2, GraduationCap,
    AlertCircle, CheckCircle2, Clock, Send
} from "lucide-react";
import { ApplyButton } from "./apply-button";

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const job = DUMMY_JOBS.find(j => j.id === resolvedParams.id);

    if (!job) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Back navigation */}
                <Link
                    href="/placements/application-portal"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Portal
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
                    {/* Top banner accent */}
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500 w-full" />

                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold ${job.logoBg} shadow-inner`}>
                                {job.logoText}
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{job.role}</h1>
                                <div className="flex items-center gap-2 text-lg font-medium text-gray-600">
                                    <Building2 className="w-5 h-5" />
                                    {job.companyName}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 md:items-end">
                            <ApplyButton job={job} />
                            <div className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Closes: {job.deadline}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-t border-gray-100">
                        {[
                            { label: "Package", value: job.package, icon: IndianRupee },
                            { label: "Location", value: job.location, icon: MapPin },
                            { label: "Role Type", value: job.tags[0], icon: Briefcase },
                            { label: "Eligibility", value: job.criteria.cgpa, icon: GraduationCap },
                        ].map((stat, i) => (
                            <div key={i} className="p-4 flex flex-col items-center justify-center text-center bg-gray-50/50">
                                <div className="text-gray-400 mb-1"><stat.icon className="w-5 h-5" /></div>
                                <div className="font-semibold text-gray-900">{stat.value}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Job Description */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
                                About the Role
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {job.description}
                            </p>
                        </div>

                        {/* Selection Process / Exam Rounds */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                                Tentative Selection Process
                            </h2>

                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                {job.examRounds.map((round, i) => (
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-sm">
                                            {round.round}
                                        </div>

                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                                            <div className="text-blue-600 font-semibold text-sm mb-1">{round.date}</div>
                                            <h3 className="font-bold text-gray-900 mb-1">{round.name}</h3>
                                            <p className="text-gray-500 text-sm">{round.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        {/* Eligibility Criteria */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-4">
                                <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                                Eligibility Criteria
                            </h2>
                            <ul className="space-y-4">
                                <li>
                                    <div className="text-xs font-medium text-gray-500 mb-1">Minimum CGPA</div>
                                    <div className="font-semibold text-gray-900">{job.criteria.cgpa}</div>
                                </li>
                                <li>
                                    <div className="text-xs font-medium text-gray-500 mb-1">Eligible Branches</div>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {job.criteria.branches.map((b, i) => (
                                            <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium">
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="text-xs font-medium text-gray-500 mb-1">Backlog History</div>
                                    <div className="text-sm text-gray-800">{job.criteria.backlogs}</div>
                                </li>
                            </ul>
                        </div>

                        {/* Required Skills */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-4">
                                <Code2 className="w-5 h-5 mr-2 text-orange-500" />
                                Required Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, i) => (
                                    <span key={i} className="bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-lg border border-blue-100 font-medium hover:bg-blue-100 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
