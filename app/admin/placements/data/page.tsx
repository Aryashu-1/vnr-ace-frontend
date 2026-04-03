"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, TrendingUp, Users, CheckCircle2, XCircle, Clock, Download, Filter } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface PlacementRecord {
  id: string
  studentName: string
  rollNo: string
  company: string
  package: string
  status: "Placed" | "Pending" | "Rejected"
  date: string
}

export default function PlacementDataPage() {
  const [records, setRecords] = useState<PlacementRecord[]>([
    { id: "1", studentName: "Aarav Patel", rollNo: "21071A0501", company: "Google", package: "32 LPA", status: "Placed", date: "2024-03-20" },
    { id: "2", studentName: "Isha Sharma", rollNo: "21071A0502", company: "Microsoft", package: "28 LPA", status: "Placed", date: "2024-03-18" },
    { id: "3", studentName: "Rohan Das", rollNo: "21071A0503", company: "Meta", package: "- ", status: "Rejected", date: "2024-03-15" },
    { id: "4", studentName: "Anya Roy", rollNo: "21071A0504", company: "Amazon", package: "- ", status: "Pending", date: "2024-03-22" },
  ])

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-emerald-900 border-emerald-100">
               Placement Data Analytics
            </h1>
            <p className="text-muted-foreground font-medium">Comprehensive view of student recruitment status and salary stats.</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50">
          <Download className="w-4 h-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "482", icon: <Users className="w-5 h-5 text-blue-600" />, color: "bg-blue-50 border-blue-100" },
          { label: "Total Placed", value: "312", icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-50 border-emerald-100" },
          { label: "Waitlisted", value: "85", icon: <Clock className="w-5 h-5 text-amber-600" />, color: "bg-amber-50 border-amber-100" },
          { label: "Placement %", value: "64.7%", icon: <TrendingUp className="w-5 h-5 text-purple-600" />, color: "bg-purple-50 border-purple-100" },
        ].map((stat, i) => (
          <Card key={i} className={`${stat.color} border shadow-sm`}>
            <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                {stat.label}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-emerald-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl font-bold">Student Placement Log</CardTitle>
            <CardDescription>Individual status tracking and salary details.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="gap-2 text-gray-600 border border-gray-200 bg-white">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-bold">Student</TableHead>
                <TableHead className="font-bold">Roll No</TableHead>
                <TableHead className="font-bold">Company</TableHead>
                <TableHead className="font-bold">Salary (CTC)</TableHead>
                <TableHead className="text-center font-bold">Status</TableHead>
                <TableHead className="text-right font-bold pr-6">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{record.studentName}</TableCell>
                  <TableCell className="font-mono text-xs">{record.rollNo}</TableCell>
                  <TableCell>{record.company}</TableCell>
                  <TableCell className={record.package !== "- " ? "font-bold text-emerald-700" : "text-gray-300"}>
                    {record.package}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      className={
                        record.status === "Placed" ? "bg-emerald-600 hover:bg-emerald-600" :
                        record.status === "Pending" ? "bg-amber-500 hover:bg-amber-500" :
                        "bg-red-500 hover:bg-red-500"
                      }
                      variant="default"
                    >
                      {record.status === "Placed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {record.status === "Pending" && <Clock className="w-3 h-3 mr-1" />}
                      {record.status === "Rejected" && <XCircle className="w-3 h-3 mr-1" />}
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-gray-500 text-sm font-medium pr-6">{record.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
