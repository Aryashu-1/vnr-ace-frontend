"use client"

import Link from "next/link";
import { DUMMY_JOBS } from "./data";
import {
    Building2, MapPin, DollarSign, Calendar, ChevronRight,
    Search, Filter, Briefcase, IndianRupee
} from "lucide-react";

import { usePlacements } from "@/components/placements-provider";
import { Loader2 } from "lucide-react";

export default function ApplicationPortalPage() {
    const { jobs, isLoading } = usePlacements();

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Application Portal</h1>
                    <p className="text-gray-500 mt-2 text-sm">Discover and apply to top companies hiring from campus</p>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search roles, companies..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full md:w-64 bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Grid of job cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <Link
                        key={job.id}
                        href={`/placements/application-portal/${job.id}`}
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-full overflow-hidden"
                    >
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold tracking-wider">
                                    {job.company_name.substring(0, 2).toUpperCase()}
                                </div>
                                {job.status === 'applied' && (
                                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                                        Applied
                                    </span>
                                )}
                                {job.status === 'withdrawn' && (
                                    <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-200">
                                        Withdrawn
                                    </span>
                                )}
                                {job.status === 'not_applied' && (
                                    <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                                        Open
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                                {job.role}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4 font-medium">{job.company_name}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-sm text-gray-600">
                                    <IndianRupee className="w-4 h-4 mr-2 text-gray-400" />
                                    {job.ctc} LPA
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                    {job.location || "Campus Drive"}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
                            <span
                                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium py-2.5 rounded-lg group-hover:bg-gray-50 group-hover:text-blue-600 transition-colors text-sm"
                            >
                                View Details
                                <ChevronRight className="w-4 h-4" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
