"use client"

import { FacultyEnquiryAgent } from "@/components/faculty-enquiry-agent"
import { ClassworkChatbot } from "@/components/classwork-chatbot"
import { EmailAgent } from "@/components/email-agent"
import { useAuth } from "@/components/auth-provider"
import { SignInPrompt } from "@/components/sign-in-prompt"
import { Loader2, MessageSquare, Search, Mail, FileBarChart2 } from "lucide-react"
import { useState } from "react"

export default function ClassworkPage() {
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'enquiry' | 'report' | 'mail'>('enquiry')

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!user || user.role === "guest") {
    return <SignInPrompt moduleName="Classwork" />
  }

  const isAdmin = user.role === "admin"

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-inter">
            Academic Assistant Center
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin 
              ? "Access all specialized academic intelligence agents." 
              : "Check faculty availability and schedules."}
          </p>
        </div>

        {isAdmin && (
          <div className="flex p-1 bg-gray-100 rounded-xl border border-gray-200 self-start">
            <button
              onClick={() => setActiveTab('enquiry')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'enquiry' 
                  ? "bg-white text-purple-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Search className="w-4 h-4" /> Faculty Enquiry
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'report' 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileBarChart2 className="w-4 h-4" /> Report Gen
            </button>
            <button
              onClick={() => setActiveTab('mail')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'mail' 
                  ? "bg-white text-emerald-600 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Mail className="w-4 h-4" /> Email Agent
            </button>
          </div>
        )}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {(!isAdmin || activeTab === 'enquiry') && <FacultyEnquiryAgent />}
        {isAdmin && activeTab === 'report' && <ClassworkChatbot />}
        {isAdmin && activeTab === 'mail' && <EmailAgent />}
      </div>
    </div>
  )
}
