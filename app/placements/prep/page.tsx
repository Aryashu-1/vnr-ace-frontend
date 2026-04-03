"use client"

import { useState } from "react"
import { PlacementsChatbot } from "@/components/placements-chatbot"
import { Building2, Search, Briefcase, FileText, ChevronRight, Play, CheckCircle2, ListFilter } from "lucide-react"
import { startPrepSession } from "@/lib/api"

export default function InterviewPrepPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [topics, setTopics] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [sessionData, setSessionData] = useState<any>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [chatContext, setChatContext] = useState<any>({})

    const handleStartSession = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setIsLoading(true)
        setSessionData(null)
        setSessionId(null)

        try {
            const response = await startPrepSession(searchQuery);
            
            setSessionData({
                company: response.company,
                topics: response.topics || [],
                experiences: response.experiences || [],
                questions: response.questions || response.pyqs || [],
                role: response.role || "Software Engineer"
            });
            setSessionId(response.session_id);
            
            setChatContext({
                type: "INTERVIEW_PREP",
                company: response.company,
                topics: response.topics,
                firstMessage: `Hi, let's start my prep for ${response.company}. Tell me how to approach these questions.`
            });
        } catch (error) {
            console.error("Failed to start session:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-purple-600" />
                Interview Prep Agent
            </h1>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Left: Session Configuration */}
                <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* Setup Section */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ListFilter className="w-5 h-5 text-purple-600" />
                            Setup Interview Preparation
                        </h3>
                        <form onSubmit={handleStartSession} className="flex gap-2">
                            <div className="relative flex-1">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Enter company name (e.g., Oracle, Google)..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !searchQuery.trim()}
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg disabled:opacity-70 transition-all flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4" />
                                )}
                                {isLoading ? "Searching..." : "Search"}
                            </button>
                        </form>
                    </div>

                    {/* Active Session & Data Section */}
                    {sessionId && sessionData && (
                        <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm flex flex-col gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{sessionData.company}</h2>
                                    <p className="text-emerald-600 flex items-center gap-1 font-medium">
                                        <Briefcase className="w-4 h-4" /> {sessionData.role}
                                    </p>
                                </div>
                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Agent Ready
                                </span>
                            </div>

                            <div className="space-y-4">
                                {sessionData.experiences && sessionData.experiences.length > 0 && (
                                    <div>
                                        <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                            <FileText className="w-4 h-4 text-blue-600" /> Interview Experiences
                                        </h4>
                                        <ul className="space-y-2">
                                            {sessionData.experiences.map((exp: any, idx: number) => (
                                                <li key={idx} className="flex gap-2 text-sm text-gray-700 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                                                    <ChevronRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                                    <span>{typeof exp === 'object' ? (exp.content || exp.experience || JSON.stringify(exp)) : exp}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {sessionData.questions && sessionData.questions.length > 0 && (
                                    <div>
                                        <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                            <Building2 className="w-4 h-4 text-orange-600" /> Previous Year Questions
                                        </h4>
                                        <div className="grid grid-cols-1 gap-2">
                                             {sessionData.questions.map((q: any, idx: number) => (
                                                <div key={idx} className="bg-orange-50/50 border border-orange-100 p-3 rounded-lg text-sm text-gray-800 font-medium">
                                                    Q{idx + 1}. {typeof q === 'object' ? q.question || q.content : q}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {!sessionId && !isLoading && (
                         <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 p-8 text-center bg-gray-50/50">
                            Search for a company to view interview insights and start your preparation.
                        </div>
                    )}
                </div>

                {/* Right: Chatbot */}
                <div className="h-full min-h-[500px]">
                    <PlacementsChatbot
                        initialMode="prep"
                        context={chatContext}
                        sessionId={sessionId}
                    />
                </div>
            </div>
        </div>
    )
}
