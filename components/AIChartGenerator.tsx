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

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setError(null)

        try {
            const response = await queryAiVisualization(query)
            setChartData(response.chart)
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
                            className="text-sm text-rose-500"
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
                                dataKey={chartData.dataKey}
                                colors={['#6366F1']}
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
                            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-200">No chart generated</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-[250px]">
                                Type a query above to generate an insight instantly.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    )
}
