"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, GraduationCap } from "lucide-react"
import { API_BASE_URL, getToken } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

export function ClassworkChatbot() {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content:
                "Hello! I'm the Academic Assistant. I can help you analyze student performance, attendance, and exam results. Try asking: 'Show me students with low attendance and high grades'.",
        },
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Backend-connected function
    const generateResponse = async (userInput: string): Promise<string> => {
        try {
            // Determine endpoint based on role
            const endpoint = user?.role === 'student' ? '/classwork/student/chat' : '/classwork/chat'
            const token = getToken()

            // Call Chat Endpoint
            const timestamp = new Date().getTime()
            const chatRes = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
                body: JSON.stringify({ message: userInput }),
                cache: "no-store", // Prevent Next.js from caching
            })

            if (!chatRes.ok) {
                const err = await chatRes.text()
                console.error("Chat error:", chatRes.status, err)
                return `Server error (${chatRes.status}): ${err || "Unable to respond. Please check if the backend is running."}`
            }

            const data = await chatRes.json()
            console.log("API Response:", data) // Debug log

            // Handle different response formats
            if (data.reply) {
                return data.reply
            } else if (data.response) {
                return data.response
            } else if (data.message) {
                return data.message
            } else if (typeof data === "string") {
                return data
            } else {
                console.warn("Unexpected response format:", data)
                return JSON.stringify(data, null, 2)
            }
        } catch (error) {
            console.error("Network error:", error)
            return `Could not reach backend at ${API_BASE_URL}. Error: ${error instanceof Error ? error.message : "Unknown error"}`
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        }

        setMessages((prev) => [...prev, userMessage])
        const userText = input
        setInput("")
        setIsLoading(true)

        // Wait for backend response
        const assistantReply = await generateResponse(userText)

        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: assistantReply,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-[600px] flex flex-col">
            {/* Header */}
            <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">Academic NLQ Assistant</h3>
                    <p className="text-sm text-gray-600">Query student data with natural language</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-[80%] px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${message.role === "user"
                                ? "bg-purple-600 text-white rounded-br-none"
                                : "bg-gray-100 text-gray-900 rounded-bl-none"
                                }`}
                        >
                            <p>{message.content}</p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-bl-none">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-gray-200 pt-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about students, attendance, grades..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-purple-500 transition-smooth"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-smooth"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    )
}
