"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Search, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getFaqs, createOrUpdateFaq, deleteFaq } from "@/lib/api"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export default function ManageFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [currentFAQ, setCurrentFAQ] = useState<Partial<FAQ>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchFaqs = async () => {
    setIsLoading(true)
    try {
      const data = await getFaqs()
      setFaqs(data)
    } catch (error) {
      console.error("Failed to fetch FAQs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  const filteredFaqs = faqs.filter(f => 
    (f.question?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (f.category?.toLowerCase() || "").includes(search.toLowerCase())
  )

  const handleSave = async () => {
    if (!currentFAQ.question || !currentFAQ.answer || !currentFAQ.category) {
      alert("Please fill in all fields.")
      return
    }

    try {
      await createOrUpdateFaq(currentFAQ, isEditing ? currentFAQ.id : undefined)
      setIsDialogOpen(false)
      fetchFaqs()
    } catch (error) {
      console.error("Failed to save FAQ:", error)
      alert("Error saving FAQ.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return
    try {
      await deleteFaq(id)
      fetchFaqs()
    } catch (error) {
      console.error("Failed to delete FAQ:", error)
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
          <h1 className="text-3xl font-bold">Manage Admissions FAQs</h1>
          <p className="text-muted-foreground">Add, update, or remove frequently asked questions for applicants.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setIsEditing(false); setCurrentFAQ({}); }} className="flex gap-2">
                <Plus className="w-4 h-4" /> Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    value={currentFAQ.category || ""} 
                    onChange={(e) => setCurrentFAQ({...currentFAQ, category: e.target.value})}
                    placeholder="e.g. Fees, Eligibility"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="question">Question</Label>
                  <Input 
                    id="question" 
                    value={currentFAQ.question || ""} 
                    onChange={(e) => setCurrentFAQ({...currentFAQ, question: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea 
                    id="answer" 
                    value={currentFAQ.answer || ""} 
                    onChange={(e) => setCurrentFAQ({...currentFAQ, answer: e.target.value})}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>Save Changes</Button>
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
                    <TableHead className="w-[150px]">Category</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead className="hidden md:table-cell">Answer</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                      <TableRow key={faq.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {faq.category}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{faq.question}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-[300px] truncate text-muted-foreground italic">
                          {faq.answer}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => { setIsEditing(true); setCurrentFAQ(faq); setIsDialogOpen(true); }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(faq.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No results found.
                      </TableCell>
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
