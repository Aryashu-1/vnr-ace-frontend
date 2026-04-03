"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, ArrowLeft, Search, Building, MessageSquare, History } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InterviewExperience {
  id: string
  studentName: string
  company: string
  role: string
  difficulty: "Easy" | "Medium" | "Hard"
  date: string
}

export default function InterviewExperiencesPage() {
  const [experiences, setExperiences] = useState<InterviewExperience[]>([
    { id: "1", studentName: "Rohan Das", company: "Amazon", role: "SDE Intern", difficulty: "Hard", date: "2024-03-22" },
    { id: "2", studentName: "Sanya Mishra", company: "JPMC", role: "Software Analyst", difficulty: "Medium", date: "2024-03-15" },
    { id: "3", studentName: "Aditya Jain", company: "TCS", role: "Ninja Developer", difficulty: "Easy", date: "2024-03-10" },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const filtered = experiences.filter(e => 
    e.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
             Interview Experiences
          </h1>
          <p className="text-muted-foreground">Manage and curate interview questions and reports from past recruitment drives.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Company or Student..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Experience
        </Button>
      </div>

      <Card className="border-emerald-100 shadow-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-emerald-50/50">
              <TableRow>
                <TableHead className="font-bold py-4">Student Name</TableHead>
                <TableHead className="font-bold py-4">Company</TableHead>
                <TableHead className="font-bold py-4">Position</TableHead>
                <TableHead className="font-bold py-4 text-center">Difficulty</TableHead>
                <TableHead className="font-bold py-4 text-center">Date</TableHead>
                <TableHead className="font-bold py-4 text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((exp) => (
                <TableRow key={exp.id} className="group hover:bg-emerald-50/30 transition-all duration-300">
                  <TableCell className="font-medium text-gray-900">{exp.studentName}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-100 rounded text-gray-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                      <Building className="w-3.5 h-3.5" />
                    </div>
                    {exp.company}
                  </TableCell>
                  <TableCell className="text-sm italic text-gray-600">{exp.role}</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      className={
                        exp.difficulty === "Easy" ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" :
                        exp.difficulty === "Medium" ? "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200" :
                        "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                      }
                      variant="outline"
                    >
                      {exp.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm font-mono text-gray-500">{exp.date}</TableCell>
                  <TableCell className="text-right space-x-1 px-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-medium">
        <div className="p-4 bg-white border rounded-xl flex items-center justify-between">
          <span className="text-gray-500 text-sm">Most Targeted</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-100">Amazon</span>
        </div>
        <div className="p-4 bg-white border rounded-xl flex items-center justify-between">
          <span className="text-gray-500 text-sm">Avg Difficulty</span>
          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs border border-amber-100">Medium</span>
        </div>
        <div className="p-4 bg-white border rounded-xl flex items-center justify-between">
          <span className="text-gray-500 text-sm">Last Update</span>
          <span className="text-gray-700 bg-gray-50 px-2 py-0.5 rounded text-xs border">Today</span>
        </div>
      </div>
    </div>
  )
}
