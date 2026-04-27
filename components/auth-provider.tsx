"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User, UserRole } from "@/lib/auth"
import { mockUsers } from "@/lib/auth" // Import mockUsers for fallback details
import * as api from "@/lib/api"

interface AuthContextType {
    user: User | null
    login: (username: string, password?: string) => Promise<User | null>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for persisted user session
        const storedUser = localStorage.getItem("vnr_ace_user")
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                console.error("Failed to parse stored user", e)
                localStorage.removeItem("vnr_ace_user")
            }
        }
        setIsLoading(false)
    }, [])

    const login = async (username: string, password?: string): Promise<User | null> => {
        console.log("AuthProvider.login called for:", username)
        setIsLoading(true)

        try {
            // Call real Login API
            if (!password) {
                console.error("No password provided to AuthProvider.login")
                throw new Error("Password is required for login")
            }

            console.log("Calling api.login...")
            const data = await api.login(username, password)
            console.log("api.login response data:", data)

            if (data.access_token && data.user) {
                const apiUser = data.user

                // Map API user to our rich User type
                // In a real app, the API would return all this. 
                // For now, we'll try to find a matching mock user to get the extra details (avatar, dept, etc)
                // or just fall back to defaults.

                // Find extended details from mock data based on role or email prefix
                const mockUserKey = Object.keys(mockUsers).find(key =>
                    mockUsers[key].role === apiUser.role
                )
                const extendedDetails = mockUserKey ? mockUsers[mockUserKey] : ({} as Partial<User>)

                const authenticatedUser: User = {
                    ...extendedDetails, // Spread mock details first
                    ...apiUser, // Override with real API data (id, email, role)
                    name: apiUser.name || (apiUser.email.split('@')[0]), // Fallback if name missing
                    avatar: extendedDetails.avatar || apiUser.email[0].toUpperCase(),
                }

                setUser(authenticatedUser)
                api.setToken(data.access_token)
                localStorage.setItem("vnr_ace_user", JSON.stringify(authenticatedUser))
                setIsLoading(false)
                return authenticatedUser
            }
        } catch (error) {
            console.error("Login error:", error)
            setIsLoading(false)
            throw error // Re-throw to be handled by caller (e.g. LoginPage)
        }

        setIsLoading(false)
        return null
    }

    const logout = () => {
        setUser(null)
        api.removeToken()
        localStorage.removeItem("vnr_ace_user")
        router.push("/")
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
