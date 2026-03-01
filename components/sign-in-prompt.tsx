"use client"

import Link from "next/link"
import { Lock } from "lucide-react"

export function SignInPrompt({ moduleName }: { moduleName: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                <Lock className="w-10 h-10 text-slate-400" />
            </div>
            <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold text-gray-900">Sign in to access {moduleName}</h2>
                <p className="text-gray-500">
                    This module is restricted to authorized users. Please sign in with your credentials to view this content.
                </p>
            </div>
            <Link
                href={`/login?redirect=/${moduleName.toLowerCase()}`}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
            >
                Sign In to Access
            </Link>
        </div>
    )
}
