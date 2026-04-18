"use client"

import { FileText, FolderKanban, GraduationCap, Sparkles, Star, AlertCircle, CheckCircle2 } from "lucide-react"
import type { ResumeAnalysis } from "@/lib/api"

interface ResumeSectionListProps {
  sections: string[]
  selectedSection: string | null
  analysis: ResumeAnalysis | null
  onSelect: (section: string) => void
}

const iconMap: Record<string, typeof GraduationCap> = {
  education: GraduationCap,
  skills: Sparkles,
  projects: FolderKanban,
  experience: Star,
}

const colorMap: Record<string, string> = {
  education: "bg-indigo-500",
  skills: "bg-amber-500",
  projects: "bg-emerald-500",
  experience: "bg-rose-500",
}

export function ResumeSectionList({
  sections,
  selectedSection,
  analysis,
  onSelect,
}: ResumeSectionListProps) {
  const sectionFeedback = analysis?.section_feedback ?? {}

  return (
    <aside className="rounded-[32px] border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600/80">Workspace Structure</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Resume Sections</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Navigate through your profile. Each section is analyzed independently by our Agent.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const sectionLower = section.toLowerCase()
          const Icon = iconMap[sectionLower] ?? FileText
          const sectionColor = colorMap[sectionLower] ?? "bg-slate-500"
          const feedback = sectionFeedback[section]
          const issueCount = feedback?.issues?.length ?? feedback?.weaknesses?.length ?? 0
          const suggestionCount =
            feedback?.suggestions?.length ?? feedback?.example_rewrites?.length ?? 0
          const isActive = selectedSection === section

          return (
            <button
              key={section}
              onClick={() => onSelect(section)}
              className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                isActive
                  ? "border-sky-200 bg-white shadow-md ring-1 ring-sky-100"
                  : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white hover:shadow-sm"
              }`}
            >
              {isActive && (
                <div className="absolute inset-y-0 left-0 w-1 bg-sky-600" />
              )}
              
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? sectionColor : "bg-white text-slate-400 group-hover:text-slate-600"
                    } ${isActive ? "text-white shadow-lg" : "border border-slate-100 shadow-sm"}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold capitalize transition-colors ${
                      isActive ? "text-slate-950" : "text-slate-600 group-hover:text-slate-900"
                    }`}>
                      {section.replace(/_/g, " ")}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      {issueCount > 0 ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-rose-500">
                          <AlertCircle className="h-3 w-3" />
                          {issueCount} fix{issueCount > 1 ? "es" : ""}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" />
                          Optimized
                        </span>
                      )}
                      {suggestionCount > 0 && (
                        <span className="text-[11px] font-medium text-slate-400">
                          • {suggestionCount} suggestion{suggestionCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {typeof feedback?.score === "number" && (
                  <div className={`text-center transition-opacity ${isActive ? "opacity-100" : "opacity-60"}`}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Score</p>
                    <p className="font-black text-slate-950">{Math.round(feedback.score)}<span className="text-[11px] text-slate-400">/10</span></p>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
