"use client"

import { Mail, Send, CheckCircle, XCircle, Loader2, MessageSquare } from "lucide-react"
import { useState } from "react"
import { sendEmailAutomation } from "@/lib/api"

export default function MailPage() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  const handleProcess = async (approval?: 'approved' | 'rejected') => {
    setLoading(true)
    try {
      const data = await sendEmailAutomation(input, approval)
      setState(data.state)
      if (data.reply) {
        setLogs(prev => [...prev, data.reply])
      }
      if (approval) setInput("") // Clear input if it was an approval action
    } catch (err) {
      console.error(err)
      alert("Failed to process email automation")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mail Agent</h1>
        <p className="text-gray-600 mt-1">Send and manage campus communications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" /> Command Center
          </h3>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Send an email to all 4th year faculty about the meeting tomorrow at 3PM."
            className="w-full h-32 p-4 border border-gray-300 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all resize-none"
          />
          <button 
            onClick={() => handleProcess()}
            disabled={loading || !input.trim()}
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 disabled:bg-gray-300 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Send className="w-4 h-4" /> Run Automation</>}
          </button>

          <div className="mt-6 border-t pt-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Agent Logs</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 max-h-40 overflow-y-auto space-y-2">
              {logs.length === 0 && <p className="text-xs text-gray-400 italic">No activity logs yet.</p>}
              {logs.map((log, i) => (
                <p key={i} className="text-xs text-gray-600 font-mono">[{new Date().toLocaleTimeString()}] {log}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {state ? (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Agent Proposed Action</h3>
                {state.approval_required ? (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">WAITING FOR APPROVAL</span>
                ) : (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">STATE UPDATED</span>
                )}
              </div>

              <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex gap-2">
                  <span className="text-xs font-bold text-gray-400 w-16">Subject:</span>
                  <span className="text-xs text-gray-900 font-medium">{state.subject || "N/A"}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs font-bold text-gray-400 w-16">To:</span>
                  <span className="text-xs text-gray-900 break-all">{(state.recipients || []).join(", ") || "None"}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <p className="text-[11px] text-gray-700 whitespace-pre-wrap leading-relaxed">{state.body || "No email body drafted."}</p>
                </div>
              </div>

              {state.approval_required && (
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => handleProcess('approved')}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve & Send
                  </button>
                  <button 
                    onClick={() => handleProcess('rejected')}
                    className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                  >
                    <XCircle className="w-4 h-4" /> Reject Draft
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <Mail className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-400 text-sm max-w-xs italic">
                Automation states and drafts will appear here once you run a command.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
