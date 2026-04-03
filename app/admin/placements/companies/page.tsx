"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, ArrowLeft, Building, Briefcase, IndianRupee } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Company {
  id: string
  name: string
  role: string
  ctc: string
  deadline: string
  status: "Open" | "Closed" | "Ongoing"
}

export default function CompaniesManagementPage() {
  const [companies, setCompanies] = useState<Company[]>([
    { id: "1", name: "Google", role: "Software Engineer", ctc: "32 LPA", deadline: "2024-05-15", status: "Open" },
    { id: "2", name: "Microsoft", role: "Product Manager", ctc: "28 LPA", deadline: "2024-05-10", status: "Ongoing" },
    { id: "3", name: "Amazon", role: "Cloud Architect", ctc: "25 LPA", deadline: "2024-04-30", status: "Closed" },
  ])

  const [isEditing, setIsEditing] = useState(false)
  const [currentCompany, setCurrentCompany] = useState<Partial<Company>>({})

  const handleSave = () => {
    if (isEditing) {
      setCompanies(companies.map(c => c.id === currentCompany.id ? (currentCompany as Company) : c))
    } else {
      setCompanies([...companies, { ...currentCompany, id: Math.random().toString(36).substr(2, 9), status: "Open" } as Company])
    }
    setIsEditing(false)
    setCurrentCompany({})
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
             Placement Companies
          </h1>
          <p className="text-muted-foreground">Manage recruiting companies, job roles, and application deadlines.</p>
        </div>
      </div>

      <Card className="border-emerald-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Register of Companies</CardTitle>
            <CardDescription>Current recruitment drives and historical hiring partners.</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditing(false); setCurrentCompany({}); }} className="bg-emerald-600 hover:bg-emerald-700 flex gap-2">
                <Plus className="w-4 h-4" /> Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Company Details" : "Add New Hiring Partner"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input 
                    id="name" 
                    value={currentCompany.name || ""} 
                    onChange={(e) => setCurrentCompany({...currentCompany, name: e.target.value})}
                    placeholder="e.g. NVIDIA"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Job Role</Label>
                  <Input 
                    id="role" 
                    value={currentCompany.role || ""} 
                    onChange={(e) => setCurrentCompany({...currentCompany, role: e.target.value})}
                    placeholder="e.g. Frontend Intern"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ctc">Salary Package (CTC)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      id="ctc" 
                      className="pl-8"
                      value={currentCompany.ctc || ""} 
                      onChange={(e) => setCurrentCompany({...currentCompany, ctc: e.target.value})}
                      placeholder="e.g. 18 LPA"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input 
                    id="deadline" 
                    type="date"
                    value={currentCompany.deadline || ""} 
                    onChange={(e) => setCurrentCompany({...currentCompany, deadline: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">Save Company</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id} className="group">
                    <TableCell className="font-bold text-gray-900 flex items-center gap-2">
                      <div className="bg-gray-100 p-1.5 rounded text-gray-400">
                        <Building className="w-4 h-4" />
                      </div>
                      {company.name}
                    </TableCell>
                    <TableCell className="text-gray-600 font-medium">
                      {company.role}
                    </TableCell>
                    <TableCell className="font-mono text-emerald-700 font-bold">{company.ctc}</TableCell>
                    <TableCell className="text-sm font-medium text-gray-500">{company.deadline}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={
                          company.status === "Open" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" :
                          company.status === "Ongoing" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                          "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {company.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1 opacity-10 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => { setIsEditing(true); setCurrentCompany(company); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-emerald-50/30 border-emerald-100 flex items-center p-4 gap-4">
          <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-900">{companies.length}</p>
            <p className="text-xs text-emerald-700 font-medium uppercase tracking-wider">Active Drives</p>
          </div>
        </Card>
        <Card className="bg-blue-50/30 border-blue-100 flex items-center p-4 gap-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-900">42</p>
            <p className="text-xs text-blue-700 font-medium uppercase tracking-wider">Total Partners</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
