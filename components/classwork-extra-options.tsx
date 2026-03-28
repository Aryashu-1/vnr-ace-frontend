"use client"

import React from "react"
import { FileText, Calendar, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export function ClassworkExtraOptions({ role }: { role?: string }) {
    const router = useRouter()
    const isStudent = role === "student"
    
    const allCards = [
        {
            title: "Report Generation",
            icon: <FileText className="w-5 h-5" />,
            description: "Generate academic and administrative reports",
            color: "bg-blue-50 text-blue-600",
            hoverColor: "hover:bg-blue-100",
            href: "/reports",
        },
        {
            title: "Faculty Timetable Enquiry",
            icon: <Calendar className="w-5 h-5" />,
            description: "Check faculty availability and schedules",
            color: "bg-purple-50 text-purple-600",
            hoverColor: "hover:bg-purple-100",
            href: "/timetable",
        },
        {
            title: "Mail Agent",
            icon: <Mail className="w-5 h-5" />,
            description: "Send and manage campus communications",
            color: "bg-emerald-50 text-emerald-600",
            hoverColor: "hover:bg-emerald-100",
            href: "/mail",
        },
    ]

    const cards = isStudent 
        ? allCards.filter(c => c.title === "Faculty Timetable Enquiry")
        : allCards

    return (
        <div className="flex flex-col gap-3">
            <AnimatePresence>
                <div className="flex flex-col gap-3">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                            onClick={() => router.push(card.href)}
                        >
                            <Card className={`w-full cursor-pointer overflow-hidden border-slate-200 shadow-sm ${card.hoverColor} transition-all duration-300`}>
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${card.color}`}>
                                        {card.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {card.title}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 mt-0.5">
                                            {card.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        </div>
    )
}
