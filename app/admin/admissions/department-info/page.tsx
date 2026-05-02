"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, ArrowLeft, GraduationCap, Loader2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getDepartments, createOrUpdateDepartment, deleteDepartment } from "@/lib/api"

interface Department {
  id: string
  name: string
  code: string
  intake: string
  hod: string
  description: string
}

export default function DepartmentInfoPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentDept, setCurrentDept] = useState<Partial<Department>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchDepartments = async () => {
    setIsLoading(true)
    try {
      const data = await getDepartments()
      setDepartments(data)
    } catch (error) {
      console.error("Failed to fetch departments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleSave = async () => {
    if (!currentDept.name || !currentDept.code) {
      alert("Name and Code are required.")
      return
    }

    try {
      await createOrUpdateDepartment(currentDept, isEditing ? currentDept.id : undefined)
      setIsDialogOpen(false)
      fetchDepartments()
    } catch (error) {
      console.error("Failed to save department:", error)
      alert("Error saving department.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return
    try {
      await deleteDepartment(id)
      fetchDepartments()
    } catch (error) {
      console.error("Failed to delete department:", error)
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
          <h1 className="text-3xl font-bold flex items-center gap-3 text-blue-900">
             Department Information
          </h1>
          <p className="text-muted-foreground">Manage academic departments, intake capacities, and leadership details.</p>
        </div>
      </div>

      <Card className="border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Departments List</CardTitle>
            <CardDescription>Comprehensive list of college departments and stats.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditing(false); setCurrentDept({}); }} className="bg-blue-600 hover:bg-blue-700 flex gap-2">
                <Plus className="w-4 h-4" /> Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
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
                    value={currentDept.intake || ""} 
                    onChange={(e) => setCurrentDept({...currentDept, intake: e.target.value})}
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
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save Department</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Intake</TableHead>
                    <TableHead>HOD</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-bold">{dept.code}</TableCell>
                      <TableCell>{dept.name}</TableCell>
                      <TableCell>{dept.intake}</TableCell>
                      <TableCell className="italic text-gray-600">{dept.hod}</TableCell>
                      <TableCell className="text-right space-x-2 pr-6">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => { setIsEditing(true); setCurrentDept(dept); setIsDialogOpen(true); }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
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
                  {departments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">No departments found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
