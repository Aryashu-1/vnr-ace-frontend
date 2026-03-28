"use client"

import { FacultyEnquiryAgent } from "@/components/faculty-enquiry-agent"

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-inter">Faculty Timetable Enquiry</h1>
        <p className="text-gray-600 mt-1">Check faculty availability and schedules</p>
      </div>

      <FacultyEnquiryAgent />
    </div>
  )
}
