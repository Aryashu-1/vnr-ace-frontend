"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, TrendingUp, Users, CheckCircle2, XCircle, Clock, Download, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getAdminApplications, getDashboardStats } from "@/lib/api"

interface PlacementRecord {
  id: string
  student_name: string
  roll_no: string
  company: string
  package: string
  status: string
  date: string
}

export default function PlacementDataPage() {
  const [records, setRecords] = useState<PlacementRecord[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [appsData, statsData] = await Promise.all([
          getAdminApplications(),
          getDashboardStats()
        ])
        setRecords(appsData)
        setStats(statsData)
      } catch (error) {
        console.error("Failed to fetch placement data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold flex items-center gap-3 text-emerald-900">
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
          { label: "Total Students", value: stats?.total_students || "0", icon: <Users className="w-5 h-5 text-blue-600" />, color: "bg-blue-50 border-blue-100" },
          { label: "Total Placed", value: stats?.total_placed || "0", icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-50 border-emerald-100" },
          { label: "High CTC (>10LPA)", value: stats?.high_ctc_count || "0", icon: <TrendingUp className="w-5 h-5 text-purple-600" />, color: "bg-purple-50 border-purple-100" },
          { label: "Placement %", value: stats?.placement_percentage ? `${stats.placement_percentage}%` : "0%", icon: <TrendingUp className="w-5 h-5 text-indigo-600" />, color: "bg-indigo-50 border-indigo-100" },
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
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-bold pl-6">Student</TableHead>
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
                  <TableCell className="font-medium text-gray-900 pl-6">{record.student_name}</TableCell>
                  <TableCell className="font-mono text-xs">{record.roll_no}</TableCell>
                  <TableCell>{record.company}</TableCell>
                  <TableCell className={record.package !== "- " ? "font-bold text-emerald-700" : "text-gray-300"}>
                    {record.package}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      className={
                        record.status === "placed" ? "bg-emerald-600 hover:bg-emerald-600" :
                        record.status === "applied" ? "bg-blue-500 hover:bg-blue-500" :
                        record.status === "shortlisted" ? "bg-purple-500 hover:bg-purple-500" :
                        "bg-red-500 hover:bg-red-500"
                      }
                      variant="default"
                    >
                      {record.status === "placed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {record.status === "applied" && <Clock className="w-3 h-3 mr-1" />}
                      {record.status === "shortlisted" && <TrendingUp className="w-3 h-3 mr-1" />}
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-gray-500 text-sm font-medium pr-6">{record.date}</TableCell>
                </TableRow>
              ))}
              {records.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">No placement records found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
