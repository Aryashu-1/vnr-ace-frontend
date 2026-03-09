"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ReactNode } from "react"

interface KpiCardProps {
    title: string
    value: string | number
    icon: ReactNode
    description?: string
    trend?: number
    delay?: number
}

export function KpiCard({ title, value, icon, description, trend, delay = 0 }: KpiCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ scale: 1.02 }}
            className="cursor-default"
        >
            <Card className="h-full overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-colors hover:shadow-md">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                            <div className="flex items-baseline space-x-2">
                                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {value}
                                </h3>
                            </div>
                            {description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
                            )}
                            {trend !== undefined && (
                                <div className={`flex items-center text-sm font-medium mt-1 ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {trend >= 0 ? '+' : ''}{trend}%
                                    <span className="text-slate-500 dark:text-slate-400 font-normal ml-1">vs last year</span>
                                </div>
                            )}
                        </div>
                        <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3 bg-opacity-80">
                            <div className="text-blue-600 dark:text-cyan-400">
                                {icon}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
