"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, ArrowLeft, CalendarDays, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimetableEntry {
  id: string
  day: string
  startTime: string
  endTime: string
  subject: string
  room: string
  faculty: string
  section: string
}

const emptyEntry = {
  day: "Monday",
  startTime: "",
  endTime: "",
  subject: "",
  room: "",
  faculty: "",
  section: "",
}

export default function TimetableManagementPage() {
  const [entries, setEntries] = useState<TimetableEntry[]>([
    { id: "1", day: "Monday", startTime: "09:00 AM", endTime: "10:00 AM", subject: "Discrete Mathematics", room: "B-201", faculty: "S. Rama Rao", section: "CSE-A" },
    { id: "2", day: "Monday", startTime: "10:00 AM", endTime: "11:00 AM", subject: "Operating Systems", room: "B-305", faculty: "P. Vinay Kumar", section: "CSE-A" },
    { id: "3", day: "Tuesday", startTime: "11:15 AM", endTime: "12:15 PM", subject: "Database Management", room: "D-102", faculty: "L. Swathi", section: "CSE-B" },
  ])
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState(emptyEntry)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const visibleEntries = entries.filter((entry) => entry.day === selectedDay)

  const resetEditor = () => {
    setForm(emptyEntry)
    setEditingId(null)
    setIsEditorOpen(false)
  }

  const handleFieldChange = (field: keyof typeof emptyEntry, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const openAddEditor = () => {
    setForm({ ...emptyEntry, day: selectedDay })
    setEditingId(null)
    setIsEditorOpen(true)
    setMessage("Timetable changes are editable locally on this admin screen. Backend save wiring can be added once the schedule API is available.")
  }

  const openEditEditor = (entry: TimetableEntry) => {
    setForm({
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
      subject: entry.subject,
      room: entry.room,
      faculty: entry.faculty,
      section: entry.section,
    })
    setEditingId(entry.id)
    setIsEditorOpen(true)
    setMessage("Editing is now enabled locally for timetable rows.")
  }

  const handleSave = () => {
    if (!form.subject.trim() || !form.faculty.trim() || !form.startTime.trim() || !form.endTime.trim()) {
      setMessage("Day, time, subject, and faculty are required to save a timetable row.")
      return
    }

    const nextEntry: TimetableEntry = {
      id: editingId ?? `${Date.now()}`,
      day: form.day,
      startTime: form.startTime.trim(),
      endTime: form.endTime.trim(),
      subject: form.subject.trim(),
      room: form.room.trim() || "TBD",
      faculty: form.faculty.trim(),
      section: form.section.trim().toUpperCase() || "TBD",
    }

    setEntries((prev) => (
      editingId
        ? prev.map((entry) => entry.id === editingId ? nextEntry : entry)
        : [...prev, nextEntry]
    ))

    setSelectedDay(nextEntry.day)
    setMessage(editingId ? "Timetable row updated locally." : "Timetable row added locally.")
    resetEditor()
  }

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
    if (editingId === id) {
      resetEditor()
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarDays className="w-8 h-8 text-purple-600" /> Timetable Management
          </h1>
          <p className="text-muted-foreground">Schedule classes, assign rooms, and manage faculty hours.</p>
        </div>
      </div>

      {message && (
        <Card className="border-purple-100 bg-purple-50/60">
          <CardContent className="px-4 py-3 text-sm text-purple-900">
            {message}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {days.map((day) => (
            <Button
              key={day}
              variant="ghost"
              className={selectedDay === day ? "bg-purple-100 text-purple-800 hover:bg-purple-100" : "hover:bg-purple-50 hover:text-purple-700"}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </Button>
          ))}
        </div>
        <Button className="gap-2 bg-purple-600 hover:bg-purple-700" onClick={openAddEditor}>
          <Plus className="w-4 h-4" /> Add Schedule
        </Button>
      </div>

      {isEditorOpen && (
        <Card className="border-purple-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>{editingId ? "Edit Schedule" : "Add Schedule"}</CardTitle>
            <CardDescription>Manage one timetable slot at a time and preview the result instantly in the table below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Input id="day" value={form.day} onChange={(e) => handleFieldChange("day", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" value={form.startTime} onChange={(e) => handleFieldChange("startTime", e.target.value)} placeholder="09:00 AM" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" value={form.endTime} onChange={(e) => handleFieldChange("endTime", e.target.value)} placeholder="10:00 AM" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input id="section" value={form.section} onChange={(e) => handleFieldChange("section", e.target.value)} placeholder="CSE-A" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={form.subject} onChange={(e) => handleFieldChange("subject", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty</Label>
                <Input id="faculty" value={form.faculty} onChange={(e) => handleFieldChange("faculty", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input id="room" value={form.room} onChange={(e) => handleFieldChange("room", e.target.value)} placeholder="B-201" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetEditor}>Cancel</Button>
              <Button onClick={handleSave}>{editingId ? "Save Changes" : "Add Schedule"}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Day</TableHead>
                <TableHead className="w-[200px]">Time Slot</TableHead>
                <TableHead>Subject & Faculty</TableHead>
                <TableHead className="text-center">Section</TableHead>
                <TableHead className="text-center">Room</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleEntries.map((entry) => (
                <TableRow key={entry.id} className="group">
                  <TableCell className="font-bold text-gray-700">{entry.day}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {entry.startTime} - {entry.endTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{entry.subject}</p>
                      <p className="text-xs text-muted-foreground italic">By {entry.faculty}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{entry.section}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-sm text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {entry.room}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => openEditEditor(entry)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(entry.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {visibleEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No schedule entries added for {selectedDay} yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-purple-50/50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Total Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-700">{entries.length}</p>
            <p className="text-xs text-purple-600/80 mt-1">Entries currently managed on this screen</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">Room Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-700">{Math.min(100, entries.length * 12)}%</p>
            <p className="text-xs text-emerald-600/80 mt-1">Estimated from visible schedule density</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Selected Day Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-700">{visibleEntries.length}</p>
            <p className="text-xs text-amber-600/80 mt-1">Quick view for {selectedDay}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
