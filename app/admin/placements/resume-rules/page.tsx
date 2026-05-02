"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { FileText, Settings2, Plus, Pencil, Trash2, ArrowLeft, Target, Cpu, Loader2 } from "lucide-react"
import Link from "next/link"
import { getResumeRules, createOrUpdateResumeRule, deleteResumeRule, updateResumeSettings } from "@/lib/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ResumeRule {
  id: string
  name: string
  category: "Keyword" | "Formatting" | "Achievement"
  weight: number
  description: string
}

export default function ResumeRulesPage() {
  const [rules, setRules] = useState<ResumeRule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [globalScoreWeight, setGlobalScoreWeight] = useState([75])
  const [isEditing, setIsEditing] = useState(false)
  const [currentRule, setCurrentRule] = useState<Partial<ResumeRule>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchRules = async () => {
    setIsLoading(true)
    try {
      const data = await getResumeRules()
      setRules(data)
    } catch (error) {
      console.error("Failed to fetch rules:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRules()
  }, [])

  const handleSave = async () => {
    if (!currentRule.name || !currentRule.category) {
      alert("Name and Category are required.")
      return
    }

    try {
      await createOrUpdateResumeRule(currentRule, isEditing ? currentRule.id : undefined)
      setIsDialogOpen(false)
      fetchRules()
    } catch (error) {
      console.error("Failed to save rule:", error)
      alert("Error saving rule.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rule?")) return
    try {
      await deleteResumeRule(id)
      fetchRules()
    } catch (error) {
      console.error("Failed to delete rule:", error)
    }
  }

  const handleThresholdChange = async (val: number[]) => {
    setGlobalScoreWeight(val)
    try {
      await updateResumeSettings(val[0])
    } catch (error) {
      console.error("Failed to update threshold:", error)
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
          <h1 className="text-3xl font-bold flex items-center gap-3 text-emerald-900">
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
                  onValueChange={handleThresholdChange} 
                  max={100} 
                  step={1} 
                  className="[&_[role=slider]]:bg-emerald-600 [&_[role=slider]]:border-emerald-700" 
                />
                <p className="text-[10px] text-muted-foreground italic">RESUMES SCORING BELOW THIS VALUE WILL BE FLAGGED AS 'UNFIT'.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-3 border-emerald-100 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Rule Definitions</CardTitle>
                <CardDescription>Individual scoring criteria and their relative impact.</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setIsEditing(false); setCurrentRule({ weight: 50, category: "Keyword" }); }} size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                    <Plus className="w-4 h-4" /> Add Rule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Rule" : "Add New Rule"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Rule Name</Label>
                      <Input 
                        id="name" 
                        value={currentRule.name || ""} 
                        onChange={(e) => setCurrentRule({...currentRule, name: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={currentRule.category} 
                        onValueChange={(val: any) => setCurrentRule({...currentRule, category: val})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Keyword">Keyword</SelectItem>
                          <SelectItem value="Formatting">Formatting</SelectItem>
                          <SelectItem value="Achievement">Achievement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="weight">Weight (0-100)</Label>
                      <Input 
                        id="weight" 
                        type="number"
                        value={currentRule.weight || 0} 
                        onChange={(e) => setCurrentRule({...currentRule, weight: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Logic Summary</Label>
                      <Textarea 
                        id="description" 
                        value={currentRule.description || ""} 
                        onChange={(e) => setCurrentRule({...currentRule, description: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">Save Rule</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border-t">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-emerald-50/30">
                    <TableRow>
                      <TableHead className="w-[180px] font-bold">Rule Name</TableHead>
                      <TableHead className="text-center font-bold">Category</TableHead>
                      <TableHead className="text-center font-bold">Impact Weight</TableHead>
                      <TableHead className="font-bold">Logic Summary</TableHead>
                      <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((rule) => (
                      <TableRow key={rule.id} className="group hover:bg-emerald-50/10">
                        <TableCell className="font-bold text-gray-800">{rule.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant="secondary"
                            className={
                              rule.category === "Keyword" ? "bg-blue-50 text-blue-700 border-blue-100" :
                              rule.category === "Achievement" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                              "bg-purple-50 text-purple-700 border-purple-100"
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
                        <TableCell className="text-right space-x-1 whitespace-nowrap pr-6">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                            onClick={() => { setIsEditing(true); setCurrentRule(rule); setIsDialogOpen(true); }}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(rule.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {rules.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">No rules configured.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
