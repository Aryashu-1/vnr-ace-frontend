"use client"

import { useAuth } from "@/components/auth-provider"
import { Loader2, User, Mail, Phone, Calendar, Building, Hash, BookOpen } from "lucide-react"
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account and personal information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30">
              {user.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-blue-100 capitalize">{user.role}</p>
              {user.studentId && (
                <p className="text-blue-50 text-sm mt-1 flex items-center gap-1.5 opacity-90">
                  <Hash className="w-4 h-4" /> ID: {user.studentId}
                </p>
              )}
              {user.designation && (
                <p className="text-blue-50 text-sm mt-1 flex items-center gap-1.5 opacity-90">
                  <BriefcaseIcon className="w-4 h-4" /> {user.designation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
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
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Academic Details</h3>
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

        {/* Actions */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={logout}
            className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium shadow-sm"
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
