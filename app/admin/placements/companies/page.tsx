"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, ArrowLeft, Building, Briefcase, IndianRupee, Loader2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAdminCompanies, getAdminJobs, createOrUpdateAdminJob, deleteAdminJob } from "@/lib/api"

interface Job {
  id: string
  company_id: string
  company_name: string
  role: string
  ctc: number
  deadline: string
  status: string
}

interface Company {
  id: string
  name: string
}

export default function CompaniesManagementPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentJob, setCurrentJob] = useState<Partial<Job>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [jobsData, companiesData] = await Promise.all([
        getAdminJobs(),
        getAdminCompanies()
      ])
      setJobs(jobsData)
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

  const handleSave = async () => {
    try {
      const payload = {
        company_id: currentJob.company_id,
        role: currentJob.role,
        ctc: Number(currentJob.ctc),
        status: currentJob.status || "open",
        requires_external_registration: false
      }
      
      await createOrUpdateAdminJob(payload, isEditing ? currentJob.id : undefined)
      setIsDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error("Failed to save job:", error)
      alert("Error saving job. Check if all fields are filled.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job drive?")) return
    try {
      await deleteAdminJob(id)
      fetchData()
    } catch (error) {
      console.error("Failed to delete job:", error)
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
          <h1 className="text-3xl font-bold flex items-center gap-3">
             Placement Drives
          </h1>
          <p className="text-muted-foreground">Manage recruiting companies, job roles, and application deadlines.</p>
        </div>
      </div>

      <Card className="border-emerald-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Register of Jobs</CardTitle>
            <CardDescription>Current recruitment drives and historical hiring partners.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditing(false); setCurrentJob({}); }} className="bg-emerald-600 hover:bg-emerald-700 flex gap-2">
                <Plus className="w-4 h-4" /> Add Drive
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Job Details" : "Add New Hiring Partner"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="grid gap-2 col-span-2">
                  <Label>Company</Label>
                  <Select 
                    value={currentJob.company_id} 
                    onValueChange={(val) => setCurrentJob({...currentJob, company_id: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Job Role</Label>
                  <Input 
                    id="role" 
                    value={currentJob.role || ""} 
                    onChange={(e) => setCurrentJob({...currentJob, role: e.target.value})}
                    placeholder="e.g. Frontend Intern"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ctc">Salary (CTC in LPA)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      id="ctc" 
                      type="number"
                      className="pl-8"
                      value={currentJob.ctc || ""} 
                      onChange={(e) => setCurrentJob({...currentJob, ctc: Number(e.target.value)})}
                      placeholder="e.g. 18"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select 
                    value={currentJob.status} 
                    onValueChange={(val) => setCurrentJob({...currentJob, status: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">Save Job</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Added On</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id} className="group">
                      <TableCell className="font-bold text-gray-900 flex items-center gap-2">
                        <div className="bg-gray-100 p-1.5 rounded text-gray-400">
                          <Building className="w-4 h-4" />
                        </div>
                        {job.company_name}
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium">
                        {job.role}
                      </TableCell>
                      <TableCell className="font-mono text-emerald-700 font-bold">{job.ctc} LPA</TableCell>
                      <TableCell className="text-sm font-medium text-gray-500">{job.deadline}</TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          className={
                            job.status === "open" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" :
                            job.status === "ongoing" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                            "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1 opacity-10 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => { setIsEditing(true); setCurrentJob(job); setIsDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(job.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-emerald-50/30 border-emerald-100 flex items-center p-4 gap-4">
          <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-900">{jobs.length}</p>
            <p className="text-xs text-emerald-700 font-medium uppercase tracking-wider">Total Drives</p>
          </div>
        </Card>
        <Card className="bg-blue-50/30 border-blue-100 flex items-center p-4 gap-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-900">{companies.length}</p>
            <p className="text-xs text-blue-700 font-medium uppercase tracking-wider">Total Partners</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
