"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, ArrowLeft, CalendarDays, Clock, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getTimetable, createOrUpdateTimetable, deleteTimetableEntry } from "@/lib/api"

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
  const [entries, setEntries] = useState<TimetableEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState(emptyEntry)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const fetchTimetable = async () => {
    setIsLoading(true)
    try {
      const data = await getTimetable(selectedDay)
      setEntries(data)
    } catch (error) {
      console.error("Failed to fetch timetable:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTimetable()
  }, [selectedDay])

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
    setMessage(null)
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
    setMessage(null)
  }

  const handleSave = async () => {
    if (!form.subject.trim() || !form.faculty.trim() || !form.startTime.trim() || !form.endTime.trim()) {
      alert("All fields are required.")
      return
    }

    const payload = {
      day: form.day,
      start_time: form.startTime.trim(),
      end_time: form.endTime.trim(),
      subject: form.subject.trim(),
      room: form.room.trim(),
      faculty: form.faculty.trim(),
      section: form.section.trim().toUpperCase(),
    }

    try {
      await createOrUpdateTimetable(payload, editingId || undefined)
      setMessage(editingId ? "Timetable entry updated." : "Timetable entry added.")
      resetEditor()
      fetchTimetable()
    } catch (error) {
      console.error("Failed to save timetable entry:", error)
      alert("Error saving entry.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      await deleteTimetableEntry(id)
      fetchTimetable()
    } catch (error) {
      console.error("Failed to delete entry:", error)
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
          <h1 className="text-3xl font-bold flex items-center gap-2 text-purple-900">
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
            <CardDescription>Manage class slots and update the central database.</CardDescription>
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
              <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-purple-50 shadow-md">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-purple-50/30">
                <TableRow>
                  <TableHead className="w-[100px] pl-6 font-bold">Day</TableHead>
                  <TableHead className="w-[200px] font-bold">Time Slot</TableHead>
                  <TableHead className="font-bold">Subject & Faculty</TableHead>
                  <TableHead className="text-center font-bold">Section</TableHead>
                  <TableHead className="text-center font-bold">Room</TableHead>
                  <TableHead className="text-right pr-6 font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} className="group hover:bg-purple-50/10">
                    <TableCell className="font-bold text-gray-700 pl-6">{entry.day}</TableCell>
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
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">{entry.section}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5 text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {entry.room}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1 pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => openEditEditor(entry)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {entries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground italic">
                      No schedule entries found for {selectedDay}.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-purple-50/50 border-purple-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 uppercase tracking-wider">Total Weekly Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-700">{entries.length}</p>
            <p className="text-xs text-purple-600/80 mt-1">Active entries in database</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800 uppercase tracking-wider">Day Specific Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-700">{entries.filter(e => e.day === selectedDay).length}</p>
            <p className="text-xs text-emerald-600/80 mt-1">Scheduled for {selectedDay}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 uppercase tracking-wider">Room Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-700">{new Set(entries.map(e => e.room)).size}</p>
            <p className="text-xs text-amber-600/80 mt-1">Unique rooms assigned</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
