"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Users, Briefcase, FileText, Settings, User, X } from "lucide-react"
import type { UserRole } from "@/lib/auth"

interface SidebarProps {
  role: UserRole
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ role, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = {
    student: [
      { label: "Admissions", href: "/admissions", icon: Users },
      { label: "Classwork", href: "/classwork", icon: BookOpen },
      { label: "Placements", href: "/placements", icon: Briefcase },
    ],
    faculty: [
      { label: "Admissions", href: "/admissions", icon: Users },
      { label: "Classwork", href: "/classwork", icon: BookOpen },
      { label: "Placements", href: "/placements", icon: Briefcase },
    ],
    admin: [
      { label: "Admissions", href: "/admissions", icon: Users },
      { label: "Classwork", href: "/classwork", icon: BookOpen },
      { label: "Placements", href: "/placements", icon: Briefcase },
      { label: "Reports", href: "/reports", icon: FileText },
      { label: "Admin Panel", href: "/admin", icon: Settings },
    ],
    guest: [
      { label: "Admissions", href: "/admissions", icon: Users },
      { label: "Placements", href: "/dashboard/placements", icon: Briefcase },
    ],
    placement_officer: [
      { label: "Admissions", href: "/admissions", icon: Users },
      { label: "Classwork", href: "/classwork", icon: BookOpen },
      { label: "Placements", href: "/placements", icon: Briefcase },
      { label: "Reports", href: "/reports", icon: FileText },
    ],
  }

  const items = menuItems[role as keyof typeof menuItems] || menuItems.guest || []

  return (
    <div className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r-2 border-cyan-400/30 flex flex-col p-6 text-white transition-transform duration-300 z-50 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Header & Logo */}
      <div className="mb-12 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Menu
        </h1>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-800 text-gray-400 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-300 hover:bg-slate-800 hover:text-cyan-400"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>


    </div>
  )
}
