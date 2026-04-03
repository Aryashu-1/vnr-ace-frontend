"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail, Settings, Play, Pencil, Trash2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function MailAgentManagementPage() {
  const [smtpStatus, setSmtpStatus] = useState("Connected")
  const [autoReply, setAutoReply] = useState(true)

  const [templates, setTemplates] = useState([
    { id: "1", name: "Attendance Alert", subject: "Low Attendance Warning", lastUsed: "2 hours ago" },
    { id: "2", name: "Assignment Reminder", subject: "Pending Assignment: [Subject Name]", lastUsed: "1 day ago" },
    { id: "3", name: "Exam Schedule", subject: "Final Examination Timetable - [Year]", lastUsed: "Never" },
  ])

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
            <Mail className="w-8 h-8 text-blue-500" /> Mail Agent Configuration
          </h1>
          <p className="text-muted-foreground">Manage automated email communications, templates, and server settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Configure predefined templates for automated agents.</CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <Mail className="w-4 h-4" /> Create Template
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Template Name</TableHead>
                  <TableHead>Email Subject</TableHead>
                  <TableHead className="text-center">Last Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium text-gray-900">{template.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground italic">"{template.subject}"</TableCell>
                    <TableCell className="text-center text-xs whitespace-nowrap">{template.lastUsed}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="w-4 h-4 text-emerald-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
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

          <Card className="bg-blue-50/50 border-blue-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Mail className="w-16 h-16 text-blue-600" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-900">Agent Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-semibold text-blue-800/70 uppercase">Daily Limit</span>
                  <span className="text-lg font-bold text-blue-900">421 / 1,000</span>
                </div>
                <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-[42%] rounded-full shadow-sm shadow-blue-400"></div>
                </div>
                <div className="flex justify-between text-xs text-blue-800/60 font-medium">
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
