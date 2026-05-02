"use client"

import { ChangeEvent, useMemo, useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Trash2, Pencil, Upload, ArrowLeft, FileSpreadsheet, Loader2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { getAdminStudents, createOrUpdateStudent, deleteStudent } from "@/lib/api"

interface Student {
  id: string
  rollNo: string
  name: string
  section: string
  year: number
  attendance: string
}

const emptyStudentForm = {
  rollNo: "",
  name: "",
  section: "",
  year: "3",
  attendance: "75",
}

export default function StudentDataPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyStudentForm)
  const [message, setMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchStudents = async (search?: string) => {
    setIsLoading(true)
    try {
      const data = await getAdminStudents(search)
      setStudents(data)
    } catch (error) {
      console.error("Failed to fetch students:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleSearch = () => {
    fetchStudents(searchTerm)
  }

  const resetForm = () => {
    setForm(emptyStudentForm)
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleFieldChange = (field: keyof typeof emptyStudentForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddClick = () => {
    setMessage(null)
    setEditingId(null)
    setForm(emptyStudentForm)
    setIsFormOpen(true)
  }

  const handleEdit = (student: Student) => {
    setMessage(null)
    setEditingId(student.id)
    setForm({
      rollNo: student.rollNo,
      name: student.name,
      section: student.section || "",
      year: String(student.year || 1),
      attendance: student.attendance?.replace("%", "") || "0",
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return
    try {
      await deleteStudent(id)
      fetchStudents()
    } catch (error) {
      console.error("Failed to delete student:", error)
    }
  }

  const handleSubmit = async () => {
    if (!form.rollNo.trim() || !form.name.trim()) {
      alert("Roll number and name are required.")
      return
    }

    const payload = {
      roll_no: form.rollNo.trim(),
      full_name: form.name.trim(),
      section: form.section.trim().toUpperCase(),
      current_year: Number(form.year) || 1,
      attendance: parseFloat(form.attendance) || 0
    }

    try {
      await createOrUpdateStudent(payload, editingId || undefined)
      setMessage(editingId ? "Student entry updated." : "Student entry added.")
      resetForm()
      fetchStudents()
    } catch (error) {
      console.error("Failed to save student:", error)
      alert("Error saving student.")
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
          <h1 className="text-3xl font-bold text-blue-900">Student Records Management</h1>
          <p className="text-muted-foreground">Update and manage student information for classwork modules.</p>
        </div>
      </div>

      {message && (
        <Card className="border-blue-100 bg-blue-50/70">
          <CardContent className="px-4 py-3 text-sm text-blue-900">
            {message}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex w-full max-w-sm gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Roll No or Name..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} variant="secondary">Search</Button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none gap-2" onClick={handleAddClick}>
            <Plus className="w-4 h-4" /> Add Student
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>{editingId ? "Edit Student" : "Add Student"}</CardTitle>
            <CardDescription>
              Fill in the details to update student records in the database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input id="rollNo" value={form.rollNo} onChange={(e) => handleFieldChange("rollNo", e.target.value)} />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="name">Student Name</Label>
                <Input id="name" value={form.name} onChange={(e) => handleFieldChange("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input id="section" value={form.section} onChange={(e) => handleFieldChange("section", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" min="1" max="4" value={form.year} onChange={(e) => handleFieldChange("year", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div className="space-y-2">
                <Label htmlFor="attendance">Attendance %</Label>
                <Input id="attendance" type="number" value={form.attendance} onChange={(e) => handleFieldChange("attendance", e.target.value)} placeholder="85" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">{editingId ? "Save Changes" : "Add Student"}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-blue-50 shadow-lg">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-blue-50/50">
                <TableRow>
                  <TableHead className="font-bold py-4 pl-6">Roll Number</TableHead>
                  <TableHead className="font-bold py-4">Student Name</TableHead>
                  <TableHead className="font-bold py-4 text-center">Section</TableHead>
                  <TableHead className="font-bold py-4 text-center">Year</TableHead>
                  <TableHead className="font-bold py-4 text-right">Attendance</TableHead>
                  <TableHead className="font-bold py-4 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id} className="hover:bg-blue-50/10 transition-colors">
                      <TableCell className="font-mono font-medium pl-6">{student.rollNo}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="px-3 py-0.5 bg-blue-100 text-blue-800">{student.section}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{student.year}</TableCell>
                      <TableCell className="text-right">
                        <span className={parseFloat(student.attendance) < 80 ? "text-red-500 font-bold" : "text-green-600 font-medium"}>
                          {student.attendance}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-1 pr-6">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(student)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(student.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground italic">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-4 px-2">
        <p className="text-sm text-gray-500">Total Records: {students.length}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  )
}

function parseCsvStudents(content: string): Student[] {
  const [headerLine, ...rows] = content.split(/\r?\n/).filter(Boolean)
  if (!headerLine) return []

  const headers = headerLine.split(",").map((header) => header.trim().toLowerCase())
  return rows.map((row, index) => {
    const values = row.split(",").map((value) => value.trim())
    const record = Object.fromEntries(headers.map((header, headerIndex) => [header, values[headerIndex] || ""]))
    const attendance = record.attendance?.replace("%", "") || "0"

    return {
      id: `imported-${Date.now()}-${index}`,
      rollNo: record.rollno || record["roll no"] || "",
      name: record.name || "",
      section: (record.section || "").toUpperCase(),
      year: Number(record.year) || 1,
      attendance: `${attendance}%`,
    }
  }).filter((student) => student.rollNo && student.name)
}

function parseJsonStudents(content: string): Student[] {
  const parsed = JSON.parse(content)
  if (!Array.isArray(parsed)) return []

  return parsed.map((item, index) => {
    const attendanceValue = String(item.attendance ?? "0").replace("%", "")
    return {
      id: `imported-${Date.now()}-${index}`,
      rollNo: String(item.rollNo ?? item.roll_no ?? ""),
      name: String(item.name ?? ""),
      section: String(item.section ?? "").toUpperCase(),
      year: Number(item.year ?? 1),
      attendance: `${attendanceValue}%`,
    }
  }).filter((student) => student.rollNo && student.name)
}
