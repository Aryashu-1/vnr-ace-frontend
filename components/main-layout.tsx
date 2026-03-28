"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { usePathname } from "next/navigation"
import { canAccessRoute, isKnownRoute } from "@/lib/auth"
import { AccessDenied } from "@/components/access-denied"

export function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isAuthorized, setIsAuthorized] = useState(true)
    const pathname = usePathname()

    useEffect(() => {
        if (isLoading) return
        
        // If route doesn't exist at all, let Next.js handle it (don't show Access Denied)
        if (!isKnownRoute(pathname)) {
            setIsAuthorized(true)
            return
        }

        const role = user?.role || "guest"
        setIsAuthorized(canAccessRoute(role, pathname))
    }, [user, pathname, isLoading])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <p className="text-gray-600">Loading...</p>
            </div>
        )
    }

     const currentUser = user || {
        id: "guest",
        name: "Guest User",
        email: "",
        role: "guest",
        avatar: "G",
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden relative">
            
            {/* Blurred Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <Sidebar 
                role={currentUser.role} 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />
            
            <div className="flex-1 flex flex-col w-full z-10 transition-all duration-300">
                <Navbar 
                    user={currentUser} 
                    isSidebarOpen={isSidebarOpen} 
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                />
                <main className="flex-1 overflow-auto pt-16 w-full">
                    <div className="p-6">
                        {isAuthorized ? children : <AccessDenied />}
                    </div>
                </main>
            </div>
        </div>
    )
}
