"use client"

import { useEffect, useState } from "react";
import { getJobDetail, JobListing } from "@/lib/api";
import { 
    Loader2, Building2, MapPin, Calendar, ChevronLeft,
    IndianRupee, Briefcase, Code2, GraduationCap,
    AlertCircle, CheckCircle2, Clock, Send,
    ExternalLink, AlertTriangle, Search
} from "lucide-react";
import Link from "next/link";
import { ApplyButton } from "./apply-button";
import { notFound } from "next/navigation";

import { usePlacements } from "@/components/placements-provider";

import React from "react";

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { getJobById, isLoading: isContextLoading } = usePlacements();
    const [job, setJob] = useState<any>(null);

    useEffect(() => {
        if (!isContextLoading) {
            const found = getJobById(id);
            setJob(found);
        }
    }, [id, getJobById, isContextLoading]);

    if (isContextLoading || (id && !job)) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }
    
    if (!job) {
        return <div className="p-8 text-center">Job not found or has been closed.</div>
    }

    // --- Hardcoded Fallbacks for incomplete DB records (Dynamic based on company) ---
    const companyName = job.company_name || "Enterprise";
    const jobRole = job.role || "Software Engineer";

    const fallbackData = {
        description: `${companyName} is seeking a talented ${jobRole} to join our innovative team. In this role, you will collaborate with cross-functional teams to design, develop, and maintain high-quality software solutions. We are looking for individuals who are passionate about technology, possess strong problem-solving skills, and are eager to contribute to our mission of delivering excellence to our global clients.`,
        instructions: [
            `Submit your professional resume highlighting relevant ${jobRole} experience.`,
            "Include links to your portfolio, GitHub, or any notable projects.",
            `Prepare for a rigorous selection process at ${companyName}, including technical and behavioral assessments.`
        ],
        skills: ["Problem Solving", "Teamwork", "Communication", "Technical Proficiency", "Adaptability"],
        examRounds: [
            { round: 1, name: "Initial Screening", date: "TBD", description: `Brief introduction and resume review by ${companyName} recruiters.` },
            { round: 2, name: "Technical Assessment", date: "TBD", description: `Evaluation of core ${jobRole} skills and problem-solving abilities.` },
            { round: 3, name: "Final Interview", date: "TBD", description: "In-depth discussion on projects, experience, and cultural fit." }
        ],
        criteria: {
            cgpa: job.criteria?.cgpa || "7.0 & Above",
            branches: job.criteria?.branches || ["CSE", "IT", "ECE", "EEE"],
            backlogs: job.criteria?.backlogs || "No active backlogs"
        },
        editDeadline: "Oct 25, 2026"
    };

    // Merge API data with fallbacks
    const displayJob = {
        ...job,
        description: job.description && job.description !== "N/A" ? job.description : fallbackData.description,
        instructions: (job.instructions && job.instructions.length > 0) ? job.instructions : fallbackData.instructions,
        skills: (job.skills && job.skills.length > 0) ? job.skills : fallbackData.skills,
        examRounds: (job.examRounds && job.examRounds.length > 0) ? job.examRounds : fallbackData.examRounds,
        criteria: {
            cgpa: job.criteria?.cgpa && job.criteria?.cgpa !== "N/A" ? job.criteria.cgpa : fallbackData.criteria.cgpa,
            branches: (job.criteria?.branches && job.criteria.branches.length > 0) ? job.criteria.branches : fallbackData.criteria.branches,
            backlogs: job.criteria?.backlogs && job.criteria?.backlogs !== "N/A" ? job.criteria.backlogs : fallbackData.criteria.backlogs,
        },
        editDeadline: job.editDeadline || fallbackData.editDeadline
    };

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
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold bg-blue-100 text-blue-600 shadow-inner`}>
                                {displayJob.company_name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{displayJob.role}</h1>
                                <div className="flex items-center gap-2 text-lg font-medium text-gray-600">
                                    <Building2 className="w-5 h-5" />
                                    {displayJob.company_name}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 md:items-end">
                            <ApplyButton job={displayJob as any} />
                            <div className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Open for applications
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-t border-gray-100">
                        {[
                            { label: "Package", value: displayJob.ctc ? `${displayJob.ctc} LPA` : '12 LPA', icon: IndianRupee },
                            { label: "Location", value: displayJob.location || "Campus Drive", icon: MapPin },
                            { label: "Role Type", value: "Full Time", icon: Briefcase },
                            { label: "Eligibility", value: displayJob.criteria?.cgpa || "7.0+ CGPA", icon: GraduationCap },
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
                        {/* External Registration Warning */}
                        {job.requiresExternalRegistration && !job.isRegisteredExternally && (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-amber-100 rounded-xl">
                                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-amber-900">External Registration Required</h3>
                                        <p className="text-sm text-amber-700 mt-1">
                                            You must register on the company's portal before you can apply here.
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={job.externalRegistrationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-all shadow-sm"
                                >
                                    Register Now
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}

                        {job.requiresExternalRegistration && job.isRegisteredExternally && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 rounded-xl">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-emerald-900">External Registration Verified</h3>
                                    <p className="text-sm text-emerald-700 mt-1">
                                        You have successfully registered on the company portal. You can now proceed with your application.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Job Description */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
                                About the Role
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {displayJob.description}
                            </p>
                        </div>

                        {/* Selection Process / Exam Rounds */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                                Tentative Selection Process
                            </h2>

                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                {displayJob.examRounds?.map((round: any, i: number) => (
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-sm">
                                            {round.round || i + 1}
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
                                    <div className="font-semibold text-gray-900">{displayJob.criteria?.cgpa || "N/A"}</div>
                                </li>
                                <li>
                                    <div className="text-xs font-medium text-gray-500 mb-1">Eligible Branches</div>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {displayJob.criteria?.branches?.map((b: string, i: number) => (
                                            <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium">
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </li>
                                <li>
                                    <div className="text-xs font-medium text-gray-500 mb-1">Backlog History</div>
                                    <div className="text-sm text-gray-800">{displayJob.criteria?.backlogs || "N/A"}</div>
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
                                {displayJob.skills?.map((skill: string, i: number) => (
                                    <span key={i} className="bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-lg border border-blue-100 font-medium hover:bg-blue-100 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Interview Experiences */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-4">
                                <Search className="w-5 h-5 mr-2 text-indigo-500" />
                                Interview Experiences
                            </h2>
                            <div className="space-y-4">
                                {job.experiences && job.experiences.length > 0 ? (
                                    job.experiences.slice(0, 3).map((exp: any, i: number) => (
                                        <div key={i} className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                            <div className="text-sm font-bold text-gray-900 mb-1">{exp.student_name || "Anonymous Student"}</div>
                                            <div className="text-xs text-blue-600 font-medium mb-2">{exp.role} • {exp.year}</div>
                                            <p className="text-xs text-gray-600 line-clamp-2 italic">"{exp.content || exp.summary}"</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                                            <Search className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium italic">Experiences have not been added yet</p>
                                    </div>
                                )}
                                {job.experiences && job.experiences.length > 3 && (
                                    <button className="w-full py-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                        View all experiences
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
