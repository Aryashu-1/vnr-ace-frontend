"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sparkles, BarChart2, Loader2 } from "lucide-react"
import { queryAiVisualization } from "@/lib/api"
import { PlacementChart } from "./PlacementChart"

export function AIChartGenerator() {
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [chartData, setChartData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const CHART_CONFIGS: Record<string, { title: string, type: 'line' | 'bar' | 'pie', color: string, xAxisKey?: string, dataKey?: string, nameKey?: string }> = {
        "placement-trend": { title: "Placement Trend Over Years", type: "line", color: "#6366F1", xAxisKey: "year", dataKey: "count" },
        "branch-wise": { title: "Branch-wise Placements", type: "bar", color: "#3B82F6", xAxisKey: "branch", dataKey: "placed" },
        "salary-distribution": { title: "Salary Distribution (LPA)", type: "bar", color: "#10B981", xAxisKey: "bucket", dataKey: "count" },
        "company-wise": { title: "Top Hiring Companies", type: "pie", color: "#F59E0B", nameKey: "company", dataKey: "hires" },
        "minor-degree": { title: "Minor Degree Impact", type: "pie", color: "#EC4899" },
        "multiple-offers": { title: "Multiple Offers Breakdown", type: "bar", color: "#F59E0B" }
    }

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setError(null)
        setChartData(null)

        try {
            const response = await queryAiVisualization(query)
            
            if (response.chart && response.chart !== "unknown" && CHART_CONFIGS[response.chart]) {
                const config = CHART_CONFIGS[response.chart]
                
                // Handle complex object transformations if necessary (similar to dashboard)
                let data = response.data;
                if (response.chart === "minor-degree" && !Array.isArray(data)) {
                    data = [
                        { name: "With Minor", value: data.with_minor?.placed || 0 },
                        { name: "Without Minor", value: data.without_minor?.placed || 0 }
                    ];
                } else if (response.chart === "multiple-offers" && !Array.isArray(data)) {
                    data = [
                        { name: "Multiple Offers", value: data.students_with_multiple_offers || 0 }
                    ];
                }

                setChartData({
                    ...config,
                    data: data
                })
            } else {
                setError("I couldn't identify a specific chart for that query. Try asking about salary, branches, or placement trends.")
            }
        } catch (err) {
            setError("Failed to generate chart. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="col-span-1 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    AI Chart Generator
                </CardTitle>
                <CardDescription>
                    Ask questions in plain English to visualize placement data instantly.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleGenerate} className="flex gap-2">
                    <Input
                        placeholder="e.g. Show me average salary by branch..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 transition-all focus:ring-indigo-500"
                    />
                    <Button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md hover:shadow-indigo-500/25"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <BarChart2 className="h-4 w-4 mr-2" />
                                Generate
                            </>
                        )}
                    </Button>
                </form>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg border border-rose-100 dark:border-rose-900/30"
                        >
                            {error}
                        </motion.p>
                    )}

                    {chartData && !loading && (
                        <motion.div
                            key="chart-result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-6 border border-indigo-100 dark:border-indigo-900/30 rounded-xl overflow-hidden shadow-sm"
                        >
                            <PlacementChart
                                title={chartData.title}
                                type={chartData.type}
                                data={chartData.data}
                                colors={[chartData.color]}
                            />
                        </motion.div>
                    )}

                    {!chartData && !loading && !error && (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20"
                        >
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mb-3">
                                <Sparkles className="h-6 w-6 text-indigo-500" />
                            </div>
                            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-200">Ready to Visualize</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-[250px]">
                                Try "How many students got more than one offer?" or "Salary distribution by branch".
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    )
}
