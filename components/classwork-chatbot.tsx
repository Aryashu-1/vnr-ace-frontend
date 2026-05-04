"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, FileBarChart2, Download, Loader2 } from "lucide-react"
import { API_BASE_URL, getToken, sendReportGeneration } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { MarkdownText } from "./markdown-text"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    artifact_path?: string
}

export function ClassworkChatbot() {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content:
                "Hello! I'm the Academic Report Agent. I can help you generate analytical reports on student performance, attendance, and exam results. Try asking: 'Generate a report for students with low attendance and high grades'.",
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { handleError } = useErrorHandler()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userText = input.trim()
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: userText,
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            // Using the specialized Report Generation Agent
            const data = await sendReportGeneration(userText);
            
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.reply || "Report processed.",
                artifact_path: data.artifact_path
            }

            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            const errorMsg = handleError(error, "Could not reach backend.")
            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: errorMsg
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const downloadArtifact = (path: string) => {
        const url = `${API_BASE_URL.replace("/api/v1", "")}/${path}`
        window.open(url, "_blank")
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl h-[650px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-indigo-100">
                        <FileBarChart2 className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg font-inter">Academic Report Assistant</h3>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">AI Analysis Live</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fcfcfd] custom-scrollbar">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] group`}>
                            <div
                                className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${message.role === "user"
                                    ? "bg-indigo-600 text-white rounded-br-none"
                                    : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                                    }`}
                            >
                                {message.role === "assistant" ? (
                                    <MarkdownText text={message.content} />
                                ) : (
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                )}
                                
                                {message.artifact_path && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                                            <div className="p-1.5 bg-indigo-50 rounded-lg">
                                                <Download className="w-3.5 h-3.5" />
                                            </div>
                                            REPORT READY FOR DOWNLOAD
                                        </div>
                                        <button 
                                            onClick={() => downloadArtifact(message.artifact_path!)}
                                            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl transition-all font-bold text-xs shadow-md shadow-emerald-100"
                                        >
                                            <Download className="w-4 h-4" /> Download Excel Report
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className={`mt-1.5 text-[10px] text-gray-400 font-medium ${message.role === "user" ? "text-right" : "text-left"}`}>
                                {message.role === "user" ? "Sent" : "Report Agent"} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 px-5 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3">
                            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                            <span className="text-xs text-gray-500 font-medium animate-pulse">Running SQL queries & generating analytics...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200 focus-within:border-indigo-400 focus-within:bg-white transition-all duration-300">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g. 'Generate report of students with attendance < 75% in CSE-C'..."
                        className="flex-1 px-4 py-2 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400 font-inter"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 transition-all shadow-lg shadow-indigo-100"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                    {[
                        "Attendance < 75% in IT-A",
                        "Top 10 students by CGPA",
                        "Mid-1 performance analysis",
                        "Backlogs > 2 in Section D"
                    ].map(q => (
                        <button 
                            key={q} 
                            onClick={() => setInput(`Generate report for: ${q}`)}
                            className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors font-bold border border-indigo-100"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
