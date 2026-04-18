"use client"

import { WandSparkles, Save, Sparkles, Type, Braces, RefreshCcw, Info } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ResumeEditorProps {
  sectionName: string | null
  editorValue: string
  isStructured: boolean
  isDirty: boolean
  isSaving: boolean
  isImproving: boolean
  selectedSnippet: string
  onChange: (value: string) => void
  onSave: () => void
  onImproveSection: () => void
  onImproveSelection: () => void
  onReset: () => void
  onSelectionChange: (value: string) => void
}

export function ResumeEditor({
  sectionName,
  editorValue,
  isStructured,
  isDirty,
  isSaving,
  isImproving,
  selectedSnippet,
  onChange,
  onSave,
  onImproveSection,
  onImproveSelection,
  onReset,
  onSelectionChange,
}: ResumeEditorProps) {
  if (!sectionName) {
    return (
      <section className="rounded-[32px] border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur-xl transition-all duration-500">
        <div className="flex h-full min-h-[580px] items-center justify-center rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50/50">
          <div className="max-w-xs text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
              <Type className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-900">Editor Workspace</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Select a section from the structure panel to start refining your resume with AI assistance.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600/80">Content Editor</p>
          <h2 className="mt-2 text-3xl font-black capitalize tracking-tight text-slate-950">{sectionName.replace(/_/g, " ")}</h2>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <Info className="h-3.5 w-3.5 text-sky-500" />
            {isStructured ? "Structured JSON mode for precision." : "Rich text mode for descriptive content."}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
            isStructured ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "bg-sky-50 text-sky-600 border border-sky-100"
          }`}>
            {isStructured ? <Braces className="h-3.5 w-3.5" /> : <Type className="h-3.5 w-3.5" />}
            {isStructured ? "Structured" : "Free Text"}
          </div>
          {isDirty && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-amber-600 border border-amber-100 animate-pulse">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Unsaved Changes
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div className="group relative rounded-[28px] border border-slate-200 bg-white p-2 shadow-inner transition-all duration-300 focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-50">
          <Textarea
            value={editorValue}
            onChange={(event) => onChange(event.target.value)}
            onSelect={(event) => {
              const target = event.target as HTMLTextAreaElement
              onSelectionChange(target.value.slice(target.selectionStart, target.selectionEnd).trim())
            }}
            className="min-h-[520px] resize-none border-0 bg-transparent px-5 py-4 font-mono text-[15px] leading-relaxed text-slate-800 shadow-none focus-visible:ring-0 selection:bg-sky-100 selection:text-sky-900"
            placeholder="Start typing or select a suggestion to populate this section..."
          />
          
          <div className="absolute right-4 bottom-4 flex items-center gap-2 opacity-0 transition-opacity group-focus-within:opacity-100">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-200">
              Auto-save enabled
            </span>
          </div>
        </div>

        <div className={`flex flex-wrap items-center justify-between gap-4 rounded-3xl border p-5 transition-all duration-500 ${
          selectedSnippet 
            ? "border-sky-200 bg-[linear-gradient(135deg,#f0f9ff_0%,#ffffff_100%)] shadow-md" 
            : "border-slate-100 bg-slate-50/50"
        }`}>
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${selectedSnippet ? "bg-sky-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="font-bold text-slate-900 italic">Inline AI Assist</p>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {selectedSnippet 
                ? "Excellent! Click 'Improve' to let the Agent refine your phrasing while maintaining truthfulness." 
                : "Select any phrase or bullet point in the editor to unlock targeted AI improvements."}
            </p>
          </div>
          <button
            onClick={onImproveSelection}
            disabled={!selectedSnippet || isImproving}
            className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:shadow-none ${
              selectedSnippet 
                ? "bg-slate-950 text-white hover:bg-slate-800 shadow-slate-200" 
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {isImproving ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-sky-400" />}
            {isImproving ? "Refining..." : "Improve selection"}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {selectedSnippet ? "Snippet ready for AI" : "Ready for manual edits"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onReset}
              disabled={!isDirty || isSaving}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <RefreshCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={onImproveSection}
              disabled={isImproving}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 px-5 py-2.5 text-sm font-bold text-sky-700 transition-all hover:bg-sky-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <WandSparkles className="h-4 w-4" />
              {isImproving ? "Analyzing..." : "Improve Entire Section"}
            </button>
            <button
              onClick={onSave}
              disabled={!isDirty || isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {isSaving ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Syncing..." : "Commit Changes"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
