"use client"

import { useRouter } from "next/navigation"
import { StatCard } from "@/components/stat-card"
import { Briefcase, TrendingUp, FileText, Building2, Zap, Code, Loader2, PieChart } from "lucide-react"
import { PlacementsChatbot } from "@/components/placements-chatbot"
import { useAuth } from "@/components/auth-provider"
import { SignInPrompt } from "@/components/sign-in-prompt"

export default function PlacementsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  const prepCards = [
    {
      id: 1,
      title: "Resume Analysis",
      description: "AI-powered resume review and optimization for better chances with recruiters",
      icon: FileText,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      button: "Analyze Resume",
      link: "/placements/resume",
    },
    {
      id: 2,
      title: "Company-Specific Prep",
      description: "Targeted preparation materials and interview questions from specific companies",
      icon: Building2,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      button: "Start Prep",
      link: "/placements/prep",
    },
    {
      id: 3,
      title: "Placement Tracking",
      description: "Track your applications, interviews, and offer status in real-time",
      icon: TrendingUp,
      color: "bg-green-100",
      iconColor: "text-green-600",
      button: "Track Applications",
      link: "/placements/dashboard", // Assuming tracking is part of main dashboard for now
    },
    {
      id: 4,
      title: "Shortlisting Info",
      description: "Check eligibility and shortlisting status for different drives",
      icon: Zap,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
      button: "Check Status",
      link: "/placements/shortlisting",
    },
    {
      id: 5,
      title: "Placement Analytics Dashboard",
      description: "View overall placement statistics, salary trends, and detailed insights",
      icon: PieChart,
      color: "bg-indigo-100",
      iconColor: "text-indigo-600",
      button: "View Dashboard",
      link: "/dashboard/placements",
    },
    {
      id: 6,
      title: "Application Portal",
      description: "View and apply to current job openings, track application status",
      icon: Briefcase,
      color: "bg-teal-100",
      iconColor: "text-teal-600",
      button: "Browse Jobs",
      link: "/placements/application-portal",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!user || user.role === "guest") {
    return <SignInPrompt moduleName="Placements" />
  }

  // Filter cards based on role
  const visibleCards = prepCards.filter(card => {
    // Student: Hide Shortlisting Info and Placement Analytics Dashboard
    if (user.role === 'student' && (card.title === "Shortlisting Info" || card.title === "Placement Analytics Dashboard")) {
      return false
    }

    // Faculty: Show ONLY Placement Tracking and Analytics
    if (user.role === 'faculty' && !(card.title === "Placement Tracking" || card.title === "Placement Analytics Dashboard")) {
      return false
    }

    // Placement Officer & Admin: Show All (No filtering needed)

    return true
  })

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Placements Hub</h1>
        <p className="text-gray-600 mt-1">Select a tool to get started</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Main Content Area - Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2 custom-scrollbar">





          <div className="mt-8">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {visibleCards.map((card) => {
                const Icon = card.icon
                return (
                  <div
                    key={card.id}
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(card.link)}
                  >
                    <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">{card.title}</h3>
                    <p className="text-gray-600 text-xs mb-4 leading-relaxed">{card.description}</p>
                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors font-medium text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(card.link);
                      }}
                    >
                      {card.button}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Chatbot Area - Right 1 Column */}

      </div>
    </div>
  )
}
