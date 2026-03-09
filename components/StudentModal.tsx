"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

interface Student {
    id: string
    name: string
    rollNumber: string
    branch: string
    cgpa: number
    placed: boolean
    company?: string
    salary?: number
    minor_degree?: string
    skills?: string[]
}

interface StudentModalProps {
    student: Student | null
    isOpen: boolean
    onClose: () => void
}

export function StudentModal({ student, isOpen, onClose }: StudentModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AnimatePresence>
                {isOpen && student && (
                    <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold dark:text-white">
                                    {student.name}
                                </DialogTitle>
                                <DialogDescription className="text-slate-500 dark:text-slate-400">
                                    {student.rollNumber} • {student.branch}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">CGPA</p>
                                        <p className="text-xl font-bold dark:text-white">{student.cgpa.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                                        <div className="mt-1">
                                            {student.placed ? (
                                                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Placed</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-slate-500 border-slate-300 dark:border-slate-600">Unplaced</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {student.placed && (
                                    <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                                        <h4 className="font-semibold dark:text-slate-200">Placement Details</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-slate-500 dark:text-slate-400">Company:</div>
                                            <div className="font-medium dark:text-white">{student.company || "N/A"}</div>
                                            <div className="text-slate-500 dark:text-slate-400">Package:</div>
                                            <div className="font-medium text-emerald-600 dark:text-emerald-400">
                                                {student.salary ? `₹${student.salary} LPA` : "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {student.minor_degree && (
                                    <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                                        <h4 className="font-semibold dark:text-slate-200">Minor Degree</h4>
                                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                            {student.minor_degree}
                                        </Badge>
                                    </div>
                                )}

                                {student.skills && student.skills.length > 0 && (
                                    <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                                        <h4 className="font-semibold dark:text-slate-200">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {student.skills.map(skill => (
                                                <Badge key={skill} variant="outline" className="border-cyan-200 dark:border-cyan-900/50 text-cyan-700 dark:text-cyan-400">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </DialogContent>
                )}
            </AnimatePresence>
        </Dialog>
    )
}
