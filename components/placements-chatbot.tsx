"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, LayoutDashboard, FileText, CheckCircle, TrendingUp, Zap, Building2, Code } from "lucide-react"
import { API_BASE_URL, sendLiveDashboard, sendResumeFeedback, sendShortlistingAgent, sendChartGenerator, AgentResponse } from "@/lib/api"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

type GraphType = "dashboard" | "resume" | "prep" | "shortlisting" | "tracking" | "notification"

interface PlacementsChatbotProps {
    initialMode?: GraphType | null
    context?: Record<string, any>
}

export function PlacementsChatbot({ initialMode = null, context = {} }: PlacementsChatbotProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [activeMode, setActiveMode] = useState<GraphType | "general">("general")
    const [memory, setMemory] = useState<any[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Initialize mode/welcome message
    useEffect(() => {
        if (initialMode) {
            setActiveMode(initialMode)
            setMessages([{
                id: "1", role: "assistant",
                content: `Welcome to the ${initialMode.toUpperCase()} Assistant. How can I help you today?`
            }])
        } else {
            setMessages([{
                id: "1", role: "assistant",
                content: "Hello! I'm the Placements Assistant. Select a tool or ask me anything."
            }])
        }
    }, [initialMode])

    // Watch for new context injection (e.g. starting company prep)
    useEffect(() => {
        if (context && context.type === "COMPANY_PREP") {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: "assistant",
                content: `Loaded **${context.company}** preparation context! I have reviewed the previous year questions and interview experiences. Shall we start with a mock interview question or do you want me to explain any specific PYQ?`
            }]);
            setActiveMode("prep");
        }
    }, [context]);



    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Backend connection
    const generateResponse = async (userInput: string): Promise<string> => {
        try {
            let response: AgentResponse;

            switch (activeMode) {
                case "resume":
                    response = await sendResumeFeedback({
                        message: userInput,
                        resume_text: context.resume_text || "", // From context if available
                        memory: memory
                    });
                    break;
                case "shortlisting":
                    response = await sendShortlistingAgent(userInput, context.jd_text || "");
                    break;
                case "dashboard":
                default:
                    // Default to Live Dashboard for general queries or dashboard mode
                    response = await sendLiveDashboard(userInput, memory);
                    break;
            }

            if (response.memory) {
                setMemory(response.memory);
            }

            return response.reply || "No reply received."
        } catch (error) {
            console.error("Error:", error)
            return "Sorry, I encountered a connection error."
        }
    }

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text,
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        const reply = await generateResponse(text)

        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: reply,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSendMessage(input)
    }

    const switchMode = (mode: GraphType) => {
        setActiveMode(mode)
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: "assistant",
            content: `Switched to ${mode.toUpperCase()} mode.`
        }])
    }

    // Quick Actions / Mode Switchers
    const quickActions: { label: string, icon: any, mode: GraphType }[] = [
        // { label: "Dashboard", icon: LayoutDashboard, mode: "dashboard" as GraphType },
        // { label: "Resume", icon: FileText, mode: "resume" as GraphType },
        // { label: "Prep", icon: Zap, mode: "prep" as GraphType },
        // { label: "Shortlisting", icon: CheckCircle, mode: "shortlisting" as GraphType },
        // { label: "Tracking", icon: TrendingUp, mode: "tracking" as GraphType },
    ]


    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full flex flex-col">
            {/* Header */}
            <div className="mb-4 text-center border-b pb-2">
                <h3 className="font-bold text-gray-900 text-lg">
                    {activeMode === "general" ? "Placements Assistant" : `${activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} Assistant`}
                </h3>
                <p className="text-xs text-green-600 font-medium bg-green-50 inline-block px-2 py-0.5 rounded-full">
                    ● Active
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-[85%] px-4 py-2 rounded-lg text-sm ${message.role === "user"
                                ? "bg-indigo-600 text-white rounded-br-none"
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
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Mode Switchers */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
                {quickActions.map((action) => (
                    <button
                        key={action.label}
                        onClick={() => switchMode(action.mode)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${activeMode === action.mode
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                            }`}
                    >
                        <action.icon size={12} />
                        {action.label}
                    </button>
                ))}
            </div>

            {/* Input */}
            <form onSubmit={handleFormSubmit} className="flex gap-2 border-t border-gray-200 pt-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask about ${activeMode}...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500 transition-all"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-all"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    )
}
