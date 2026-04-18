"use client"

import { useState, useRef, useEffect } from "react"
import { FileText, Loader2, Sparkles, UploadCloud, Info, CheckCircle2, AlertCircle, Zap, ShieldCheck, Target, ChevronRight, Brain } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { SignInPrompt } from "@/components/sign-in-prompt"
import { PlacementsChatbot } from "@/components/placements-chatbot"
import { analyzeResumeDirect, type ResumeAnalysis, type ResumeSectionFeedback } from "@/lib/api"

export default function ResumeFeedbackPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [resumeText, setResumeText] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const chatbotRef = useRef<HTMLDivElement>(null)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsAnalyzing(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await analyzeResumeDirect(file)
      // Normalize analysis structure
      const rawAnalysis = response.analysis || response
      setAnalysis(rawAnalysis)
      setResumeText(response.resume_text || "")
      
      // Auto-scroll to results
      setTimeout(() => {
        window.scrollTo({ top: 300, behavior: "smooth" })
      }, 100)
    } catch (err: any) {
      setError(err.message || "Failed to analyze resume. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
      </div>
    )
  }

  if (!user || user.role === "guest") {
    return <SignInPrompt moduleName="Placements" />
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Light Clean Header */}
      <header className="bg-white border-b border-slate-200 py-10 shadow-sm">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-sky-600 border border-sky-100 mb-4">
                <Sparkles className="h-3 w-3" />
                Placement Agentic Suite
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Resume <span className="text-sky-600">Intelligence.</span>
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500 max-w-md">
                Get section-by-section detailed feedback and talk to our AI Agent to refine your career documents.
              </p>
            </div>

            <div className="w-full max-w-md">
              <form onSubmit={handleUpload} className="rounded-2xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-sky-500/20">
                <div className="flex flex-col sm:flex-row gap-1.5">
                  <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 transition-all hover:bg-sky-50 hover:border-sky-300 group">
                    <UploadCloud className="h-5 w-5 text-slate-400 group-hover:text-sky-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {file ? file.name : "Upload Resume"}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400">PDF, DOCX supported</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.docx,.doc" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={!file || isAnalyzing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-xs font-black text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 disabled:bg-slate-300 active:scale-95"
                  >
                    {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 text-sky-400" />}
                    {isAnalyzing ? "Processing..." : "Analyze"}
                  </button>
                </div>
              </form>
              {error && (
                <p className="mt-3 text-[11px] font-bold text-rose-500 flex items-center gap-1.5 px-2">
                  <AlertCircle className="h-3.5 w-3.5" /> {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {analysis ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Top Level Metrics */}
            <div className="grid gap-6 md:grid-cols-4">
              <div className="md:col-span-1 rounded-[32px] border border-sky-100 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 mb-4">ATS Health</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black tracking-tighter text-slate-950">{analysis.overall_score || analysis.score || "0"}</span>
                  <span className="text-sm font-bold text-slate-400">/ 10</span>
                </div>
                <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className="h-full bg-sky-600 transition-all duration-1000"
                    style={{ width: `${(analysis.overall_score || analysis.score || 0) * 10}%` }}
                  />
                </div>
              </div>

              <div className="md:col-span-3 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-400">
                  <Info className="h-4 w-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Agent Insight</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {(analysis.summary || []).slice(0, 2).map((s, i) => (
                    <p key={i} className="text-sm font-medium leading-relaxed text-slate-600 border-l-2 border-sky-100 pl-4">
                      {s}
                    </p>
                  ))}
                  {(!analysis.summary || analysis.summary.length === 0) && (
                    <p className="text-sm text-slate-400 italic">Analysis complete. Detailed section feedback available below.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section Wise Detailed Feedback */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                <Target className="h-5 w-5 text-sky-600" />
                <h3 className="text-xl font-black text-slate-950 tracking-tight">Section-by-Section Analysis</h3>
              </div>
              
              <div className="grid gap-6">
                {analysis.section_feedback && Object.entries(analysis.section_feedback).map(([sectionName, feedback]: [string, any], index) => (
                  <div key={sectionName} className="group rounded-[32px] border border-slate-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-sky-200">
                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
                      {/* Section Label & Score */}
                      <div className="md:w-64 p-6 bg-slate-50/50 flex flex-col justify-between group-hover:bg-sky-50/30 transition-colors">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Section {index + 1}</p>
                          <h4 className="mt-1 text-lg font-black capitalize text-slate-950">{sectionName.replace(/_/g, " ")}</h4>
                        </div>
                        {feedback.score !== undefined && (
                          <div className="mt-4 inline-flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 border border-slate-100 shadow-sm self-start">
                            <p className="text-[10px] font-black text-slate-400">SCORE</p>
                            <p className="text-sm font-black text-sky-600">{feedback.score}/10</p>
                          </div>
                        )}
                      </div>

                      {/* Feedback Content */}
                      <div className="flex-1 p-6 grid md:grid-cols-2 gap-8">
                        {/* Strengths */}
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3" /> Strengths
                          </h5>
                          <ul className="space-y-2">
                            {(feedback.strengths || []).map((s: string, i: number) => (
                              <li key={i} className="text-xs font-bold text-slate-600 flex gap-2">
                                <ChevronRight className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                                {s}
                              </li>
                            ))}
                            {(!feedback.strengths || feedback.strengths.length === 0) && (
                              <p className="text-[11px] text-slate-400 italic">No specific strengths listed.</p>
                            )}
                          </ul>
                        </div>

                        {/* Improvements */}
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-2">
                            <Brain className="h-3 w-3" /> Improvements Needed
                          </h5>
                          <ul className="space-y-2">
                            {(feedback.issues || feedback.weaknesses || feedback.suggestions || []).map((w: string, i: number) => (
                              <li key={i} className="text-xs font-bold text-slate-600 flex gap-2">
                                <Zap className="h-3 w-3 text-amber-400 shrink-0 mt-0.5" />
                                {w}
                              </li>
                            ))}
                            {(!(feedback.issues?.length || feedback.weaknesses?.length || feedback.suggestions?.length)) && (
                              <p className="text-[11px] text-slate-400 italic">No issues detected.</p>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chatbot with Context */}
            <div ref={chatbotRef} className="pt-12">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-100">
                      <Brain className="h-5 w-5" />
                    </div>
                    Placement Agent Chat
                  </h3>
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    Grounded in your resume data. Ask for rewrites, tips, or specific feedback.
                  </p>
                </div>
                <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 border border-emerald-100">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Contextual Grounding Active</span>
                </div>
              </div>

              <div className="h-[650px] rounded-[32px] overflow-hidden border border-slate-200 shadow-xl bg-white text-slate-950 ring-1 ring-slate-100">
                <PlacementsChatbot 
                  initialMode="resume" 
                  context={{ 
                    ...analysis,
                    resume_text: resumeText,
                    type: "RESUME_FEEDBACK_GARDEN" 
                  }} 
                />
              </div>
            </div>

          </div>
        ) : (
          !isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 rounded-[28px] bg-white border border-slate-200 flex items-center justify-center shadow-sm text-slate-300">
                <FileText className="h-8 w-8" />
              </div>
              <h2 className="mt-6 text-xl font-black text-slate-900 tracking-tight">Ready for analysis</h2>
              <p className="mt-2 text-slate-500 font-medium text-sm max-w-xs">
                Upload your resume to get detailed section feedback and activate the Placement Agent.
              </p>
            </div>
          )
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
            <h2 className="mt-6 text-xl font-black text-slate-900 tracking-tight">Agent processing...</h2>
            <p className="mt-2 text-slate-500 font-medium text-sm">
              We're breaking down your resume section by section for deep insights.
            </p>
          </div>
        )}
      </main>

      <footer className="mt-10 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">VNR-ACE • Agentic Suite 2026</p>
      </footer>
    </div>
  )
}
