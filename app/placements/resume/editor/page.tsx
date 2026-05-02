"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { 
    Save, 
    Sparkles, 
    FileCode, 
    Download, 
    ChevronLeft, 
    Loader2, 
    User, 
    GraduationCap, 
    Briefcase, 
    Projector, 
    Wrench, 
    Trophy,
    Plus,
    Trash2,
    Copy,
    Check
} from "lucide-react"
import { 
    getResumeEditor, 
    editResumeEditor, 
    improveResumeEditor, 
    improveAllResumeEditor, 
    getResumeLatex 
} from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

function EditorContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const resumeId = searchParams.get("id")
    const shouldImprove = searchParams.get("improve") === "true"

    const [loading, setLoading] = useState(true)
    const [improving, setImproving] = useState(false)
    const [saving, setSaving] = useState(false)
    const [resumeData, setResumeData] = useState<any>(null)
    const [latex, setLatex] = useState<string>("")
    const [activeTab, setActiveTab] = useState("personal")
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!resumeId) {
            router.push("/placements/resume")
            return
        }
        loadResume()
    }, [resumeId])

    const loadResume = async () => {
        setLoading(true)
        try {
            const data = await getResumeEditor(resumeId!)
            setResumeData(data.structured_json)
            
            if (shouldImprove) {
                handleImproveAll()
            } else {
                fetchLatex()
            }
        } catch (error) {
            toast.error("Failed to load resume data")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchLatex = async () => {
        try {
            const data = await getResumeLatex(resumeId!)
            setLatex(data.latex)
        } catch (error) {
            console.error("Failed to fetch latex", error)
        }
    }

    const handleImproveAll = async () => {
        setImproving(true)
        try {
            const result = await improveAllResumeEditor(resumeId!)
            setResumeData(result.structured_json)
            toast.success("AI has improvised your entire resume!")
            fetchLatex()
        } catch (error) {
            toast.error("Failed to improve resume")
        } finally {
            setImproving(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            // In this simplified editor, we save section by section or all at once?
            // The existing API expects section-wise. Let's do it for the current section.
            await editResumeEditor(resumeId!, {
                section: activeTab,
                payload: resumeData[activeTab],
                reanalyze: true
            })
            toast.success("Changes saved successfully")
            fetchLatex()
        } catch (error) {
            toast.error("Failed to save changes")
        } finally {
            setSaving(false)
        }
    }

    const updatePersonalInfo = (field: string, value: string) => {
        setResumeData({
            ...resumeData,
            personal_info: {
                ...resumeData.personal_info,
                [field]: value
            }
        })
    }

    const updateArrayField = (section: string, index: number, field: string, value: any) => {
        const newArr = [...resumeData[section]]
        newArr[index] = { ...newArr[index], [field]: value }
        setResumeData({ ...resumeData, [section]: newArr })
    }

    const addArrayItem = (section: string, template: any) => {
        setResumeData({
            ...resumeData,
            [section]: [...resumeData[section], template]
        })
    }

    const removeArrayItem = (section: string, index: number) => {
        const newArr = resumeData[section].filter((_: any, i: number) => i !== index)
        setResumeData({ ...resumeData, [section]: newArr })
    }

    const copyLatex = () => {
        navigator.clipboard.writeText(latex)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success("Latex code copied to clipboard")
    }

    const downloadLatex = () => {
        const blob = new Blob([latex], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${resumeData.personal_info.name.replace(/\s+/g, '_')}_Resume.tex`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success("LaTeX source downloaded")
    }

    const downloadPDF = () => {
        // For a true PDF from LaTeX, we need a backend compiler. 
        // As a fallback, we can use the browser's print functionality or a simple message.
        // For now, we'll provide the LaTeX download and suggest Overleaf for the best PDF quality.
        toast.info("For the best PDF quality, please use the downloaded LaTeX source in Overleaf.com", {
            duration: 5000,
        });
        downloadLatex();
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Preparing your resume editspace...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 font-inter text-slate-900 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Button variant="ghost" onClick={() => router.back()} className="rounded-full">
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Back
                        </Button>
                        <div className="h-8 w-[1px] bg-slate-200" />
                        <div>
                            <h1 className="text-xl font-black tracking-tight">Resume Editspace</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium ATS Editor</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            onClick={handleImproveAll} 
                            disabled={improving}
                            className="rounded-xl border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold"
                        >
                            {improving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                            AI Improvise All
                        </Button>
                        <Button 
                            onClick={handleSave} 
                            disabled={saving}
                            className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold px-8"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Progress
                        </Button>
                    </div>
                </div>
            </div>

            <main className="max-w-[1600px] mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left: Section Editors */}
                    <div className="lg:col-span-7 space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="w-full justify-start bg-white border border-slate-200 p-1 h-auto mb-6 rounded-2xl flex-wrap">
                                <TabsTrigger value="personal" className="rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white py-3 px-5 font-bold text-xs gap-2">
                                    <User className="w-4 h-4" /> Personal
                                </TabsTrigger>
                                <TabsTrigger value="education" className="rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white py-3 px-5 font-bold text-xs gap-2">
                                    <GraduationCap className="w-4 h-4" /> Education
                                </TabsTrigger>
                                <TabsTrigger value="experience" className="rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white py-3 px-5 font-bold text-xs gap-2">
                                    <Briefcase className="w-4 h-4" /> Experience
                                </TabsTrigger>
                                <TabsTrigger value="projects" className="rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white py-3 px-5 font-bold text-xs gap-2">
                                    <Projector className="w-4 h-4" /> Projects
                                </TabsTrigger>
                                <TabsTrigger value="skills" className="rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white py-3 px-5 font-bold text-xs gap-2">
                                    <Wrench className="w-4 h-4" /> Skills
                                </TabsTrigger>
                                <TabsTrigger value="achievements" className="rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white py-3 px-5 font-bold text-xs gap-2">
                                    <Trophy className="w-4 h-4" /> Awards
                                </TabsTrigger>
                            </TabsList>

                            {/* Personal Info */}
                            <TabsContent value="personal" className="mt-0">
                                <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                        <CardTitle className="text-lg font-black">Personal Information</CardTitle>
                                        <CardDescription>Basic contact details for your resume header</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                                <Input 
                                                    value={resumeData.personal_info.name} 
                                                    onChange={e => updatePersonalInfo("name", e.target.value)}
                                                    className="rounded-xl border-slate-200 focus:ring-slate-900" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                                <Input 
                                                    value={resumeData.personal_info.email} 
                                                    onChange={e => updatePersonalInfo("email", e.target.value)}
                                                    className="rounded-xl border-slate-200 focus:ring-slate-900" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                                                <Input 
                                                    value={resumeData.personal_info.phone} 
                                                    onChange={e => updatePersonalInfo("phone", e.target.value)}
                                                    className="rounded-xl border-slate-200 focus:ring-slate-900" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Links (LinkedIn, GitHub, Portfolio)</label>
                                            <div className="space-y-3">
                                                {resumeData.personal_info.links.map((link: string, idx: number) => (
                                                    <div key={idx} className="flex gap-2">
                                                        <Input 
                                                            value={link} 
                                                            onChange={e => {
                                                                const newLinks = [...resumeData.personal_info.links]
                                                                newLinks[idx] = e.target.value
                                                                setResumeData({...resumeData, personal_info: {...resumeData.personal_info, links: newLinks}})
                                                            }}
                                                            className="rounded-xl border-slate-200" 
                                                        />
                                                        <Button variant="ghost" onClick={() => {
                                                            const newLinks = resumeData.personal_info.links.filter((_:any, i:number) => i !== idx)
                                                            setResumeData({...resumeData, personal_info: {...resumeData.personal_info, links: newLinks}})
                                                        }} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button variant="outline" onClick={() => {
                                                    setResumeData({...resumeData, personal_info: {...resumeData.personal_info, links: [...resumeData.personal_info.links, ""]}})
                                                }} className="rounded-xl border-dashed border-2 w-full text-slate-500">
                                                    <Plus className="w-4 h-4 mr-2" /> Add Link
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Education */}
                            <TabsContent value="education" className="mt-0">
                                <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                        <CardTitle className="text-lg font-black">Education History</CardTitle>
                                        <CardDescription>Academic background and qualifications</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8">
                                        {resumeData.education.map((edu: any, idx: number) => (
                                            <div key={idx} className="relative p-6 bg-slate-50/50 border border-slate-100 rounded-3xl group">
                                                <Button variant="ghost" onClick={() => removeArrayItem("education", idx)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institution</label>
                                                        <Input value={edu.institution} onChange={e => updateArrayField("education", idx, "institution", e.target.value)} className="rounded-xl border-slate-200 bg-white" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Degree / Branch</label>
                                                        <Input value={edu.degree} onChange={e => updateArrayField("education", idx, "degree", e.target.value)} className="rounded-xl border-slate-200 bg-white" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Year / Duration</label>
                                                        <Input value={edu.year} onChange={e => updateArrayField("education", idx, "year", e.target.value)} className="rounded-xl border-slate-200 bg-white" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">GPA / Percentage</label>
                                                        <Input value={edu.gpa} onChange={e => updateArrayField("education", idx, "gpa", e.target.value)} className="rounded-xl border-slate-200 bg-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="outline" onClick={() => addArrayItem("education", {institution: "", degree: "", year: "", gpa: ""})} className="w-full rounded-2xl py-8 border-dashed border-2 text-slate-500 font-bold">
                                            <Plus className="w-5 h-5 mr-2" /> Add Education Entry
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Experience */}
                            <TabsContent value="experience" className="mt-0">
                                <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                        <CardTitle className="text-lg font-black">Professional Experience</CardTitle>
                                        <CardDescription>Work history, internships, and roles</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8">
                                        {resumeData.experience.map((exp: any, idx: number) => (
                                            <div key={idx} className="relative p-6 bg-slate-50/50 border border-slate-100 rounded-3xl group space-y-6">
                                                <Button variant="ghost" onClick={() => removeArrayItem("experience", idx)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Name</label>
                                                        <Input value={exp.company} onChange={e => updateArrayField("experience", idx, "company", e.target.value)} className="rounded-xl border-slate-200 bg-white" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role / Designation</label>
                                                        <Input value={exp.role} onChange={e => updateArrayField("experience", idx, "role", e.target.value)} className="rounded-xl border-slate-200 bg-white" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration (e.g., June 2023 - Present)</label>
                                                        <Input value={exp.duration} onChange={e => updateArrayField("experience", idx, "duration", e.target.value)} className="rounded-xl border-slate-200 bg-white" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Job Description (Bullet points recommended)</label>
                                                    <Textarea 
                                                        value={typeof exp.description === 'string' ? exp.description : exp.description.join('\n')} 
                                                        onChange={e => updateArrayField("experience", idx, "description", e.target.value)} 
                                                        className="rounded-xl border-slate-200 bg-white min-h-[150px] font-mono text-sm" 
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="outline" onClick={() => addArrayItem("experience", {company: "", role: "", duration: "", description: ""})} className="w-full rounded-2xl py-8 border-dashed border-2 text-slate-500 font-bold">
                                            <Plus className="w-5 h-5 mr-2" /> Add Work Experience
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Projects */}
                            <TabsContent value="projects" className="mt-0">
                                <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                        <CardTitle className="text-lg font-black">Key Projects</CardTitle>
                                        <CardDescription>Academic or personal technical projects</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8">
                                        {resumeData.projects.map((proj: any, idx: number) => (
                                            <div key={idx} className="relative p-6 bg-slate-50/50 border border-slate-100 rounded-3xl group space-y-6">
                                                <Button variant="ghost" onClick={() => removeArrayItem("projects", idx)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2 md:col-span-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Title</label>
                                                        <Input value={proj.title} onChange={e => updateArrayField("projects", idx, "title", e.target.value)} className="rounded-xl border-slate-200 bg-white" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Technologies (comma separated)</label>
                                                        <Input value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies} onChange={e => updateArrayField("projects", idx, "technologies", e.target.value.split(',').map((s:string)=>s.trim()))} className="rounded-xl border-slate-200 bg-white" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Link / Repo</label>
                                                        <Input value={proj.link} onChange={e => updateArrayField("projects", idx, "link", e.target.value)} className="rounded-xl border-slate-200 bg-white" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                                                    <Textarea 
                                                        value={typeof proj.description === 'string' ? proj.description : proj.description.join('\n')} 
                                                        onChange={e => updateArrayField("projects", idx, "description", e.target.value)} 
                                                        className="rounded-xl border-slate-200 bg-white min-h-[120px] font-mono text-sm" 
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="outline" onClick={() => addArrayItem("projects", {title: "", technologies: [], link: "", description: ""})} className="w-full rounded-2xl py-8 border-dashed border-2 text-slate-500 font-bold">
                                            <Plus className="w-5 h-5 mr-2" /> Add Project
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Skills & Awards (Simplified for this workspace) */}
                            <TabsContent value="skills" className="mt-0">
                                <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                        <CardTitle className="text-lg font-black">Technical Skills</CardTitle>
                                        <CardDescription>Core competencies and technologies</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <Textarea 
                                            value={resumeData.skills.join(', ')} 
                                            onChange={e => setResumeData({...resumeData, skills: e.target.value.split(',').map((s:string)=>s.trim())})} 
                                            className="rounded-2xl border-slate-200 bg-white min-h-[200px] font-mono text-base p-6" 
                                            placeholder="Languages, Frameworks, Tools (comma separated)..."
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="achievements" className="mt-0">
                                <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                        <CardTitle className="text-lg font-black">Achievements & Awards</CardTitle>
                                        <CardDescription>Certifications, competitions, and recognition</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <Textarea 
                                            value={resumeData.achievements.join('\n')} 
                                            onChange={e => setResumeData({...resumeData, achievements: e.target.value.split('\n').filter((s:string)=>s.trim() !== "")})} 
                                            className="rounded-2xl border-slate-200 bg-white min-h-[200px] font-mono text-base p-6" 
                                            placeholder="One achievement per line..."
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right: Preview Panel */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="sticky top-28">
                            <Card className="rounded-[2rem] border-slate-900 bg-slate-950 text-white shadow-2xl overflow-hidden h-[calc(100vh-160px)] flex flex-col">
                                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                                            <FileCode className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm">LaTeX Source Code</h3>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">ATS Optimized Output</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={copyLatex} className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg" title="Copy to clipboard">
                                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={downloadLatex} className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg" title="Download .tex file">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold rounded-lg gap-2" onClick={downloadPDF}>
                                            <FileCode className="w-3.5 h-3.5" /> Export PDF (via LaTeX)
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-auto p-0">
                                    <pre className="p-6 text-[12px] font-mono leading-relaxed text-indigo-300 selection:bg-indigo-500/30">
                                        {latex || "% Generating your latex code..."}
                                    </pre>
                                </div>
                                <div className="p-4 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500 text-center font-bold uppercase tracking-widest">
                                    Powered by Academic Reasoning Engine & LaTeX Pro
                                </div>
                            </Card>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}

export default function ResumeEditorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditorContent />
        </Suspense>
    )
}
