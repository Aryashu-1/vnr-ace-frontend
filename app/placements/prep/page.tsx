"use client"

import { useState } from "react"
import { PlacementsChatbot } from "@/components/placements-chatbot"
import { Building2, Search, Briefcase, FileText, ChevronRight, Play } from "lucide-react"

export default function CompanyPrepPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoadingPYQs, setIsLoadingPYQs] = useState(false)
    const [pyqData, setPyqData] = useState<any>(null)
    const [chatContext, setChatContext] = useState<any>({})

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setIsLoadingPYQs(true)
        setPyqData(null)
        setChatContext({})

        // Mock API Call
        setTimeout(() => {
            const mockData = {
                company: searchQuery,
                role: "Software Development Engineer",
                experiences: [
                    "The interview had 3 technical rounds. The first was focused on DSA and problem solving.",
                    "System design round was very detailed. They asked me to design a scalable chat application."
                ],
                questions: [
                    "Given an array, find the maximum subarray sum (Kadane's algorithm).",
                    "Design a URL shortening service like TinyURL.",
                    "Explain the differences between processes and threads.",
                    "How would you implement a rate limiter?"
                ]
            }
            setPyqData(mockData)
            setIsLoadingPYQs(false)
        }, 800)
    }

    const handleStartPrep = () => {
        setChatContext({
            type: "COMPANY_PREP",
            company: pyqData.company,
            pyqData: pyqData
        })
    }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-purple-600" />
                Company Specific Prep
            </h1>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Left: Search & PYQ Display */}
                <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* Search Section */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Search Company PYQs</h3>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Enter company name (e.g., Google, Amazon)..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoadingPYQs || !searchQuery.trim()}
                                className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-70 transition-all"
                            >
                                {isLoadingPYQs ? "Searching..." : "Search"}
                            </button>
                        </form>
                    </div>

                    {/* Results Section */}
                    {pyqData && (
                        <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm flex flex-col gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{pyqData.company}</h2>
                                    <p className="text-emerald-600 flex items-center gap-1 font-medium">
                                        <Briefcase className="w-4 h-4" /> {pyqData.role}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-blue-600" /> Interview Experiences
                                    </h4>
                                    <ul className="space-y-2">
                                        {pyqData.experiences.map((exp: string, idx: number) => (
                                            <li key={idx} className="flex gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                <ChevronRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                                <span>{exp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                        <Building2 className="w-4 h-4 text-orange-600" /> Previous Year Questions
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2">
                                         {pyqData.questions.map((q: string, idx: number) => (
                                            <div key={idx} className="bg-orange-50/50 border border-orange-100 p-3 rounded-lg text-sm text-gray-800 font-medium">
                                                Q{idx + 1}. {q}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleStartPrep}
                                className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                            >
                                <Play className="w-5 h-5 fill-white" />
                                Start AI Prep Session
                            </button>
                        </div>
                    )}
                    
                    {!pyqData && !isLoadingPYQs && (
                         <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 p-8 text-center bg-gray-50/50">
                            Search for a company to view Previous Year Questions and start your targeted preparation.
                        </div>
                    )}
                </div>

                {/* Right: Chatbot */}
                <div className="h-full min-h-[500px]">
                    <PlacementsChatbot
                        initialMode="prep"
                        context={chatContext}
                    />
                </div>
            </div>
        </div>
    )
}
