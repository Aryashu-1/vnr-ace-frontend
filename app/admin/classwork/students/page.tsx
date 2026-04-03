"use client"

import { ChangeEvent, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Trash2, Pencil, Upload, ArrowLeft, FileSpreadsheet } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

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
  attendance: "",
}

export default function StudentDataPage() {
  const [students, setStudents] = useState<Student[]>([
    { id: "1", rollNo: "21071A0501", name: "Aarav Patel", section: "A", year: 3, attendance: "85%" },
    { id: "2", rollNo: "21071A0502", name: "Isha Sharma", section: "B", year: 3, attendance: "92%" },
    { id: "3", rollNo: "21071A0503", name: "Rohan Das", section: "A", year: 3, attendance: "78%" },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyStudentForm)
  const [message, setMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredStudents = useMemo(() => (
    students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm)
    )
  ), [searchTerm, students])

  const resetForm = () => {
    setForm(emptyStudentForm)
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleFieldChange = (field: keyof typeof emptyStudentForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddClick = () => {
    setMessage("Student records are still local-only on this screen, but you can now add entries and bulk import CSV or JSON files for review.")
    setEditingId(null)
    setForm(emptyStudentForm)
    setIsFormOpen(true)
  }

  const handleEdit = (student: Student) => {
    setMessage("Editing is available locally on this page. Backend persistence can be connected once the student admin API is ready.")
    setEditingId(student.id)
    setForm({
      rollNo: student.rollNo,
      name: student.name,
      section: student.section,
      year: String(student.year),
      attendance: student.attendance.replace("%", ""),
    })
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id))
    if (editingId === id) {
      resetForm()
    }
  }

  const handleSubmit = () => {
    if (!form.rollNo.trim() || !form.name.trim() || !form.section.trim() || !form.attendance.trim()) {
      setMessage("Roll number, name, section, and attendance are required.")
      return
    }

    const nextStudent: Student = {
      id: editingId ?? `${Date.now()}`,
      rollNo: form.rollNo.trim(),
      name: form.name.trim(),
      section: form.section.trim().toUpperCase(),
      year: Number(form.year) || 1,
      attendance: `${form.attendance.replace("%", "").trim()}%`,
    }

    setStudents((prev) => (
      editingId
        ? prev.map((student) => student.id === editingId ? nextStudent : student)
        : [nextStudent, ...prev]
    ))

    setMessage(editingId ? "Student entry updated locally." : "Student entry added locally.")
    resetForm()
  }

  const handleBulkImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const content = await file.text()
      const imported = file.name.toLowerCase().endsWith(".json")
        ? parseJsonStudents(content)
        : parseCsvStudents(content)

      if (!imported.length) {
        setMessage("No valid student rows were found in the selected file.")
        return
      }

      setStudents((prev) => [...imported, ...prev])
      setMessage(`Imported ${imported.length} student record${imported.length === 1 ? "" : "s"} locally from ${file.name}.`)
    } catch {
      setMessage("Bulk import expects CSV or JSON with rollNo, name, section, year, and attendance columns.")
    } finally {
      event.target.value = ""
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
          <h1 className="text-3xl font-bold">Student Records Management</h1>
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
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Roll No or Name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            className="hidden"
            onChange={handleBulkImport}
          />
          <Button variant="outline" className="flex-1 md:flex-none gap-2" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4" /> Bulk Import
          </Button>
          <Button className="flex-1 md:flex-none gap-2" onClick={handleAddClick}>
            <Plus className="w-4 h-4" /> Add Student
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>{editingId ? "Edit Student" : "Add Student"}</CardTitle>
            <CardDescription>
              This updates the local admin table immediately. Backend persistence can plug into the same form later.
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
                <Input id="attendance" value={form.attendance} onChange={(e) => handleFieldChange("attendance", e.target.value)} placeholder="85" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
                <Button onClick={handleSubmit}>{editingId ? "Save Changes" : "Add Student"}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-bold py-4">Roll Number</TableHead>
                <TableHead className="font-bold py-4">Student Name</TableHead>
                <TableHead className="font-bold py-4 text-center">Section</TableHead>
                <TableHead className="font-bold py-4 text-center">Year</TableHead>
                <TableHead className="font-bold py-4 text-right">Attendance</TableHead>
                <TableHead className="font-bold py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-mono font-medium">{student.rollNo}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="px-3 py-0.5">{student.section}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{student.year}</TableCell>
                    <TableCell className="text-right">
                      <span className={parseInt(student.attendance) < 80 ? "text-red-500 font-bold" : "text-green-600 font-medium"}>
                        {student.attendance}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(student)}>
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
                    No students found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-4 px-2">
        <p className="text-sm text-gray-500">Showing {filteredStudents.length} of {students.length} students</p>
        <div className="flex gap-2">
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 border rounded-md px-3 py-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            CSV/JSON import supported
          </div>
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
