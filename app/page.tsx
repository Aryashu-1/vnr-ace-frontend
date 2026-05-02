"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { StatCard } from "@/components/stat-card"
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar 
} from "recharts"
import { 
    ArrowRight, GraduationCap, Briefcase, 
    Zap, Shield, Search, Sparkles, Globe 
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const chartData = [
  { name: "Jan", value: 400, enrollment: 240 },
  { name: "Feb", value: 300, enrollment: 221 },
  { name: "Mar", value: 200, enrollment: 229 },
  { name: "Apr", value: 278, enrollment: 200 },
  { name: "May", value: 189, enrollment: 220 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const isGuest = !user || user.role === "guest"
  const [stats, setStats] = useState<any>(null)
  const [trendData, setTrendData] = useState<any[]>([])
  const [branchData, setBranchData] = useState<any[]>([])

  useEffect(() => {
    if (!isGuest) {
      import("@/lib/api").then(({ getDashboardStats, getPlacementTrend, getBranchWise }) => {
        getDashboardStats().then(setStats).catch(console.error)
        getPlacementTrend().then(res => setTrendData(res.data || [])).catch(console.error)
        getBranchWise().then(res => setBranchData(res.data || [])).catch(console.error)
      })
    }
  }, [isGuest])

  const getVal = (label: string, fallback: string) => {
    if (!stats?.stats) return fallback
    const item = stats.stats.find((s: any) => s.label.toLowerCase().includes(label.toLowerCase()))
    return item ? item.value : fallback
  }

  if (isGuest) {
    return (
      <div className="space-y-12 pb-12">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 px-8 py-20 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.2),transparent)]" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                        Welcome to VNR-ACE
                    </span>
                </motion.div>
                <motion.h1 
                    className="text-4xl md:text-6xl font-bold text-white tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    Advanced Campus <br /> 
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Ecosystem for Excellence</span>
                </motion.h1>
                <motion.p 
                    className="text-lg text-slate-400 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    An AI-powered platform designed to streamline admissions, 
                    accelerate placements, and provide deep academic insights 
                    for students and faculty.
                </motion.p>
                <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Link 
                        href="/login" 
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                        Get Started <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link 
                        href="/admissions" 
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                        View Admissions
                    </Link>
                </motion.div>
            </div>
        </div>

        {/* Portals Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
            <motion.div 
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:border-blue-200"
            >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <GraduationCap className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Admissions Portal</h3>
                <p className="text-gray-600 mb-6">
                    Explore available departments, fee structures, and chat with our 
                    AI Admission Bot for instant answers to your queries.
                </p>
                <Link href="/admissions" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:gap-3 transition-all">
                    Explore Admissions <ArrowRight className="h-4 w-4" />
                </Link>
            </motion.div>

            <motion.div 
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:border-indigo-200"
            >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Briefcase className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Placements Hub</h3>
                <p className="text-gray-600 mb-6">
                    Access latest job drives, placement analytics, and use our 
                    Interview Prep Agent to land your dream job.
                </p>
                <Link href="/placements" className="inline-flex items-center gap-2 font-bold text-indigo-600 hover:gap-3 transition-all">
                    Explore Placements <ArrowRight className="h-4 w-4" />
                </Link>
            </motion.div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { icon: Zap, label: "Real-time Analytics", color: "text-amber-500", bg: "bg-amber-50" },
                { icon: Sparkles, label: "AI Powered Agents", color: "text-purple-500", bg: "bg-purple-50" },
                { icon: Shield, label: "Secure Auth", color: "text-emerald-500", bg: "bg-emerald-50" },
                { icon: Globe, label: "Centralized Data", color: "text-cyan-500", bg: "bg-cyan-50" }
            ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <div className={`p-2.5 rounded-lg ${feature.bg} ${feature.color}`}>
                        <feature.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">{feature.label}</span>
                </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name || "User"}! Here's an overview of the campus ecosystem.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Eligible" value={getVal("Total Eligible Students", "0")} />
        <StatCard label="Placed Students" value={getVal("Placed Students", "0")} />
        <StatCard label="Placement %" value={getVal("Placement %", "0") + "%"} />
        <StatCard label="Average Salary" value={getVal("Average Salary", "0") + " LPA"} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Placement Trend (Offers)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#0E6FFF" strokeWidth={2} dot={{ fill: "#0E6FFF" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Branch-wise Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="value" fill="#39D0FF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
