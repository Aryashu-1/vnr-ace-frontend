"use client"

import { useAuth } from "@/components/auth-provider"
import { Loader2, User, Mail, Phone, Calendar, Building, Hash, BookOpen, TrendingDown, Zap, Code, MessageSquare, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-2">
          <User className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Sign in to view profile</h2>
        <p className="text-gray-500 max-w-sm text-center">
          Please sign in with your credentials to manage your account and view your personal information.
        </p>
        <Link
          href="/login?redirect=/profile"
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
        >
          Sign In Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account and personal information</p>
      </div>

      <div className="space-y-6">
        {/* Profile Header - Flat Design No Border/Shadow on container strictly */}
        <div className="py-4">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold border-4 border-blue-200">
              {user.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 capitalize">{user.role}</p>
              {user.studentId && (
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
                  <Hash className="w-4 h-4" /> ID: {user.studentId}
                </p>
              )}
              {user.designation && (
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
                  <BriefcaseIcon className="w-4 h-4" /> {user.designation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-600">
                <Mail className="w-5 h-5 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Address</p>
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-start gap-3 text-gray-600">
                  <Phone className="w-5 h-5 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone Number</p>
                    <p className="text-sm">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Academic Details</h3>
            <div className="space-y-4">
              {user.department && (
                <div className="flex items-start gap-3 text-gray-600">
                  <Building className="w-5 h-5 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Department</p>
                    <p className="text-sm">{user.department}</p>
                  </div>
                </div>
              )}
              {user.year && (
                <div className="flex items-start gap-3 text-gray-600">
                  <BookOpen className="w-5 h-5 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Year & Section</p>
                    <p className="text-sm">{user.year} Year - Section {user.section}</p>
                  </div>
                </div>
              )}
              {user.joinDate && (
                <div className="flex items-start gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 mt-0.5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Joined</p>
                    <p className="text-sm">{new Date(user.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>



        {/* Placement Performance & Recommendations (Student Only) */}
        {user.role === 'student' && (
          <div className="pt-8 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              Placement Performance & Recommendations
            </h3>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">14</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Rejections</p>
                  <p className="text-2xl font-bold text-red-600">11</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Needs Attention
                  </span>
                </div>
              </div>

              {/* Training Recommendations if rejections > 10 */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-amber-800 font-bold">
                  <Zap className="w-5 h-5" />
                  <h4>Training Recommendations</h4>
                </div>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Based on your continuous rejections in technical rounds (11 rejections), our AI recommends focusing on the following areas to improve your success rate:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { topic: "Data Structures & Algorithms", detail: "Focus on Graph theory and DP", icon: Code },
                    { topic: "System Design", detail: "Review Scalability and Load Balancing", icon: Building },
                    { topic: "Mock Interviews", detail: "Schedule 2 mocks with faculty this week", icon: User },
                    { topic: "Soft Skills", detail: "Focus on articulating technical solutions", icon: MessageSquare }
                  ].map((rec, i) => (
                    <div key={i} className="bg-white p-3 rounded-lg border border-amber-200 flex items-start gap-3">
                      <div className="p-1.5 bg-amber-50 rounded text-amber-600">
                        <rec.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{rec.topic}</p>
                        <p className="text-xs text-gray-500">{rec.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <Link 
                    href="/placements/prep" 
                    className="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 underline decoration-amber-300 underline-offset-4"
                  >
                    Start Personalized Prep Agent
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-8 mt-8 border-t border-gray-200 flex justify-end">
          <button
            onClick={logout}
            className="px-6 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium shadow-sm transition-all duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}
