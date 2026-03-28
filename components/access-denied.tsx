import { ShieldAlert, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export function AccessDenied() {
    const router = useRouter()
    const { user } = useAuth()

    const getLandingPage = () => {
        if (!user) return "/dashboard"
        switch (user.role) {
            case "faculty": return "/classwork"
            case "student":
            case "placement_officer": return "/placements"
            case "admin": return "/admin"
            default: return "/dashboard"
        }
    }

    const landingPage = getLandingPage()

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <ShieldAlert className="w-10 h-10 text-rose-600 dark:text-rose-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Access Denied
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
                You do not have the required permissions to view this page. If you believe this is an error, please contact your administrator.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                    variant="outline" 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 border-slate-200 dark:border-slate-800"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                </Button>
                
                <Button 
                    onClick={() => router.push(landingPage)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    <Home className="w-4 h-4" />
                    Return to Home
                </Button>
            </div>
        </div>
    )
}
