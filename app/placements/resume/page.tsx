"use client"

import { useState, useRef, useEffect } from "react"
import {
    UploadCloud,
    CheckCircle,
    AlertCircle,
    FileText,
    Star,
    Lightbulb,
    ShieldAlert,
    ListChecks,
    ChevronDown,
    ChevronUp,
    Send,
    Bot,
    User,
    ArrowRight,
    Loader2,
} from "lucide-react"
import { analyzeResumeDirect, fetchFromApi } from "@/lib/api"
import { MarkdownText } from "@/components/markdown-text"

// --- Types ---
interface SectionDetail {
    issues?: string[]
    suggestions?: string[]
    example_rewrites?: string[]
}

interface AnalysisResult {
    overall_score: number
    summary: string[]
    section_feedback: Record<string, SectionDetail>
    ats_issues: string[]
    priority_fixes: string[]
}

interface ChatMessage {
    id: string
    role: "user" | "assistant"
    content: string
}

// --- Sub-components ---

function ScoreBadge({ score }: { score: number }) {
    const color = score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-rose-600"
    const ring = score >= 80 ? "ring-emerald-100" : score >= 60 ? "ring-amber-100" : "ring-rose-100"
    const bg = score >= 80 ? "bg-emerald-50" : score >= 60 ? "bg-amber-50" : "bg-rose-50"
    return (
        <div className={`flex flex-col items-center justify-center w-28 h-28 rounded-full ring-8 ${ring} ${bg} shadow-inner`}>
            <span className={`text-4xl font-black ${color}`}>{score}</span>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Score</span>
        </div>
    )
}

