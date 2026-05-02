"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Settings, Play, Pencil, Trash2, ArrowLeft, Loader2, Plus } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { getEmailTemplates, createOrUpdateEmailTemplate, deleteEmailTemplate } from "@/lib/api"

interface Template {
  id: string
  name: string
  subject: string
  body: string
  last_used_at?: string
}

export default function MailAgentManagementPage() {
  const [smtpStatus, setSmtpStatus] = useState("Connected")
  const [autoReply, setAutoReply] = useState(true)
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<Partial<Template>>({})

  const fetchTemplates = async () => {
    setIsLoading(true)
    try {
      const data = await getEmailTemplates()
      setTemplates(data)
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleSave = async () => {
    if (!currentTemplate.name || !currentTemplate.subject || !currentTemplate.body) {
      alert("Please fill in all fields.")
      return
    }

    try {
      await createOrUpdateEmailTemplate(currentTemplate, isEditing ? currentTemplate.id : undefined)
      setIsDialogOpen(false)
      fetchTemplates()
    } catch (error) {
      console.error("Failed to save template:", error)
      alert("Error saving template.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      await deleteEmailTemplate(id)
      fetchTemplates()
    } catch (error) {
      console.error("Failed to delete template:", error)
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
          <h1 className="text-3xl font-bold flex items-center gap-2 text-blue-900">
            <Mail className="w-8 h-8 text-blue-500" /> Mail Agent Configuration
          </h1>
          <p className="text-muted-foreground">Manage automated email communications, templates, and server settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-blue-50 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Configure predefined templates for automated agents.</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setIsEditing(false); setCurrentTemplate({}); }} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> Add Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Template" : "Create New Template"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Template Name</Label>
                      <Input id="name" value={currentTemplate.name || ""} onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})} placeholder="e.g. Attendance Alert" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="subject">Email Subject</Label>
                      <Input id="subject" value={currentTemplate.subject || ""} onChange={(e) => setCurrentTemplate({...currentTemplate, subject: e.target.value})} placeholder="e.g. Warning: Low Attendance" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="body">Email Body</Label>
                      <Textarea id="body" value={currentTemplate.body || ""} onChange={(e) => setCurrentTemplate({...currentTemplate, body: e.target.value})} rows={8} placeholder="Dear student, ..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save Template</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-blue-50/30">
                  <TableRow>
                    <TableHead className="w-[200px] pl-6 font-bold">Template Name</TableHead>
                    <TableHead className="font-bold">Email Subject</TableHead>
                    <TableHead className="text-center font-bold">Last Used</TableHead>
                    <TableHead className="text-right pr-6 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id} className="group hover:bg-blue-50/10">
                      <TableCell className="font-medium text-gray-900 pl-6">{template.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground italic">"{template.subject}"</TableCell>
                      <TableCell className="text-center text-xs whitespace-nowrap">
                        {template.last_used_at ? new Date(template.last_used_at).toLocaleDateString() : "Never"}
                      </TableCell>
                      <TableCell className="text-right space-x-1 pr-6">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => { setIsEditing(true); setCurrentTemplate(template); setIsDialogOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDelete(template.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {templates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">
                        No email templates found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-blue-50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-4 h-4" /> Agent Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-sm font-medium">SMTP Server</span>
                <Badge className={smtpStatus === "Connected" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"}>
                   {smtpStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-sm font-medium">Auto-Reply Mode</span>
                <Switch 
                  checked={autoReply} 
                  onCheckedChange={setAutoReply}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white shadow-lg shadow-blue-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Mail className="w-24 h-24" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Agent Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-semibold opacity-80 uppercase tracking-wider">Daily Limit</span>
                  <span className="text-2xl font-bold">421 / 1,000</span>
                </div>
                <div className="w-full h-2 bg-blue-400/30 rounded-full overflow-hidden backdrop-blur-sm">
                  <div className="h-full bg-white w-[42%] rounded-full shadow-sm"></div>
                </div>
                <div className="flex justify-between text-xs opacity-80 font-medium">
                  <span>Emails Sent Today</span>
                  <span>42.1% Used</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
