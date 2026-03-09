"use client"

import { useState, useEffect } from "react"
import { getStudents } from "@/lib/api"
import { StudentModal } from "./StudentModal"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { motion } from "framer-motion"

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

export function StudentTable() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [branchFilter, setBranchFilter] = useState("all")
    const [placedFilter, setPlacedFilter] = useState("all")
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true)
            try {
                const params: Record<string, string> = {}
                if (search) params.search = search
                if (branchFilter !== "all") params.branch = branchFilter
                if (placedFilter !== "all") params.placed = placedFilter

                // Mock data fallback if API fails
                try {
                    const data = await getStudents(params)
                    setStudents(data)
                } catch (e) {
                    console.error("API error, using mock data", e)
                    setStudents([
                        { id: "1", name: "Alice Smith", rollNumber: "19XJ1A0401", branch: "ECE", cgpa: 8.9, placed: true, company: "Google", salary: 24, minor_degree: "AI/ML", skills: ["Python", "TensorFlow"] },
                        { id: "2", name: "Bob Jones", rollNumber: "19XJ1A0502", branch: "CSE", cgpa: 9.1, placed: true, company: "Microsoft", salary: 42, skills: ["C++", "React"] },
                        { id: "3", name: "Charlie Brown", rollNumber: "19XJ1A1203", branch: "IT", cgpa: 7.5, placed: false },
                    ])
                }
            } catch (error) {
                console.error("Error fetching students:", error)
            } finally {
                setLoading(false)
            }
        }

        // Simple debounce
        const timeout = setTimeout(fetchStudents, 300)
        return () => clearTimeout(timeout)
    }, [search, branchFilter, placedFilter])

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    <Select value={branchFilter} onValueChange={setBranchFilter}>
                        <SelectTrigger className="w-[130px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <SelectValue placeholder="Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Branches</SelectItem>
                            <SelectItem value="CSE">CSE</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="ECE">ECE</SelectItem>
                            <SelectItem value="EEE">EEE</SelectItem>
                            <SelectItem value="MECH">MECH</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={placedFilter} onValueChange={setPlacedFilter}>
                        <SelectTrigger className="w-[130px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="true">Placed</SelectItem>
                            <SelectItem value="false">Unplaced</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Student</th>
                                <th className="px-6 py-4 font-medium">Branch</th>
                                <th className="px-6 py-4 font-medium text-center">CGPA</th>
                                <th className="px-6 py-4 font-medium text-center">Status</th>
                                <th className="px-6 py-4 font-medium">Company</th>
                                <th className="px-6 py-4 font-medium text-right">Package</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex justify-center items-center space-x-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No students found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student, idx) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={student.id}
                                        onClick={() => setSelectedStudent(student)}
                                        className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-slate-100">{student.name}</div>
                                            <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">{student.rollNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {student.branch}
                                            {student.minor_degree && (
                                                <span className="block text-xs text-purple-600 dark:text-purple-400 mt-1">
                                                    + {student.minor_degree}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300 font-medium">
                                            {student.cgpa.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${student.placed
                                                    ? 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                                }`}>
                                                {student.placed ? 'Placed' : 'Unplaced'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {student.company || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {student.salary ? (
                                                <span className="font-medium text-slate-900 dark:text-slate-100">₹{student.salary}L</span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <StudentModal
                student={selectedStudent}
                isOpen={!!selectedStudent}
                onClose={() => setSelectedStudent(null)}
            />
        </div>
    )
}