function SectionCard({ title, detail }: { title: string; detail: SectionDetail }) {
    const [open, setOpen] = useState(false)
    return (
        <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${open ? "border-indigo-200 shadow-md ring-1 ring-indigo-50" : "border-gray-200 hover:border-gray-300 shadow-sm"}`}>
            <button
                onClick={() => setOpen(v => !v)}
                className={`w-full flex items-center justify-between px-6 py-4 transition-colors text-left ${open ? "bg-indigo-50/30" : "bg-white hover:bg-gray-50"}`}
            >
                <span className={`font-bold capitalize text-sm ${open ? "text-indigo-700" : "text-gray-900"}`}>{title.replace(/_/g, " ")}</span>
                {open ? <ChevronUp className="w-5 h-5 text-indigo-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {open && (
                <div className="px-6 py-5 space-y-5 bg-white border-t border-indigo-100/50">
                    {detail.issues && detail.issues.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldAlert className="w-4 h-4 text-rose-500" />
                                <p className="text-xs font-black text-rose-600 uppercase tracking-widest">Identified Issues</p>
                            </div>
                            <ul className="space-y-2">
                                {detail.issues.map((i, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-3 bg-rose-50/30 p-2.5 rounded-lg border border-rose-100/50">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                                        <MarkdownText text={i} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {detail.suggestions && detail.suggestions.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-4 h-4 text-amber-500" />
                                <p className="text-xs font-black text-amber-700 uppercase tracking-widest">Smart Suggestions</p>
                            </div>
                            <ul className="space-y-2">
                                {detail.suggestions.map((s, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-3 bg-amber-50/30 p-2.5 rounded-lg border border-amber-100/50">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                                        <MarkdownText text={s} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {detail.example_rewrites && detail.example_rewrites.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Bot className="w-4 h-4 text-indigo-500" />
                                <p className="text-xs font-black text-indigo-700 uppercase tracking-widest">Premium Rewrites</p>
                            </div>
                            <ul className="space-y-2.5">
                                {detail.example_rewrites.map((r, idx) => (
                                    <li key={idx} className="text-sm text-indigo-900 italic bg-indigo-50/50 rounded-xl px-4 py-3 border border-indigo-100 shadow-sm">
                                        <div className="flex items-start gap-2">
                                            <ArrowRight className="w-3 h-3 mt-1 text-indigo-400" />
                                            <MarkdownText text={r} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}


// --- Main Page ---
export default function ResumeAnalysisPage() {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Chat state
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [chatInput, setChatInput] = useState("")
    const [chatLoading, setChatLoading] = useState(false)
    const [conversationHistory, setConversationHistory] = useState<any[]>([])
    const chatEndRef = useRef<HTMLDivElement>(null)
    const chatInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatMessages, chatLoading])

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return
        setUploading(true)
        setAnalysis(null)
        setError(null)
        setChatMessages([])
        setConversationHistory([])

        try {
            const data = await analyzeResumeDirect(file)
            setAnalysis(data)
            const intro = `I've analyzed your resume. Here's the overview:\n\n**Score:** ${data.overall_score}/100\n\n**Summary:**\n${(data.summary || []).map((s: string) => `• ${s}`).join("\n")}\n\n**Priority Fixes:**\n${(data.priority_fixes || []).map((f: string, i: number) => `${i + 1}. ${f}`).join("\n")}\n\nFeel free to ask me anything about your resume — I can help you improve specific sections, rewrite bullet points, or tailor it for a particular role.`
            setChatMessages([{ id: "init", role: "assistant", content: intro }])
        } catch (err: any) {
            setError(err?.message || "Failed to analyze resume. Please try again.")
        } finally {
            setUploading(false)
        }
    }

    const handleChatSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!chatInput.trim() || !analysis) return

        const question = chatInput
        const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: question }
        setChatMessages(prev => [...prev, userMsg])
        setChatInput("")
        setChatLoading(true)

        try {
            const data = await fetchFromApi("/placements/resume/chat", {
                method: "POST",
                body: JSON.stringify({
                    message: question,
                    structured_analysis: analysis,
                    conversation_history: conversationHistory,
                }),
            })

            const reply = data.reply || data.message || JSON.stringify(data)
            if (data.conversation_history) {
                setConversationHistory(data.conversation_history)
            }
            setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: reply }])
        } catch (err) {
            setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I couldn't get a response. Please try again." }])
        } finally {
            setChatLoading(false)
        }
    }

    return (
        <div className="-mx-6 -mt-6 min-h-[calc(100vh-64px)] bg-gray-50 text-gray-900 font-inter">

            {/* ── Top Hero Bar ── */}
            <div className="px-8 pt-10 pb-8 bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 ring-4 ring-indigo-50">
                            <FileText className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Resume Optimizer</h1>
                            <p className="text-sm font-medium text-gray-500 mt-1">AI-powered ATS feedback & strategic improvement engine</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 py-10 space-y-12">

                {/* ── Upload Card ── */}
                {!analysis && (
                    <div className="bg-white border border-gray-200 rounded-[2rem] p-10 shadow-xl shadow-gray-200/50 animate-in fade-in zoom-in-95 duration-500">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Start Your Analysis</h2>
                            <p className="text-gray-500 text-center mb-8">Upload your resume to receive a detailed ATS score and improvement roadmap.</p>
                            
                            <form onSubmit={handleUpload} className="space-y-6">
                                <label
                                    htmlFor="resume-file"
                                    className={`flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer py-16 gap-4
                                        ${file ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-gray-50/50 hover:border-indigo-400 hover:bg-indigo-50/30"}`}
                                >
                                    <div className={`p-4 rounded-full ${file ? "bg-indigo-600 text-white" : "bg-white text-gray-400 shadow-sm"}`}>
                                        <UploadCloud className="w-10 h-10" />
                                    </div>
                                    {file ? (
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-indigo-700">{file.name}</p>
                                            <p className="text-sm text-indigo-500 font-medium mt-1">{(file.size / 1024).toFixed(1)} KB · Ready for analysis</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-gray-900">Click to upload or drag &amp; drop</p>
                                            <p className="text-sm text-gray-500 mt-1">PDF, DOCX, or TXT formats supported</p>
                                        </div>
                                    )}
                                    <input id="resume-file" type="file" accept=".pdf,.docx,.txt" className="hidden"
                                        onChange={e => setFile(e.target.files?.[0] || null)} />
                                </label>

                                <button
                                    type="submit"
                                    disabled={!file || uploading}
                                    className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl
                                        hover:bg-indigo-700 hover:-translate-y-0.5
                                        disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none
                                        transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 text-lg"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Analyzing with Academic AI...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="w-5 h-5" />
                                            Analyze My Resume
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Error ── */}
                {error && (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                        <div className="bg-rose-600 p-2 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
                        </div>
                        <div>
                            <h3 className="font-bold text-rose-900">Analysis Failed</h3>
                            <p className="text-sm text-rose-700 mt-0.5">{error}</p>
                        </div>
                    </div>
                )}

                {/* ── Analysis Results ── */}
                {analysis && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

                        {/* Report Section */}
                        <div className="space-y-8">
                            <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Analysis Report</h2>
                                    </div>
                                    <ScoreBadge score={analysis.overall_score} />
                                </div>

                                {/* Summary */}
                                {analysis.summary?.length > 0 && (
                                    <div className="mb-10 p-6 bg-gray-50 border border-gray-100 rounded-3xl">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Strategy Overview</h3>
                                        </div>
                                        <ul className="space-y-3">
                                            {analysis.summary.map((s, i) => (
                                                <li key={i} className="text-[15px] text-gray-700 flex items-start gap-3">
                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                                    <MarkdownText text={s} />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Priority Fixes */}
                                {analysis.priority_fixes?.length > 0 && (
                                    <div className="mb-10">
                                        <div className="flex items-center gap-2 mb-5">
                                            <ListChecks className="w-5 h-5 text-indigo-600" />
                                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Immediate Priorities</h3>
                                        </div>
                                        <div className="grid gap-3">
                                            {analysis.priority_fixes.map((fix, i) => (
                                                <div key={i} className="text-sm text-indigo-900 bg-indigo-50/50 border border-indigo-100 rounded-2xl px-5 py-4 flex items-center gap-4">
                                                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-indigo-200 flex items-center justify-center font-black text-indigo-600 shadow-sm">
                                                        {i + 1}
                                                    </span>
                                                    <MarkdownText text={fix} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ATS Issues */}
                                {analysis.ats_issues?.length > 0 && (
                                    <div className="pt-6 border-t border-gray-100">
                                        <div className="flex items-center gap-2 mb-5">
                                            <ShieldAlert className="w-5 h-5 text-rose-600" />
                                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">ATS Compliance Alerts</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {analysis.ats_issues.map((issue, i) => (
                                                <div key={i} className="text-sm text-rose-800 bg-rose-50 border border-rose-100 rounded-2xl px-5 py-4 flex items-start gap-3">
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                                                    <MarkdownText text={issue} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section Feedback */}
                            {analysis.section_feedback && Object.keys(analysis.section_feedback).length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm">
                                    <div className="flex items-center gap-2 mb-8">
                                        <Lightbulb className="w-5 h-5 text-indigo-600" />
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Detailed Section Audit</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {Object.entries(analysis.section_feedback).map(([section, detail]) => (
                                            <SectionCard key={section} title={section} detail={detail} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Section (Now Below) */}
                        <div className="bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100/50 flex flex-col h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Chat Header */}
                            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                                        <Bot className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 tracking-tight">AI Resume Feedback Guide</p>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Reasoning Engine</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 px-8 py-6 space-y-6 overflow-y-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-indigo-600"}`}>
                                            {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div className={`max-w-[85%] px-5 py-4 rounded-[1.5rem] text-[14px] leading-relaxed shadow-sm border
                                            ${msg.role === "user"
                                                ? "bg-indigo-600 text-white border-indigo-500 rounded-tr-none px-6"
                                                : "bg-white text-gray-700 border-gray-100 rounded-tl-none font-medium"}`}>
                                            <MarkdownText text={msg.content} />
                                        </div>
                                    </div>
                                ))}
                                {chatLoading && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-indigo-600 flex items-center justify-center shadow-sm">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="bg-white border border-gray-100 px-6 py-4 rounded-[1.5rem] rounded-tl-none shadow-sm flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:800ms]" />
                                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:200ms]" />
                                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-duration:800ms] [animation-delay:400ms]" />
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleChatSend} className="px-8 py-6 bg-white border-t border-gray-100">
                                <div className="relative group">
                                    <input
                                        ref={chatInputRef}
                                        type="text"
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        placeholder="Ask for feedback or a rewrite..."
                                        className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 px-6 py-4 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all pr-16 font-medium"
                                    />
                                    <button
                                        type="submit"
                                        disabled={chatLoading || !chatInput.trim()}
                                        className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-4 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-center text-gray-400 mt-4 font-black uppercase tracking-widest">Powered by Academic Reasoning Engine</p>
                            </form>
                        </div>

                    </div>
                )}
            </div>
            
            {/* Branding Footer */}
            {!analysis && (
                <div className="max-w-5xl mx-auto px-8 pb-20 text-center opacity-40">
                    <div className="flex items-center justify-center gap-8 grayscale">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5" />
                            <span className="font-black text-xs uppercase tracking-tighter">AI Powered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5" />
                            <span className="font-black text-xs uppercase tracking-tighter">ATS Guard</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            <span className="font-black text-xs uppercase tracking-tighter">Premium Audit</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
