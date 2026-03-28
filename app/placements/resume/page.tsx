"use client"

import { useState } from "react"
import { PlacementsChatbot } from "@/components/placements-chatbot"
import { UploadCloud, FileType, CheckCircle, AlertCircle, FileText } from "lucide-react"
import { API_BASE_URL, sendResumeFeedback } from "@/lib/api"

export default function ResumeAnalysisPage() {
    const [file, setFile] = useState<File | null>(null)
    const [resumeText, setResumeText] = useState("")
    const [uploading, setUploading] = useState(false)
    const [analysis, setAnalysis] = useState<string | null>(null)

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file && !resumeText) return

        setUploading(true)
        setAnalysis(null)

        try {
            // Using the new LangGraph agent endpoint
            const data = await sendResumeFeedback({
                message: "Analyze my resume and provide feedback.",
                resume_text: resumeText || "File uploaded (see backend)", // Backend might parse file if we could send it, but let's stick to text for now
            })

            setAnalysis(data.reply)
        } catch (error) {
            console.error(error)
            alert("Failed to analyze resume")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-900">Resume Analysis</h1>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Left: Upload Area & Results */}
                <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">

                    {/* Upload Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Resume Details</h3>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Paste Resume Text</label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-blue-500 transition-all h-48 resize-none"
                                    placeholder="Paste the content of your resume here for AI analysis..."
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500 uppercase tracking-wider text-[10px] font-bold">OR UPLOAD FILE</span>
                                </div>
                            </div>

                            <input
                                type="file"
                                accept=".pdf,.docx"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="block w-full text-xs text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-xs file:font-bold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                            />

                            <button
                                type="submit"
                                disabled={(!file && !resumeText) || uploading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                            >
                                {uploading ? "Analyzing with AI..." : "Analyze Resume"}
                            </button>
                        </form>
                    </div>

                    {/* Analysis Result */}
                    {analysis && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" /> Analysis Report
                            </h3>
                            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                                {analysis}
                            </div>
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 mt-0.5" />
                                <p>Tip: Ask the assistant on the right for specific improvements on your weak areas.</p>
                            </div>
                        </div>
                    )}

                </div>

                {/* Right: Chatbot */}
                <div className="h-full min-h-[500px]">
                    <PlacementsChatbot initialMode="resume" context={{ resume_text: resumeText }} />
                </div>
            </div>
        </div>
    )
}
