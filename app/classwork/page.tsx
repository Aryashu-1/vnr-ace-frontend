"use client"

import { ClassworkChatbot } from "@/components/classwork-chatbot"
import { useAuth } from "@/components/auth-provider"
import { SignInPrompt } from "@/components/sign-in-prompt"
import { Loader2 } from "lucide-react"

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Classwork</h1>
        <p className="text-gray-600 mt-1">Academic Analysis and Insights</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Classwork Chatbot */}
        <ClassworkChatbot />
      </div>
    </div>
  )
}
