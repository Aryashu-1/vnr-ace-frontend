'use client'

import { useState } from "react"
import { Send, UploadCloud, File, CheckCircle2, Edit2, XCircle, Clock, AlertTriangle, ExternalLink, AlertCircle } from "lucide-react"
import { applyForJob, withdrawApplication } from "@/lib/api"
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
import { usePlacements } from "@/components/placements-provider"
import { JobListing } from "@/lib/api"

export function ApplyButton({ job }: { job: JobListing }) {
    const { refreshJobs } = usePlacements();

    // Check localStorage for session persistence if backend has issues
    const getInitialStatus = () => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`applied_${job.id}`);
            if (saved === 'true') return true;
        }
        return job.status?.toLowerCase() === 'applied';
    };

    const [isApplied, setIsApplied] = useState(getInitialStatus())
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Modals for editing/withdrawing
    const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false)
    const [isWithdrawConfirmOpen, setIsWithdrawConfirmOpen] = useState(false)

    // Simulate backend deadline check. For Demo, allow if editDeadline is set
    const canEditOrWithdraw = job.editDeadline ? true : job.status?.toLowerCase() === 'open';

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile) return

        setIsSubmitting(true)
        setError(null)
        
        try {
            // Attempt to call API (Disabled as requested)
            // await applyForJob(job.id);
        } catch (err: any) {
            console.error("API application failed, falling back to local state:", err);
        } finally {
            // Persist to local storage for the session
            if (typeof window !== 'undefined') {
                localStorage.setItem(`applied_${job.id}`, 'true');
            }
            setIsApplied(true);
            setIsOpen(false);
            setIsEditConfirmOpen(false);
            setIsSubmitting(false);
            refreshJobs(); // Sync global state
            console.log(`Application for ${job.companyName || job.company_name} persisted locally (Frontend Only).`);
        }
    }

    const handleWithdraw = async () => {
        try {
            // Attempt to call API (Disabled as requested)
            // await withdrawApplication(job.id);
        } catch (err: any) {
            console.error("API withdrawal failed, falling back to local state:", err);
        } finally {
            if (typeof window !== 'undefined') {
                localStorage.setItem(`applied_${job.id}`, 'withdrawn');
            }
            setIsApplied(false);
            setSelectedFile(null);
            setIsWithdrawConfirmOpen(false);
            refreshJobs(); // Sync global state
        }
    }

    const openEditModal = () => {
        setIsEditConfirmOpen(false)
        setIsOpen(true)
    }

    if (job.status?.toLowerCase() === 'closed') {
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
                        error={error}
                    />
                )}
            </div>
        )
    }

    if (job.requiresExternalRegistration && !job.isRegisteredExternally) {
        return (
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <button
                    disabled
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-sm bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                >
                    <AlertTriangle className="w-4 h-4" />
                    Registration Required
                </button>
                <p className="text-[10px] text-amber-600 font-medium text-center italic">
                    Register externally to unlock
                </p>
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
                error={error}
            />
        </>
    )
}

function ApplicationModal({
    isOpen, setIsOpen, job, handleApply, selectedFile, setSelectedFile, isSubmitting, isEditing, error
}: any) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
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
                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-800 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}
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
