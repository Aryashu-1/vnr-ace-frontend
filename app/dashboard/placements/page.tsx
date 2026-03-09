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

import {
    getStats, getPlacementTrend, getBranchWise,
    getSalaryDistribution, getCompanyWise, getMinorDegree,
    getMultipleOffers, getExportStudentsUrl, getExportDashboardUrl
} from "@/lib/api"

export default function PlacementsDashboard() {
    const [stats, setStats] = useState<any>(null)
    const [charts, setCharts] = useState<any>({
        trend: null, branch: null, salary: null,
        company: null, minor: null, offers: null
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsData = await getStats().catch(() => ({
                    total: 850, placed: 680, percentage: 80, highest: 42, average: 12.5, unplaced: 170
                }))
                setStats(statsData)

                // Mock data fallback for charts
                const [trend, branch, salary, company, minor, offers] = await Promise.all([
                    getPlacementTrend().catch(() => [
                        { name: "2020", value: 65 }, { name: "2021", value: 72 },
                        { name: "2022", value: 85 }, { name: "2023", value: 88 }, { name: "2024", value: 92 }
                    ]),
                    getBranchWise().catch(() => [
                        { name: "CSE", value: 240 }, { name: "IT", value: 180 },
                        { name: "ECE", value: 160 }, { name: "EEE", value: 100 }
                    ]),
                    getSalaryDistribution().catch(() => [
                        { name: "< 5L", value: 45 }, { name: "5L-10L", value: 210 },
                        { name: "10L-20L", value: 380 }, { name: "> 20L", value: 45 }
                    ]),
                    getCompanyWise().catch(() => [
                        { name: "TCS", value: 120 }, { name: "Infosys", value: 90 },
                        { name: "Amazon", value: 45 }, { name: "Microsoft", value: 12 }
                    ]),
                    getMinorDegree().catch(() => [
                        { name: "AI/ML", value: 150 }, { name: "Data Sci", value: 120 },
                        { name: "CyberSec", value: 80 }, { name: "IoT", value: 60 }
                    ]),
                    getMultipleOffers().catch(() => [
                        { name: "1 Offer", value: 420 }, { name: "2 Offers", value: 180 },
                        { name: "3+ Offers", value: 80 }
                    ])
                ])

                setCharts({ trend, branch, salary, company, minor, offers })
            } catch (error) {
                console.error("Error fetching dashboard data", error)
            }
        }

        fetchData()
    }, [])

    const handleExport = (type: string) => {
        const url = type === 'csv' || type === 'excel' ? getExportStudentsUrl() : getExportDashboardUrl()
        window.open(`${url}?format=${type}`, '_blank')
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 pb-12">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                        Placement Overview
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Real-time insights and predictions for the current placement season.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <Download className="w-4 h-4" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2 cursor-pointer">
                                <FileText className="w-4 h-4 text-slate-500" /> Export CSV (Students)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport('excel')} className="gap-2 cursor-pointer">
                                <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Export Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2 cursor-pointer">
                                <Download className="w-4 h-4 text-rose-500" /> Export PDF Dashboard
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="p-6 max-w-7xl mx-auto space-y-8 mt-4">

                {/* KPI Cards */}
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <KpiCard title="Total Eligible Students" value={stats.total} icon={<Users className="w-6 h-6" />} delay={0.1} />
                        <KpiCard title="Placed Students" value={stats.placed} icon={<UserCheck className="w-6 h-6" />} trend={5.2} delay={0.2} />
                        <KpiCard title="Placement %" value={`${stats.percentage}%`} icon={<Percent className="w-6 h-6" />} trend={2.1} delay={0.3} />
                        <KpiCard title="Highest Salary" value={`₹${stats.highest} LPA`} icon={<TrendingUp className="w-6 h-6" />} trend={15} delay={0.4} />
                        <KpiCard title="Average Salary" value={`₹${stats.average} LPA`} icon={<IndianRupee className="w-6 h-6" />} trend={8.5} delay={0.5} />
                        <KpiCard title="Unplaced Students" value={stats.unplaced} icon={<UsersRound className="w-6 h-6" />} trend={-12} delay={0.6} />
                    </div>
                )}

                {/* AI & Prediction Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AIChartGenerator />
                    <PredictionPanel />
                </div>

                {/* Charts Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" /> Analytics
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PlacementChart title="Placement Trend Over Years" type="line" data={charts.trend || []} delay={0.1} />
                        <PlacementChart title="Branch-wise Placements" type="bar" data={charts.branch || []} colors={['#3b82f6']} delay={0.2} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PlacementChart title="Salary Distribution (LPA)" type="bar" data={charts.salary || []} colors={['#10b981']} delay={0.3} />
                        <PlacementChart title="Top Hiring Companies" type="pie" data={charts.company || []} delay={0.4} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PlacementChart title="Minor Degree Impact" type="pie" data={charts.minor || []} delay={0.5} />
                        <PlacementChart title="Multiple Offers Breakdown" type="bar" data={charts.offers || []} colors={['#f59e0b']} delay={0.6} />
                    </div>
                </div>

                {/* Student Table */}
                <div className="space-y-6 pt-4">
                    <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" /> Student Directory
                    </h2>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                        <StudentTable />
                    </motion.div>
                </div>

            </div>
        </div>
    )
}
