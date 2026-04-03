"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, ArrowLeft, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Department {
  id: string
  name: string
  code: string
  intake: number
  hod: string
  description: string
}

export default function DepartmentInfoPage() {
  const [departments, setDepartments] = useState<Department[]>([
    { id: "1", name: "Computer Science and Engineering", code: "CSE", intake: 240, hod: "Dr. C. Kiran Mai", description: "The department offers top-tier engineering education with a focus on AI and Data Science." },
    { id: "2", name: "Information Technology", code: "IT", intake: 180, hod: "Dr. G. Suresh Reddy", description: "Focused on software engineering and network security." },
  ])

  const [isEditing, setIsEditing] = useState(false)
  const [currentDept, setCurrentDept] = useState<Partial<Department>>({})

  const handleSave = () => {
    if (isEditing) {
      setDepartments(departments.map(d => d.id === currentDept.id ? (currentDept as Department) : d))
    } else {
      setDepartments([...departments, { ...currentDept, id: Math.random().toString(36).substr(2, 9) } as Department])
    }
    setIsEditing(false)
    setCurrentDept({})
  }

  const handleDelete = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id))
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
          <h1 className="text-3xl font-bold flex items-center gap-3">
             Department Information
          </h1>
          <p className="text-muted-foreground">Manage academic departments, intake capacities, and leadership details.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Departments List</CardTitle>
            <CardDescription>Comprehensive list of college departments and stats.</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditing(false); setCurrentDept({}); }} className="flex gap-2">
                <Plus className="w-4 h-4" /> Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Department" : "Add New Department"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input 
                    id="name" 
                    value={currentDept.name || ""} 
                    onChange={(e) => setCurrentDept({...currentDept, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="code">Code (e.g. CSE)</Label>
                  <Input 
                    id="code" 
                    value={currentDept.code || ""} 
                    onChange={(e) => setCurrentDept({...currentDept, code: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="intake">Annual Intake</Label>
                  <Input 
                    id="intake" 
                    type="number"
                    value={currentDept.intake || ""} 
                    onChange={(e) => setCurrentDept({...currentDept, intake: parseInt(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hod">Head of Department (HOD)</Label>
                  <Input 
                    id="hod" 
                    value={currentDept.hod || ""} 
                    onChange={(e) => setCurrentDept({...currentDept, hod: e.target.value})}
                  />
                </div>
                <div className="grid col-span-2 gap-2">
                  <Label htmlFor="description">Brief Description</Label>
                  <Textarea 
                    id="description" 
                    value={currentDept.description || ""} 
                    onChange={(e) => setCurrentDept({...currentDept, description: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>Save Department</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Intake</TableHead>
                  <TableHead>HOD</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-bold">{dept.code}</TableCell>
                    <TableCell>{dept.name}</TableCell>
                    <TableCell>{dept.intake}</TableCell>
                    <TableCell className="italic text-gray-600">{dept.hod}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => { setIsEditing(true); setCurrentDept(dept); }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        {/* Reuse the DialogContent logic if possible, or just re-render here */}
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => handleDelete(dept.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
