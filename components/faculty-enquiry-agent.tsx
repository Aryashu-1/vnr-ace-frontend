"use client"

import { Search, Send, User, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { sendFacultyEnquiry } from "@/lib/api"

export function FacultyEnquiryAgent() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Hello! Ask me about any faculty member's current location or schedule." }
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput("")
    setLoading(true)

    try {
      const data = await sendFacultyEnquiry(userMsg)
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't reach the enquiry service." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <Search className="w-4 h-4 text-purple-600" />
          <span className="font-bold text-sm text-gray-900">Live Enquiry Terminal</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75" />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Where is Dr. Smith right now?"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500 transition-all"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Recent Enquiries</h3>
          <div className="space-y-2">
            {['CSE HOD availability', 'Room 302 schedule', 'Dr. Ram’s cabin'].map(q => (
              <button key={q} onClick={() => setInput(q)} className="w-full text-left text-xs text-gray-600 p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition-all">
                "{q}"
              </button>
            ))}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 mb-2 text-purple-700">
            <User className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Agent Status</span>
          </div>
          <p className="text-[10px] text-purple-600 leading-relaxed">
            LangGraph Faculty Agent is online. It has access to real-time RFID and Timetable logs.
          </p>
        </div>
      </div>
    </div>
  )
}
