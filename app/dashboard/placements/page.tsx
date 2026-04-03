"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Users, UserCheck, Percent, IndianRupee,
    TrendingUp, UsersRound, Download, FileSpreadsheet, FileText
} from "lucide-react"

import { KpiCard } from "@/components/KpiCard"
import { PlacementChart } from "@/components/PlacementChart"
import { StudentTable } from "@/components/StudentTable"
import { AIChartGenerator } from "@/components/AIChartGenerator"
import { PredictionPanel } from "@/components/PredictionPanel"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"

import {
    getDashboardStats, getPlacementTrend, getBranchWise,
    getSalaryDistribution, getTopHiring, getMinorImpact,
    getMultipleOffers, getExportStudentsUrl, getExportDashboardUrl
} from "@/lib/api"

type DashboardStatItem = { label?: string, value?: string | number, trend?: number }

function getStatValue(stats: any, labels: string[], fallback: string = "0") {
    if (!stats) return fallback

    for (const label of labels) {
        const directValue = stats[label]
        if (directValue !== undefined && directValue !== null && directValue !== "") {
            return directValue
        }
    }

    const statArray = Array.isArray(stats?.stats) ? stats.stats : Array.isArray(stats) ? stats : []
    for (const item of statArray as DashboardStatItem[]) {
        const normalizedLabel = item.label?.trim().toLowerCase()
        if (normalizedLabel && labels.some((label) => normalizedLabel === label.toLowerCase())) {
            return item.value ?? fallback
        }
    }

    return fallback
}

export default function PlacementsDashboard() {
    const { user } = useAuth()
    const isGuest = !user || user.role === "guest"
    const [stats, setStats] = useState<any>(null)
    const [charts, setCharts] = useState<any>({
        trend: null, branch: null, salary: null,
        company: null, minor: null, offers: null
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsData = await getDashboardStats().catch(() => ({
                    stats: [],
                    recent_placements: []
                }))
                setStats(statsData)

                const [trend, branch, salary, company, minor, offers] = await Promise.all([
                    getPlacementTrend(),
                    getBranchWise(),
                    getSalaryDistribution(),
                    getTopHiring(),
                    getMinorImpact(),
                    getMultipleOffers()
                ])

                setCharts({
                    trend: trend?.data || [],
                    branch: branch?.data || [],
                    salary: salary?.data || [],
                    company: company?.data || [],
                    minor: minor?.data || [],
                    offers: offers?.data || []
                })
            } catch (error) {
                console.error("Error fetching dashboard data", error)
            }
        }
        fetchData()
    }, [])

    const handleExport = (type: string) => {
        const url = type === "csv" || type === "excel" ? getExportStudentsUrl() : getExportDashboardUrl()
        window.open(`${url}?format=${type}`, "_blank")
    }

    const isStaff = user?.role === "admin" || user?.role === "placement_officer"

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 pb-12">
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                        Placement Overview
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Real-time insights and predictions for the current placement season.
                    </p>
                </div>

                {isStaff && (
                    <div className="flex items-center gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                    <Download className="w-4 h-4" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2 cursor-pointer">
                                    <FileText className="w-4 h-4 text-slate-500" /> Export CSV (Students)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport("excel")} className="gap-2 cursor-pointer">
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Export Excel
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2 cursor-pointer">
                                    <Download className="w-4 h-4 text-rose-500" /> Export PDF Dashboard
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>

            <div className="p-6 max-w-7xl mx-auto space-y-8 mt-4">
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <KpiCard title="Total Eligible Students" value={getStatValue(stats, ["total", "total eligible students", "eligible students"])} icon={<Users className="w-6 h-6" />} delay={0.1} />
                        <KpiCard title="Placed Students" value={getStatValue(stats, ["placed", "placed students"])} icon={<UserCheck className="w-6 h-6" />} trend={5.2} delay={0.2} />
                        <KpiCard title="Placement %" value={`${getStatValue(stats, ["percentage", "placement %", "placement percentage"])}%`} icon={<Percent className="w-6 h-6" />} trend={2.1} delay={0.3} />
                        <KpiCard title="Highest Salary" value={`Rs ${getStatValue(stats, ["highest", "highest salary"])} LPA`} icon={<TrendingUp className="w-6 h-6" />} trend={15} delay={0.4} />
                        <KpiCard title="Average Salary" value={`Rs ${getStatValue(stats, ["average", "average salary"])} LPA`} icon={<IndianRupee className="w-6 h-6" />} trend={8.5} delay={0.5} />
                        <KpiCard title="Unplaced Students" value={getStatValue(stats, ["unplaced", "unplaced students"])} icon={<UsersRound className="w-6 h-6" />} trend={-12} delay={0.6} />
                    </div>
                )}

                {!isGuest && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AIChartGenerator />
                        <PredictionPanel />
                    </div>
                )}

                <div className="space-y-6">
                    <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" /> Analytics
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PlacementChart title="Placement Trend" type="line" data={charts.trend} xAxisKey="name" dataKey="value" />
                        <PlacementChart title="Branch-wise Placements" type="bar" data={charts.branch} xAxisKey="name" dataKey="value" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PlacementChart title="Salary Distribution (LPA)" type="bar" data={charts.salary} xAxisKey="name" dataKey="value" />
                        <PlacementChart title="Top Hiring Companies" type="pie" data={charts.company} nameKey="name" dataKey="value" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PlacementChart title="Minor Degree Impact" type="pie" data={charts.minor} nameKey="name" dataKey="value" />
                        <PlacementChart title="Multiple Offers Breakdown" type="bar" data={charts.offers} xAxisKey="name" dataKey="value" />
                    </div>
                </div>

                {isStaff && (
                    <div className="space-y-6 pt-4">
                        <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-500" /> Student Directory
                        </h2>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                            <StudentTable />
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}
