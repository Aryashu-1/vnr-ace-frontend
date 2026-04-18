"use client"

import { Brain, RefreshCcw, ShieldAlert, Sparkles, TrendingUp, Target, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ResumeAnalysis, ResumeSectionFeedback } from "@/lib/api"

interface ResumeFeedbackPanelProps {
  analysis: ResumeAnalysis | null
  selectedSection: string | null
  scoreDelta: number | null
  isReanalyzing: boolean
  lastAiChange: {
    title: string
    before: string
    after: string
  } | null
  onReanalyze: () => void
  onApplySuggestion: (instruction: string) => void
  onImproveSection: () => void
}

function CheckCircleSmall() { return <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> }
function AlertCircleSmall() { return <div className="h-1.5 w-1.5 rounded-full bg-amber-500" /> }
function InfoSmall() { return <div className="h-1.5 w-1.5 rounded-full bg-slate-400" /> }

function FeedbackList({
  title,
  tone,
  items,
  actionLabel,
  onAction,
}: {
  title: string
  tone: "good" | "warn" | "neutral"
  items: string[]
  actionLabel?: string
  onAction?: (item: string) => void
}) {
  if (!items.length) return null

  const toneClasses =
    tone === "good"
      ? "border-emerald-100 bg-emerald-50/50 text-emerald-900 shadow-sm shadow-emerald-100/50"
      : tone === "warn"
        ? "border-amber-100 bg-amber-50/50 text-amber-900 shadow-sm shadow-amber-100/50"
        : "border-slate-200 bg-slate-50/50 text-slate-900 shadow-sm shadow-slate-100/50"

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-500">
      <h4 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h4>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className={`group rounded-[20px] border p-4 transition-all duration-300 hover:scale-[1.02] ${toneClasses}`}>
            <p className="text-sm leading-relaxed">{item}</p>
            {actionLabel && onAction && (
              <button
                onClick={() => onAction(item)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-bold text-sky-700 shadow-sm transition-all hover:bg-white hover:text-sky-900 active:scale-95"
              >
                <Zap className="h-3.5 w-3.5" />
                {actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function getSectionFeedback(
  analysis: ResumeAnalysis | null,
  selectedSection: string | null,
): ResumeSectionFeedback | null {
  if (!analysis || !selectedSection) return null
  return analysis.section_feedback?.[selectedSection] ?? null
}

export function ResumeFeedbackPanel({
  analysis,
  selectedSection,
  scoreDelta,
  isReanalyzing,
  lastAiChange,
  onReanalyze,
  onApplySuggestion,
  onImproveSection,
}: ResumeFeedbackPanelProps) {
  const overallScore = analysis?.overall_score ?? analysis?.score ?? null
  const sectionFeedback = getSectionFeedback(analysis, selectedSection)
  
  const strengths = selectedSection && sectionFeedback?.strengths?.length 
    ? sectionFeedback.strengths 
    : (analysis?.strengths ?? analysis?.summary ?? [])
    
  const weaknesses = selectedSection && (sectionFeedback?.issues?.length || sectionFeedback?.weaknesses?.length)
    ? (sectionFeedback.issues ?? sectionFeedback.weaknesses ?? [])
    : (analysis?.weaknesses ?? analysis?.priority_fixes ?? [])

  const suggestions = [
    ...(selectedSection ? (sectionFeedback?.suggestions ?? []) : []),
    ...(selectedSection ? (sectionFeedback?.example_rewrites ?? []) : []),
    ...(analysis?.ats_issues ?? []),
  ]

  return (
    <aside className="rounded-[32px] border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-500">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600/80">AI Insights</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Feedback Loop</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Real-time analysis from our Agent. Apply suggestions and re-run scoring.
          </p>
        </div>

        <button
          onClick={onReanalyze}
          disabled={isReanalyzing}
          className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-sky-300 hover:shadow-md disabled:opacity-50"
          title="Re-analyze resume"
        >
          <RefreshCcw className={`h-5 w-5 text-slate-600 transition-colors group-hover:text-sky-600 ${isReanalyzing ? "animate-spin" : ""}`} />
          {isReanalyzing && (
            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 ring-2 ring-white">
              <div className="h-2 w-2 animate-ping rounded-full bg-white" />
            </div>
          )}
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-sky-100 bg-[linear-gradient(135deg,#eff6ff_0%,#f8fafc_50%,#f0f9ff_100%)] p-5 shadow-inner">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Target className="h-3 w-3 text-sky-600" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">Resume Health</p>
            </div>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-5xl font-black tracking-tighter text-slate-950">{overallScore ?? "--"}</span>
              <div className="mb-1.5">
                <span className="text-xs font-bold text-slate-400">/ 10</span>
                {typeof scoreDelta === "number" && scoreDelta !== 0 && (
                  <div className={`mt-1 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                    scoreDelta > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}>
                    <TrendingUp className={`h-2.5 w-2.5 ${scoreDelta < 0 ? "rotate-180" : ""}`} />
                    {scoreDelta > 0 ? "+" : ""}{scoreDelta.toFixed(1)}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {selectedSection ? (
            <div className="group rounded-2xl bg-white px-4 py-2 shadow-sm border border-sky-50 transition-all hover:shadow-md">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Context</p>
              <p className="text-xs font-bold capitalize text-slate-900">{selectedSection.replace(/_/g, " ")}</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-950 px-4 py-2 shadow-lg shadow-slate-200">
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">State</p>
               <p className="text-xs font-bold text-white">Full Resume</p>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="analysis" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-100/50 p-1">
          <TabsTrigger value="analysis" className="rounded-xl py-2.5 text-xs font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">Analysis</TabsTrigger>
          <TabsTrigger value="suggestions" className="rounded-xl py-2.5 text-xs font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">Suggestions</TabsTrigger>
          <TabsTrigger value="improve" className="rounded-xl py-2.5 text-xs font-bold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">AI Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="mt-6 space-y-6 outline-none">
          <FeedbackList title="Strengths" tone="good" items={strengths} />
          <FeedbackList title="Weaknesses" tone="warn" items={weaknesses} actionLabel="Apply AI Fix" onAction={onApplySuggestion} />
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6 space-y-6 outline-none">
          <FeedbackList
            title={selectedSection ? `${selectedSection.replace(/_/g, " ")} focus` : "Growth Suggestions"}
            tone="neutral"
            items={suggestions}
            actionLabel="Apply this"
            onAction={onApplySuggestion}
          />
        </TabsContent>

        <TabsContent value="improve" className="mt-6 space-y-6 outline-none">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/50 p-5 shadow-inner">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-100">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Agent Rewrite</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Select a section to trigger a full rewrite based on industry best practices and ATS requirements.
                </p>
                <button
                  onClick={onImproveSection}
                  disabled={!selectedSection}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 active:scale-95 disabled:bg-slate-200 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4 text-sky-400" />
                  Improve {selectedSection ? selectedSection.replace(/_/g, " ") : "Section"}
                </button>
              </div>
            </div>
          </div>

          {lastAiChange ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
              <h4 className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400 px-1">Impact Preview</h4>
              <div className="grid gap-3">
                <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-[0.1em] text-rose-500">Original</p>
                    <div className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap italic">{lastAiChange.before}</p>
                </div>
                <div className="relative rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 ring-1 ring-emerald-50 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-600">Improved by Agent</p>
                    <Sparkles className="h-3 w-3 text-emerald-500" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-slate-800 whitespace-pre-wrap">{lastAiChange.after}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/30 text-center p-6 transition-all">
              <Sparkles className="h-6 w-6 text-slate-300" />
              <p className="mt-3 text-xs font-medium text-slate-400 italic">
                Trigger an AI action to see before/after impact previews.
              </p>
            </div>
          )}

          {!!analysis?.ats_issues?.length && (
            <div className="rounded-[24px] border border-amber-100 bg-amber-50/30 p-5 ring-1 ring-amber-50">
              <div className="mb-3 flex items-center gap-3 text-amber-800">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <p className="text-xs font-black uppercase tracking-wider">Guardrails Active</p>
              </div>
              <p className="text-xs leading-relaxed text-amber-900/80">
                Athenticity check active. These ATS notes highlight areas where phrasing might be flagged or lacks quantifiable data.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </aside>
  )
}
