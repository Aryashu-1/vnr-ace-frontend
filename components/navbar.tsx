"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { LogOut, User, Settings } from "lucide-react"
import type { User as UserType } from "@/lib/auth"

interface NavbarProps {
  user: UserType
}

export function Navbar({ user }: NavbarProps) {
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (user.role === "guest") {
    return (
      <div className="fixed top-0 left-64 right-0 h-16 bg-white/80 backdrop-blur border-b border-gray-200 flex items-center justify-end px-6 z-40 transition-smooth">
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
        >
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white/80 backdrop-blur border-b border-gray-200 flex items-center justify-end px-6 z-40 transition-smooth">
      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {user.avatar}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>

            <button
              onClick={() => {
                setIsOpen(false)
                logout()
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
