"use client"

import { FacultyEnquiryAgent } from "@/components/faculty-enquiry-agent"
import { useAuth } from "@/components/auth-provider"
import { SignInPrompt } from "@/components/sign-in-prompt"
import { Loader2 } from "lucide-react"
import { ClassworkChatbot } from "@/components/classwork-chatbot"
import { ClassworkExtraOptions } from "@/components/classwork-extra-options"

export default function ClassworkPage() {
  const { user, isLoading } = useAuth()

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

  const isStudent = user.role === "student"

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-inter">
          {isStudent ? "Faculty Enquiry" : "Classwork"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isStudent ? "Check faculty availability and schedules" : "Academic Analysis and Insights"}
        </p>
      </div>

      {isStudent ? (
        <FacultyEnquiryAgent />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ClassworkChatbot />
          </div>
          <div className="lg:col-span-1">
            <ClassworkExtraOptions role={user.role} />
          </div>
        </div>
      )}
    </div>
  )
}
