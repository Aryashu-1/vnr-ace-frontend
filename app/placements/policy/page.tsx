'use client'

import { 
    ShieldCheck, 
    CheckCircle2, 
    AlertCircle, 
    FileText, 
    Scale, 
    Clock, 
    UserCheck,
    ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default function PlacementsPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Back navigation */}
                <Link
                    href="/placements"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Placements Hub
                </Link>

                {/* Header */}
                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <ShieldCheck className="w-48 h-48" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <Scale className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Placements Policy & Guidelines</h1>
                        <p className="text-gray-500 mt-2 text-lg max-w-2xl">
                            Our placement policies are designed to ensure fair opportunities for all students while maintaining high professional standards with our partner companies.
                        </p>
                    </div>
                </div>

                {/* Policy Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Eligibility */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <UserCheck className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="font-bold text-gray-900 text-lg">General Eligibility</h2>
                        </div>
                        <ul className="space-y-3">
                            {[
                                "Minimum CGPA of 6.0 with no active backlogs.",
                                "Valid college identity card and updated profile.",
                                "Completion of mandatory training sessions.",
                                "80% attendance in pre-placement talks."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* One Placement Policy */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:border-orange-200 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                            </div>
                            <h2 className="font-bold text-gray-900 text-lg">One Job Policy</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            To ensure equitable distribution of opportunities, we follow a strict "One Student, One Offer" policy with certain exceptions.
                        </p>
                        <ul className="space-y-3">
                            {[
                                "A student is eligible for only ONE job offer.",
                                "Once placed, the student must withdraw from all other active drives.",
                                "Exception: If a new role offers >150% of current CTC (Dream Offer).",
                                "One 'Dream Offer' attempt allowed per student."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Code of Conduct */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:border-purple-200 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <FileText className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="font-bold text-gray-900 text-lg">Code of Conduct</h2>
                        </div>
                        <ul className="space-y-3">
                            {[
                                "Formal attire is mandatory for all processes.",
                                "Punctuality is critical; latecomers will be barred.",
                                "Misbehavior with company officials results in permanent debarment.",
                                "Backing out after accepting an offer is strictly prohibited."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                                    <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Process Guidelines */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:border-emerald-200 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <Clock className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h2 className="font-bold text-gray-900 text-lg">Process Guidelines</h2>
                        </div>
                        <ul className="space-y-3">
                            {[
                                "Registration on the portal is mandatory for every drive.",
                                "Resume once submitted cannot be changed after the deadline.",
                                "Any malpractice during assessments leads to blacklisting.",
                                "Regularly check email and portal for updates."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Important Notice */}
                <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-lg shadow-blue-200">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Have Questions?</h3>
                            <p className="text-blue-100 opacity-90">
                                Contact the Training & Placement Cell for clarifications regarding any policy.
                            </p>
                        </div>
                        <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                            Contact Placement Cell
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
