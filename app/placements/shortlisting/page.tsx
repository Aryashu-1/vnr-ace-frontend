"use client"

import React, { useState } from "react"
import { Search, Filter, Briefcase, Users, ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import { API_BASE_URL, runShortlistingDirect } from "@/lib/api"

interface Student {
    roll_no: string
    score: number
    resume_id: string
    match_reason?: string
    matched_chunks?: any[]
}

function MarkdownText({ text }: { text: string }) {
    // Split by bold pattern **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return (
        <span>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index} className="font-bold text-indigo-700">{part.slice(2, -2)}</strong>;
                }
                // Handle newlines within non-bold parts
                return part.split('\n').map((line, lineIndex, array) => (
                    <span key={index + '-' + lineIndex}>
                        {line}
                        {lineIndex < array.length - 1 && <br />}
                    </span>
                ));
            })}
        </span>
    );
}

export default function ShortlistingPage() {
    const [jd, setJd] = useState("")
    const [minGpa, setMinGpa] = useState("")
    const [branch, setBranch] = useState("all")
    const [topK, setTopK] = useState("5")
    const [loading, setLoading] = useState(false)
    const [matches, setMatches] = useState<Student[]>([])
    const [expandedRollNo, setExpandedRollNo] = useState<string | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMatches([])

        try {
            // Using the direct shortlisting API with all filters
            const data = await runShortlistingDirect(
                jd, 
                parseInt(topK), 
                minGpa ? parseFloat(minGpa) : undefined, 
                branch
            );
            
            if (data.matches) {
                setMatches(data.matches);
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 pb-8">
            <h1 className="text-2xl font-bold text-gray-900">Resume Shortlisting</h1>

            <div className="flex flex-col gap-6">

                    {/* Search Form */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-600" /> Criteria Selection
                        </h3>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 outline-none h-40 resize-none"
                                    placeholder="Paste JD here..."
                                    value={jd}
                                    onChange={(e) => setJd(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min GPA</label>
                                    <input
                                        type="number" step="0.1" max="10"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 outline-none"
                                        placeholder="e.g. 7.5"
                                        value={minGpa}
                                        onChange={(e) => setMinGpa(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 outline-none"
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                    >
                                        <option value="all">All Branches</option>
                                        <option value="CSE">CSE</option>
                                        <option value="IT">IT</option>
                                        <option value="ECE">ECE</option>
                                        <option value="EEE">EEE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5" /> No. of Students
                                    </label>
                                    <input
                                        type="number" min="1" max="100"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 outline-none"
                                        placeholder="e.g. 10"
                                        value={topK}
                                        onChange={(e) => setTopK(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? "Searching..." : <><Search className="w-4 h-4" /> Find Suitable Students</>}
                            </button>
                        </form>
                    </div>

                    {/* Results Table */}
                    {matches.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <h4 className="font-bold text-gray-900 text-sm">Matches Found ({matches.length})</h4>
                            </div>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-gray-500 border-b">
                                    <tr>
                                        <th className="px-4 py-2 font-medium text-gray-700">Roll No</th>
                                        <th className="px-4 py-2 font-medium text-gray-700">Resume ID</th>
                                        <th className="px-4 py-2 font-medium text-gray-700 text-right">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {matches.map((s, idx) => {
                                        const isExpanded = expandedRollNo === s.roll_no;
                                        return (
                                            <React.Fragment key={idx}>
                                                <tr 
                                                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${isExpanded ? 'bg-indigo-50/30' : ''}`}
                                                    onClick={() => setExpandedRollNo(isExpanded ? null : s.roll_no)}
                                                >
                                                    <td className="px-4 py-3 text-gray-900 font-medium">
                                                        <div className="flex items-center gap-2">
                                                            {isExpanded ? <ChevronUp className="w-4 h-4 text-indigo-500" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                                            {s.roll_no}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{s.resume_id}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-24 hidden md:block">
                                                                <div 
                                                                    className="h-full bg-indigo-500 rounded-full" 
                                                                    style={{ width: `${s.score * 100}%` }}
                                                                />
                                                            </div>
                                                            <span className="font-bold text-indigo-600 tabular-nums">{(s.score * 100).toFixed(1)}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr className="bg-indigo-50/40">
                                                        <td colSpan={3} className="px-8 py-5 border-t border-indigo-100/50">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                                                    <Sparkles className="w-3.5 h-3.5" /> Shortlisting Verdict
                                                                </div>
                                                                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                                                                    {s.match_reason ? (
                                                                        <div className="text-sm text-gray-800 leading-relaxed font-medium">
                                                                            <MarkdownText text={s.match_reason} />
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-sm text-gray-500 italic">No detailed match reason provided for this profile.</p>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center justify-start text-[10px] text-gray-400 font-medium px-1">
                                                                    Source Resume: {s.resume_id}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
            </div>
        </div>
    )
}
