"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Settings2, Plus, Pencil, Trash2, ArrowLeft, Target, Cpu } from "lucide-react"
import Link from "next/link"

interface ResumeRule {
  id: string
  name: string
  category: "Keyword" | "Formatting" | "Achievement"
  weight: number
  description: string
}

export default function ResumeRulesPage() {
  const [rules, setRules] = useState<ResumeRule[]>([
    { id: "1", name: "Technical Skills Presence", category: "Keyword", weight: 80, description: "Checks for core technologies like Java, Python, React, etc." },
    { id: "2", name: "Project Detail Density", category: "Achievement", weight: 65, description: "Analyzes the depth of project descriptions and bullet points." },
    { id: "3", name: "Proper Section Headers", category: "Formatting", weight: 40, description: "Ensures standard headings like 'Experience', 'Education' are used." },
  ])

  const [globalScoreWeight, setGlobalScoreWeight] = useState([75])

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
             Resume Feedback Rules
          </h1>
          <p className="text-muted-foreground">Configure the logic and weighting for the AI Resume Shortlisting agent.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-emerald-50/50 border-emerald-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-emerald-800">AI Sensitivity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span>Match Threshold</span>
                  <span className="text-emerald-700 bg-white px-2 py-0.5 rounded shadow-sm border border-emerald-100">{globalScoreWeight}%</span>
                </div>
                <Slider 
                  value={globalScoreWeight} 
                  onValueChange={setGlobalScoreWeight} 
                  max={100} 
                  step={1} 
                  className="[&_[role=slider]]:bg-emerald-600 [&_[role=slider]]:border-emerald-700" 
                />
                <p className="text-[10px] text-muted-foreground italic">RESUMES SCORING BELOW THIS VALUE WILL BE FLAGGED AS 'UNFIT'.</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="p-4 bg-white rounded-xl border-2 border-dashed border-gray-200 text-center space-y-3">
            <Cpu className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-sm font-medium text-gray-500 line-clamp-2">Changes apply immediately to all active shortlisting processes.</p>
            <Button variant="outline" size="sm" className="w-full">Export Rules</Button>
          </div>
        </div>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Rule Definitions</CardTitle>
                <CardDescription>Individual scoring criteria and their relative impact.</CardDescription>
              </div>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                <Plus className="w-4 h-4" /> Add Rule
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Rule Name</TableHead>
                  <TableHead className="text-center">Category</TableHead>
                  <TableHead className="text-center">Impact Weight</TableHead>
                  <TableHead>Logic Summary</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id} className="group">
                    <TableCell className="font-bold text-gray-800">{rule.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="secondary"
                        className={
                          rule.category === "Keyword" ? "bg-blue-50 text-blue-700" :
                          rule.category === "Achievement" ? "bg-emerald-50 text-emerald-700" :
                          "bg-purple-50 text-purple-700"
                        }
                      >
                        {rule.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-mono text-xs font-bold text-gray-600">
                        {rule.weight}%
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                      {rule.description}
                    </TableCell>
                    <TableCell className="text-right space-x-1 whitespace-nowrap">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
