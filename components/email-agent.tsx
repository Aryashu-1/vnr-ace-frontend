"use client"

import { Mail, Send, CheckCircle, XCircle, Loader2, MessageSquare, Plus, Trash2, Edit3, UserPlus } from "lucide-react"
import { useState, useEffect } from "react"
import { API_BASE_URL, getToken, sendEmailAutomation } from "@/lib/api"

export function EmailAgent() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])
  
  // Editable fields for the draft
  const [editRecipients, setEditRecipients] = useState<string>("")
  const [editSubject, setEditSubject] = useState<string>("")
  const [editBody, setEditBody] = useState<string>("")
  const [newRecipient, setNewRecipient] = useState<string>("")

  // Sync editable fields when state changes
  useEffect(() => {
    if (state) {
      setEditRecipients((state.recipients || []).join(", "))
      setEditSubject(state.subject || "")
      setEditBody(state.body || "")
    }
  }, [state])

  const handleProcess = async (approval?: 'approved' | 'rejected') => {
    setLoading(true)
    try {
      if (approval === 'rejected') {
        setState(null)
        setLogs(prev => [...prev, "Draft rejected by user."])
        return
      }

      const body = {
        message: input,
        approval,
        recipients: approval === 'approved' ? editRecipients.split(",").map(r => r.trim()).filter(r => r !== "") : undefined,
        subject: approval === 'approved' ? editSubject : undefined,
        body: approval === 'approved' ? editBody : undefined
      }

      const token = getToken();

      const response = await fetch(`${API_BASE_URL}/classwork/email-automation`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(body)
      })

      const reader = response.body?.getReader()
      if (!reader) return

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'log') {
                setLogs(prev => [...prev, data.content])
              } else if (data.type === 'final') {
                setState(data.state)
                if (data.reply) setLogs(prev => [...prev, data.reply])
                if (data.state?.email_sent) {
                  setLogs(prev => [...prev, "🎉 Broadcast complete! Email has been sent."])
                  setInput("")
                }
              } else if (data.type === 'error') {
                setLogs(prev => [...prev, `❌ Error: ${data.content}`])
              }
            } catch (e) {
              console.error("Error parsing stream chunk", e)
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err)
      setLogs(prev => [...prev, `Error: ${err.message || "Failed to process"}`])
    } finally {
      setLoading(false)
    }
  }

  const addManualRecipient = () => {
    if (newRecipient.trim() && newRecipient.includes("@")) {
      const current = editRecipients ? editRecipients.split(",").map(r => r.trim()) : []
      if (!current.includes(newRecipient.trim())) {
        setEditRecipients([...current, newRecipient.trim()].join(", "))
      }
      setNewRecipient("")
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Command Input & Logs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                </div>
                Agent Intelligence
              </h3>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-tighter">AI Powered</span>
            </div>
            
            <div className="relative group">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. 'Draft an email to Section D students with attendance < 75% informing them about extra classes at 2 PM on Friday.'"
                className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none font-inter leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 font-mono">
                {input.length} chars
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
                {[
                    "Attendance < 75% warning",
                    "Extra classes for Section D",
                    "Parent meeting for low grades",
                    "Placement drive reminder"
                ].map(q => (
                    <button 
                        key={q} 
                        onClick={() => setInput(q === "Attendance < 75% warning" ? "Draft a warning email to all students with attendance below 75%." : q)}
                        className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md hover:bg-emerald-100 transition-colors font-bold border border-emerald-100"
                    >
                        {q}
                    </button>
                ))}
            </div>

            <button 
              onClick={() => handleProcess()}
              disabled={loading || !input.trim()}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-200"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Intent...</>
              ) : (
                <><Send className="w-5 h-5" /> Generate Intelligent Draft</>
              )}
            </button>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operation Logs</h4>
                <button onClick={() => setLogs([])} className="text-[10px] text-gray-400 hover:text-red-500 transition-colors">Clear</button>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 h-48 overflow-y-auto space-y-2 custom-scrollbar">
                {logs.length === 0 && <p className="text-[10px] text-slate-500 italic text-center mt-10">System idle. Waiting for instructions...</p>}
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-[9px] text-emerald-500 font-mono opacity-50 whitespace-nowrap">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
                    <p className="text-[10px] text-slate-300 font-mono leading-relaxed break-words">{log}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Interactive Draft Editor */}
        <div className="lg:col-span-7">
          {state ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <Edit3 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Review & Edit Draft</h3>
                    <p className="text-xs text-gray-500">Fine-tune the agent's proposal before sending</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-tighter">Human Approval Required</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Recipients Section */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
                    <span>Recipients ({editRecipients ? editRecipients.split(',').length : 0})</span>
                    <span className="text-indigo-500 normal-case font-medium">Comma separated</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text"
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      placeholder="Add manual email..."
                      className="flex-1 text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:bg-white"
                      onKeyDown={(e) => e.key === 'Enter' && addManualRecipient()}
                    />
                    <button 
                      onClick={addManualRecipient}
                      className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea 
                    value={editRecipients}
                    onChange={(e) => setEditRecipients(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono min-h-[60px]"
                  />
                </div>

                {/* Subject Section */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Subject</label>
                  <input 
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900"
                  />
                </div>

                {/* Body Section */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Content</label>
                  <textarea 
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none font-inter leading-relaxed text-gray-800 shadow-inner"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => handleProcess('approved')}
                  disabled={loading || !editRecipients.trim() || !editSubject.trim()}
                  className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  Confirm & Broadcast
                </button>
                <button 
                  onClick={() => handleProcess('rejected')}
                  disabled={loading}
                  className="flex-1 bg-white border-2 border-red-100 text-red-500 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 hover:bg-red-50 hover:border-red-200 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center h-full min-h-[500px] text-center group">
              <div className="p-6 bg-white rounded-full shadow-sm mb-6 group-hover:scale-110 transition-transform duration-500">
                <Mail className="w-16 h-16 text-slate-200" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-2">Workspace Empty</h3>
              <p className="text-slate-400 text-sm max-w-sm italic font-inter leading-relaxed">
                Describe the email campaign you want to run. The agent will automatically find relevant students and draft the content for your review.
              </p>
              
              <div className="mt-8 flex gap-3">
                 <div className="px-3 py-1 bg-slate-200 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-widest">Select Recipients</div>
                 <div className="px-3 py-1 bg-slate-200 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-widest">Draft AI Content</div>
                 <div className="px-3 py-1 bg-slate-200 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-widest">SMTP Broadcast</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
