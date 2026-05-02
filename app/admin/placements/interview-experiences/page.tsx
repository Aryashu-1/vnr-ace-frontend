"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, ArrowLeft, Search, Building, MessageSquare, History, Loader2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getInterviewExperiences, createOrUpdateExperience, deleteExperience, fetchFromApi } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InterviewExperience {
  id: string
  student_name: string
  company: string
  role: string
  difficulty: string
  date: string
  content: string
  tips: string
  student_id?: string
  company_id?: string
}

export default function InterviewExperiencesPage() {
  const [experiences, setExperiences] = useState<InterviewExperience[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [currentExp, setCurrentExp] = useState<Partial<InterviewExperience>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [expsData, studentsData, companiesData] = await Promise.all([
        getInterviewExperiences(),
        fetchFromApi("/data/students"), // Assuming this exists or using a generic one
        fetchFromApi("/admin/placements/companies")
      ])
      setExperiences(expsData)
      setStudents(studentsData)
      setCompanies(companiesData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = experiences.filter(e => 
    (e.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (e.student_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  )

  const handleSave = async () => {
    if (!currentExp.company_id || !currentExp.role) {
      alert("Company and Role are required.")
      return
    }

    try {
      await createOrUpdateExperience(currentExp, isEditing ? currentExp.id : undefined)
      setIsDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error("Failed to save experience:", error)
      alert("Error saving experience.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return
    try {
      await deleteExperience(id)
      fetchData()
    } catch (error) {
      console.error("Failed to delete experience:", error)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-emerald-900">
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsEditing(false); setCurrentExp({ difficulty: "Medium" }); }} className="bg-emerald-600 hover:bg-emerald-700 gap-2 shrink-0">
              <Plus className="w-4 h-4" /> Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Experience" : "Add New Experience"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="grid gap-2">
                <Label>Student (Optional)</Label>
                <Select 
                  value={currentExp.student_id} 
                  onValueChange={(val) => setCurrentExp({...currentExp, student_id: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.full_name} ({s.roll_no})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Company</Label>
                <Select 
                  value={currentExp.company_id} 
                  onValueChange={(val) => setCurrentExp({...currentExp, company_id: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={currentExp.role || ""} onChange={(e) => setCurrentExp({...currentExp, role: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Difficulty</Label>
                <Select value={currentExp.difficulty} onValueChange={(val) => setCurrentExp({...currentExp, difficulty: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid col-span-2 gap-2">
                <Label htmlFor="content">Overall Experience</Label>
                <Textarea id="content" value={currentExp.content || ""} onChange={(e) => setCurrentExp({...currentExp, overall_experience: e.target.value})} rows={3} />
              </div>
              <div className="grid col-span-2 gap-2">
                <Label htmlFor="tips">Tips for Students</Label>
                <Textarea id="tips" value={currentExp.tips || ""} onChange={(e) => setCurrentExp({...currentExp, tips: e.target.value})} rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">Save Experience</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-emerald-100 shadow-md overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-emerald-50/50">
                <TableRow>
                  <TableHead className="font-bold py-4 pl-6">Student Name</TableHead>
                  <TableHead className="font-bold py-4">Company</TableHead>
                  <TableHead className="font-bold py-4">Position</TableHead>
                  <TableHead className="font-bold py-4 text-center">Difficulty</TableHead>
                  <TableHead className="font-bold py-4 text-center">Date</TableHead>
                  <TableHead className="font-bold py-4 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((exp) => (
                  <TableRow key={exp.id} className="group hover:bg-emerald-50/30 transition-all duration-300">
                    <TableCell className="font-medium text-gray-900 pl-6">{exp.student_name}</TableCell>
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
                    <TableCell className="text-right space-x-1 pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => { setCurrentExp(exp); setIsEditing(true); setIsDialogOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(exp.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">No experiences found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
