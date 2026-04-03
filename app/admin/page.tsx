"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  UserPlus, 
  BookOpen, 
  Briefcase, 
  HelpCircle, 
  Building2, 
  Users2, 
  Calendar, 
  Mail, 
  Building, 
  FileText, 
  History, 
  BarChart3,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const sections = [
    {
      title: "Admissions",
      description: "Manage FAQs and department information for new applicants",
      icon: <UserPlus className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-100",
      actionClass: "bg-blue-100/70 text-blue-900 hover:bg-blue-200/80 hover:border-blue-200",
      actions: [
        { label: "Manage FAQs", icon: <HelpCircle className="w-4 h-4" />, href: "/admin/admissions/faqs" },
        { label: "Department Info", icon: <Building2 className="w-4 h-4" />, href: "/admin/admissions/department-info" },
      ]
    },
    {
      title: "Classwork",
      description: "Administer student data, schedules, and automated communications",
      icon: <BookOpen className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50 border-purple-100",
      actionClass: "bg-purple-100/70 text-purple-900 hover:bg-purple-200/80 hover:border-purple-200",
      actions: [
        { label: "Students Data", icon: <Users2 className="w-4 h-4" />, href: "/admin/classwork/students" },
        { label: "Timetable", icon: <Calendar className="w-4 h-4" />, href: "/admin/classwork/timetable" },
        { label: "Mail Agent", icon: <Mail className="w-4 h-4" />, href: "/admin/classwork/mail-agent" },
      ]
    },
    {
      title: "Placements",
      description: "Oversee company recruitment, resume feedback, and interview records",
      icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-100",
      actionClass: "bg-amber-100/70 text-amber-950 hover:bg-amber-200/80 hover:border-amber-200",
      actions: [
        { label: "Companies", icon: <Building className="w-4 h-4" />, href: "/admin/placements/companies" },
        { label: "Resume Rules", icon: <FileText className="w-4 h-4" />, href: "/admin/placements/resume-rules" },
        { label: "Experiences", icon: <History className="w-4 h-4" />, href: "/admin/placements/interview-experiences" },
        { label: "Placement Data", icon: <BarChart3 className="w-4 h-4" />, href: "/admin/placements/data" },
      ]
    }
  ]

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 lg:text-5xl"> Admin Control Center</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Centralized management for campus operations. Select a module below to manage its data and configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className={`overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${section.color}`}>
            <CardHeader className="pb-4">
              <div className="mb-2 p-3 bg-white w-fit rounded-2xl shadow-sm border border-inherit">
                {section.icon}
              </div>
              <CardTitle className="text-2xl font-bold">{section.title}</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {section.actions.map((action) => (
                  <Button 
                    key={action.label} 
                    variant="ghost" 
                    asChild 
                    className={`group w-full justify-between border transition-all ${section.actionClass}`}
                  >
                    <Link href={action.href}>
                      <span className="flex items-center gap-3">
                        <span className="p-1.5 rounded-md bg-white/80 shadow-sm border border-white/60">
                          {action.icon}
                        </span>
                        {action.label}
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats or Recent Activity could go here if needed, but the user asked to replace current ones. */}
    </div>
  )
}
