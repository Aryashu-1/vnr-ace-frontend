'use client'

import { useState } from "react"
import { Send, UploadCloud, File, CheckCircle2, Edit2, XCircle, Clock } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { JobOpportunity } from "../data"

export function ApplyButton({ job }: { job: JobOpportunity }) {
    const [isApplied, setIsApplied] = useState(job.status === 'Applied')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    // Modals for editing/withdrawing
    const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false)
    const [isWithdrawConfirmOpen, setIsWithdrawConfirmOpen] = useState(false)

    // Simulate backend deadline check. For Demo, allow if editDeadline is set
    const canEditOrWithdraw = job.editDeadline ? true : job.status === 'Open';

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile) return

        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setIsApplied(true)
            setIsOpen(false)
            setIsEditConfirmOpen(false) // just in case it was opened from Edit
        }, 1500)
    }

    const handleWithdraw = () => {
        // Simulate API withdraw action
        setIsWithdrawConfirmOpen(false)
        setIsApplied(false)
        setSelectedFile(null)
    }

    const openEditModal = () => {
        setIsEditConfirmOpen(false)
        setIsOpen(true)
    }

    if (job.status === 'Closed') {
        return (
            <button disabled className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-sm bg-gray-100 text-gray-500 cursor-not-allowed">
                Closed
            </button>
        )
    }

    if (isApplied) {
        return (
            <div className="flex flex-col items-end gap-3 w-full">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-end">
                    <button disabled className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm bg-green-100 text-green-700 border border-green-200 cursor-default flex-1 sm:flex-none">
                        <CheckCircle2 className="w-4 h-4" />
                        Applied
                    </button>

                    {canEditOrWithdraw && (
                        <>
                            <button
                                onClick={() => setIsEditConfirmOpen(true)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 flex-1 sm:flex-none"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Resume
                            </button>
                            <button
                                onClick={() => setIsWithdrawConfirmOpen(true)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm bg-white text-red-600 border border-red-200 hover:bg-red-50 flex-1 sm:flex-none"
                            >
                                <XCircle className="w-4 h-4" />
                                Withdraw
                            </button>
                        </>
                    )}
                </div>

                {job.editDeadline && canEditOrWithdraw && (
                    <div className="text-xs text-orange-600 flex items-center bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 w-full justify-center sm:w-auto">
                        <Clock className="w-3 h-3 mr-1.5" />
                        Changes allowed until {job.editDeadline}
                    </div>
                )}

                {/* Confirm Edit Dialog */}
                <AlertDialog open={isEditConfirmOpen} onOpenChange={setIsEditConfirmOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Edit Application?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will open the application modal again where you can upload a new resume.
                                Are you sure you want to update your application for {job.companyName}?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={openEditModal} className="bg-blue-600 hover:bg-blue-700 text-white">
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Confirm Withdraw Dialog */}
                <AlertDialog open={isWithdrawConfirmOpen} onOpenChange={setIsWithdrawConfirmOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Withdraw Application?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to completely withdraw your application to {job.companyName}?
                                This action cannot be undone, though you can re-apply before the deadline.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleWithdraw} className="bg-red-600 hover:bg-red-700 text-white">
                                Withdraw Application
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Reuse existing application modal for "Editing" */}
                {isOpen && (
                    <ApplicationModal
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        job={job}
                        handleApply={handleApply}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        isSubmitting={isSubmitting}
                        isEditing={true}
                    />
                )}
            </div>
        )
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-sm bg-blue-600 text-white hover:bg-blue-700 hover:shadow shadow-blue-200"
            >
                <Send className="w-4 h-4" />
                Apply Now
            </button>

            <ApplicationModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                job={job}
                handleApply={handleApply}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                isSubmitting={isSubmitting}
                isEditing={false}
            />
        </>
    )
}

function ApplicationModal({
    isOpen, setIsOpen, job, handleApply, selectedFile, setSelectedFile, isSubmitting, isEditing
}: any) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Update Resume for' : 'Apply for'} {job.role}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? `Upload a new resume to update your existing application to ${job.companyName}.`
                            : `Submit your application to ${job.companyName}. Please review the instructions carefully.`
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleApply} className="space-y-6 py-4">
                    {/* Instructions Box */}
                    {job.instructions && job.instructions.length > 0 && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                Application Instructions
                            </h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {job.instructions.map((inst: string, i: number) => (
                                    <li key={i}>{inst}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Resume Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 block">Resume / CV <span className="text-red-500">*</span></label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                required
                            />
                            {!selectedFile ? (
                                <div className="space-y-2 flex flex-col items-center pointer-events-none">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                        <UploadCloud className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm font-medium text-blue-600">Click to upload or drag and drop</div>
                                    <div className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center space-y-2 pointer-events-none">
                                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                        <File className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">{selectedFile.name}</div>
                                    <div className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-between">
                        <DialogClose asChild>
                            <button type="button" className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors text-sm">
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            type="submit"
                            disabled={!selectedFile || isSubmitting}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {isEditing ? 'Updating...' : 'Submitting...'}
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    {isEditing ? 'Update Application' : 'Submit Application'}
                                </>
                            )}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
