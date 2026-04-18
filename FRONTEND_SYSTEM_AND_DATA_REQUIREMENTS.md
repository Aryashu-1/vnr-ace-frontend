# VNR-ACE Frontend System and Data Requirements

## 1. Purpose

This document describes:

- what the current frontend contains
- which features are already connected to backend APIs
- which screens still use local/mock/in-memory data
- what data the frontend expects for each agent and feature
- what should exist in the database or source files for the application to work properly

This is based on the current codebase in `vnr-ace-frontend` as of April 5, 2026.

## 2. Frontend Stack and Runtime

### Framework

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Radix UI based components
- Recharts for charts
- Framer Motion for animation

### Runtime configuration

The frontend depends on:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The effective API base used by the app is:

```text
${NEXT_PUBLIC_API_URL}/api/v1
```

If `NEXT_PUBLIC_API_URL` is missing, the frontend falls back to:

```text
http://localhost:8000/api/v1
```

### Browser storage used by the frontend

- `localStorage["vnr_ace_token"]`: bearer token from login API
- `localStorage["vnr_ace_user"]`: serialized authenticated user object

## 3. High-Level Frontend Architecture

### Layout and access model

- `app/layout.tsx` wraps the whole app in `AuthProvider` and `MainLayout`
- `components/main-layout.tsx` applies route authorization
- `lib/auth.ts` contains current role model and route access rules

### Supported roles

- `guest`
- `student`
- `faculty`
- `admin`
- `placement_officer`

### Important reality of the current auth flow

Login uses the real login API, but the frontend still enriches returned users with mock profile details from `lib/auth.ts` if the backend does not supply them. This means:

- authentication is partly real
- profile rendering still depends on backend returning at least `id`, `email`, and `role`
- richer profile fields are currently faked unless backend also returns them

## 4. Core Shared Data Contracts

### 4.1 Auth and user session

#### Login request

`POST /api/v1/auth/login`

Content type:

```text
application/x-www-form-urlencoded
```

Request fields:

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `username` | string | Yes | email string |
| `password` | string | Yes | plain password |

#### Minimum login response required by current frontend

```json
{
  "access_token": "jwt-or-token-string",
  "token_type": "bearer",
  "user": {
    "id": "1",
    "email": "admin@vnr.edu.in",
    "role": "admin",
    "name": "Admin Officer"
  }
}
```

#### Full user object recommended for frontend completeness

```json
{
  "id": "1",
  "name": "Admin Officer",
  "email": "admin@vnr.edu.in",
  "role": "admin",
  "avatar": "AO",
  "department": "Administration",
  "studentId": null,
  "year": null,
  "section": null,
  "designation": "System Administrator",
  "joinDate": "2018-01-10",
  "phone": "+91 98765 67890"
}
```

#### DB requirement

A `users` table or equivalent identity store should support at least:

- `id`
- `email`
- `password_hash`
- `role`
- `name`
- `department`
- `avatar`
- `designation`
- `student_id`
- `year`
- `section`
- `join_date`
- `phone`
- `is_active`

### 4.2 Standard agent response envelope

Several agent screens assume a general response shape similar to:

```json
{
  "reply": "Natural language answer",
  "state": {},
  "memory": [],
  "chart_path": null,
  "artifact_path": null,
  "data": [],
  "approval_required": false,
  "waiting_for_human": false
}
```

Not every endpoint returns all fields, but this is the broad frontend expectation.

### 4.3 Student master record

Different screens use slightly different student shapes. To support all current frontend needs cleanly, the backend should standardize on a richer student model.

Recommended canonical student record:

```json
{
  "id": "stu_001",
  "rollNumber": "21071A0501",
  "name": "Aarav Patel",
  "email": "aarav@vnr.edu.in",
  "branch": "CSE",
  "section": "A",
  "year": 3,
  "cgpa": 8.7,
  "attendance": 85,
  "placed": true,
  "company": "Google",
  "salary": 32,
  "minor_degree": "AI/ML",
  "skills": ["Python", "React"],
  "backlogs": 0,
  "phone": "+91 9000000000"
}
```

### 4.4 Placement stats payload

The placements dashboards currently accept either a normalized `stats` array or direct scalar fields.

Safest response format:

```json
{
  "stats": [
    { "label": "Eligible Students", "value": 482, "trend": 4.2 },
    { "label": "Placed Students", "value": 312, "trend": 6.1 },
    { "label": "Placement %", "value": 64.7, "trend": 2.4 },
    { "label": "Average Salary", "value": 12.8, "trend": 1.1 }
  ],
  "recent_placements": [
    {
      "name": "Aarav Patel",
      "branch": "CSE",
      "company": "Google",
      "package": "32 LPA"
    }
  ],
  "total": 482,
  "placed": 312,
  "percentage": 64.7,
  "highest": 42,
  "average": 12.8,
  "unplaced": 170
}
```

## 5. Feature and Agent Inventory

This section is the most important one for planning backend/data work.

---

## 5.1 Public / Shared Shell

### Dashboard home: `/`

Current state:

- entirely static demo content
- no backend dependency

Data source:

- hardcoded charts and KPI cards in the page file

DB/file requirement today:

- none required

Recommended future data:

- admissions applications summary
- enrollment trends
- active users/students
- placements snapshot

---

## 5.2 Authentication and Profile

### Login page: `/login`

Current state:

- connected to real backend login API
- redirects users by role after login

Required backend:

- login endpoint
- valid bearer token
- user role in response

Required response fields:

- `access_token`
- `user.id`
- `user.email`
- `user.role`
- `user.name` strongly recommended

### Profile page: `/profile`

Current state:

- renders from `localStorage["vnr_ace_user"]`
- may show mock-derived fields if backend does not return them

Required data for full profile rendering:

- `name`
- `email`
- `role`
- `avatar`
- `department`
- `studentId` or `designation`
- `phone`
- `joinDate`
- `year`
- `section`

Recommended DB tables:

- `users`
- `students`
- `faculty`
- `staff_profiles`

or one unified `user_profiles` table with role-specific nullable fields.

---

## 5.3 Admissions Module

### User-facing page: `/admissions`

Current state:

- only renders the admissions chatbot

### Admissions chatbot agent

Frontend endpoint used:

- `POST /api/v1/agents/admissions`

Request format:

```json
{
  "message": "What branches are available?",
  "thread_id": "optional-thread-id"
}
```

Minimum response format:

```json
{
  "reply": "Admissions answer text"
}
```

Recommended response format:

```json
{
  "reply": "Admissions answer text",
  "state": {
    "intent": "faq_lookup",
    "matched_topics": ["branches", "eligibility"]
  },
  "memory": []
}
```

#### Data required behind this agent

To answer correctly, the backend or knowledge layer should have structured access to:

- FAQ data
- department information
- intake numbers
- eligibility rules
- fee structure
- scholarship details
- deadlines
- application workflow

#### Recommended DB / file schema

`admissions_faqs`

```json
{
  "id": "faq_001",
  "category": "Eligibility",
  "question": "What are the eligibility criteria for B.Tech?",
  "answer": "Candidates must have passed 10+2 with PCM.",
  "keywords": ["eligibility", "btech", "admission"],
  "is_active": true
}
```

`departments`

```json
{
  "id": "dept_cse",
  "code": "CSE",
  "name": "Computer Science and Engineering",
  "intake": 240,
  "hod": "Dr. C. Kiran Mai",
  "description": "Department description text",
  "is_active": true
}
```

### Admin admissions screens

#### `/admin/admissions/faqs`

Current state:

- local-only in-memory FAQ list
- no API persistence

Frontend fields used:

- `id`
- `question`
- `answer`
- `category`

#### `/admin/admissions/department-info`

Current state:

- local-only in-memory department list

Frontend fields used:

- `id`
- `name`
- `code`
- `intake`
- `hod`
- `description`

These two admin pages should eventually write to:

- `admissions_faqs`
- `departments`

---

## 5.4 Classwork Module

### Main page: `/classwork`

Role behavior:

- `faculty`: only faculty enquiry view is effectively relevant
- `admin`: gets three tabs
  - faculty enquiry
  - report generation
  - email automation

### Agent 1: Faculty Enquiry

Used in:

- `/classwork`
- `/timetable`

Frontend endpoint used:

- `POST /api/v1/classwork/faculty-enquiry`

Request format:

```json
{
  "message": "Where is Dr. Ravi Kumar right now?"
}
```

Current response assumption:

```json
{
  "reply": "Dr. Ravi Kumar is in Room B-201 until 10:00 AM.",
  "metadata": {
    "sql": "SELECT ..."
  }
}
```

#### Data required behind this agent

- faculty master data
- timetable/schedule entries
- rooms
- subjects
- section allocations
- optionally live attendance or check-in data

#### Recommended DB tables

`faculty`

```json
{
  "id": "fac_001",
  "name": "S. Rama Rao",
  "department": "CSE",
  "designation": "Professor",
  "email": "rama.rao@vnr.edu.in",
  "phone": "+91 9000000001"
}
```

`timetable_entries`

```json
{
  "id": "tt_001",
  "day": "Monday",
  "startTime": "09:00 AM",
  "endTime": "10:00 AM",
  "subject": "Discrete Mathematics",
  "room": "B-201",
  "faculty": "S. Rama Rao",
  "section": "CSE-A"
}
```

### Agent 2: Report Generation

Used in:

- `/classwork` admin tab
- `/reports`

Frontend endpoint used:

- `POST /api/v1/classwork/report-generation`

Request format:

```json
{
  "message": "Generate a placement report for the last 30 days."
}
```

Minimum response required:

```json
{
  "reply": "Generated the report."
}
```

Preferred response:

```json
{
  "reply": "Generated the report.",
  "artifact_path": "/data/reports/report_123.xlsx",
  "data": []
}
```

#### Data required behind this agent

Depends on report type, but currently the UI implies:

- student records
- attendance
- grades/exam data
- placement data
- admissions data
- financial/admin aggregates if supported

### Agent 3: Email Automation

Used in:

- `/classwork` admin tab
- `/mail`

Frontend endpoint used:

- `POST /api/v1/classwork/email-automation`

Request format:

```json
{
  "message": "Send a warning email to students with low attendance",
  "approval": "approved"
}
```

Frontend expects multi-step stateful workflow:

```json
{
  "reply": "Draft prepared. Awaiting approval.",
  "state": {
    "subject": "Low Attendance Warning",
    "recipients": ["student1@vnr.edu.in"],
    "body": "Email body text",
    "approval_required": true
  }
}
```

#### Data required behind this agent

- recipient discovery from users/students/faculty tables
- template data
- SMTP or outbound email service configuration
- audit/log table for sent emails

#### Recommended DB tables

`email_templates`

```json
{
  "id": "tmpl_001",
  "name": "Attendance Alert",
  "subject": "Low Attendance Warning",
  "body_template": "Dear {{name}}, ...",
  "last_used_at": "2026-04-05T10:00:00Z",
  "is_active": true
}
```

`email_logs`

```json
{
  "id": "mail_001",
  "subject": "Low Attendance Warning",
  "body": "Rendered body text",
  "recipients": ["student1@vnr.edu.in"],
  "status": "sent",
  "created_by": "admin_001",
  "created_at": "2026-04-05T10:15:00Z"
}
```

### Admin classwork pages

#### `/admin/classwork/students`

Current state:

- local-only
- supports manual add/edit/delete
- supports CSV/JSON import into local state only

Frontend file import format accepted:

CSV headers:

```text
rollNo,name,section,year,attendance
```

JSON array format:

```json
[
  {
    "rollNo": "21071A0501",
    "name": "Aarav Patel",
    "section": "A",
    "year": 3,
    "attendance": 85
  }
]
```

#### `/admin/classwork/timetable`

Current state:

- local-only

Required persistent fields:

- `id`
- `day`
- `startTime`
- `endTime`
- `subject`
- `room`
- `faculty`
- `section`

#### `/admin/classwork/mail-agent`

Current state:

- local-only configuration UI
- no backend save

Potential persistent fields:

- SMTP status/config metadata
- auto reply enabled flag
- email templates
- agent daily usage metrics

---

## 5.5 Placements Module

### Placements hub page: `/placements`

Current state:

- acts as navigation launcher for placement tools
- no backend dependency itself

Primary placement features:

- resume analysis
- interview prep
- placement tracking dashboard
- shortlisting
- analytics dashboard
- application portal

### Placements analytics dashboard: `/dashboard/placements`

This is one of the most API-dependent screens.

Frontend endpoints used:

- `GET /api/v1/placements/stats`
- `GET /api/v1/analytics/placement-trend`
- `GET /api/v1/analytics/branch-wise`
- `GET /api/v1/analytics/salary-distribution`
- `GET /api/v1/analytics/top-hiring`
- `GET /api/v1/analytics/minor-impact`
- `GET /api/v1/analytics/multiple-offers`
- `GET /api/v1/data/students`
- export URLs:
  - `/api/v1/export/students?format=csv|excel`
  - `/api/v1/export/dashboard?format=pdf`

#### Required payloads

`/placements/stats`

Supported shape:

```json
{
  "total": 482,
  "placed": 312,
  "percentage": 64.7,
  "highest": 42,
  "average": 12.8,
  "unplaced": 170,
  "recent_placements": [
    {
      "name": "Aarav Patel",
      "branch": "CSE",
      "company": "Google",
      "package": "32 LPA"
    }
  ]
}
```

Analytics endpoints should ideally return:

```json
{
  "data": [
    { "name": "CSE", "value": 120 }
  ]
}
```

or chart-specific keys that can be normalized.

#### Student table requirements on this screen

`/data/students` should return records like:

```json
[
  {
    "id": "stu_001",
    "name": "Aarav Patel",
    "rollNumber": "21071A0501",
    "branch": "CSE",
    "cgpa": 8.7,
    "placed": true,
    "company": "Google",
    "salary": 32,
    "minor_degree": "AI/ML",
    "skills": ["Python", "React"]
  }
]
```

Supported frontend query params:

- `search`
- `branch`
- `placed`

#### DB requirements behind this dashboard

- `students`
- `placements`
- `companies`
- `student_skills`
- `minor_degrees`
- optionally derived analytics tables/materialized views

### AI Chart Generator component

Frontend endpoint used:

- `POST /api/v1/charts/dynamic`

Request:

```json
{
  "query": "Show salary distribution by branch"
}
```

Expected response:

```json
{
  "chart": "salary-distribution",
  "data": [
    { "bucket": "0-5", "count": 10 }
  ]
}
```

Recognized chart identifiers in frontend:

- `placement-trend`
- `branch-wise`
- `salary-distribution`
- `company-wise`
- `minor-degree`
- `multiple-offers`

### Predictive insights panel

Current state:

- mock-only fallback data in frontend
- no active backend contract

If this is to become real, required data would include:

- historical placement rates
- historical salary trends
- current unplaced student features
- skills, CGPA, internships, backlog status

Recommended future tables:

- `placement_predictions`
- `student_risk_scores`
- `salary_forecasts`

### Placement dashboard summary page: `/placements/dashboard`

Frontend endpoint used:

- `GET /api/v1/placements/stats`

Required fields:

- either `stats[]`
- or direct scalar totals plus `recent_placements[]`

### Resume Analysis page: `/placements/resume`

Frontend endpoints used:

- `POST /api/v1/placements/resume/analyze`
- `POST /api/v1/placements/resume/chat`

#### Resume upload request

Content type:

```text
multipart/form-data
```

Fields:

- `file` optional file
- `resume_text` optional raw text

#### Required analysis response

```json
{
  "overall_score": 85,
  "summary": ["Strong technical profile"],
  "section_feedback": {
    "experience": {
      "issues": ["Missing impact metrics"],
      "suggestions": ["Add quantified outcomes"],
      "example_rewrites": ["Built X which improved Y by 20%"]
    }
  },
  "ats_issues": ["Avoid multi-column layout"],
  "priority_fixes": ["Add GitHub link"]
}
```

#### Resume chat request after analysis

```json
{
  "message": "How can I improve my projects section?",
  "structured_analysis": {
    "overall_score": 85,
    "summary": [],
    "section_feedback": {},
    "ats_issues": [],
    "priority_fixes": []
  },
  "conversation_history": []
}
```

#### Resume chat response

```json
{
  "reply": "You should make your project bullets more outcome-driven.",
  "conversation_history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

#### Data/storage required

If persistence is needed beyond a stateless agent:

- `resumes`
- parsed resume text
- analysis results
- resume feedback conversations

Recommended `resumes` record:

```json
{
  "id": "res_001",
  "student_id": "stu_001",
  "file_name": "resume.pdf",
  "file_path": "/uploads/resumes/resume.pdf",
  "extracted_text": "full text here",
  "uploaded_at": "2026-04-05T11:00:00Z"
}
```

### Resume Shortlisting page: `/placements/shortlisting`

Frontend endpoint used:

- `POST /api/v1/placements/shortlist/run`

Content type:

```text
application/x-www-form-urlencoded
```

Fields currently sent:

- `jd_text`
- `no_of_students`
- `min_cgpa` optional
- `branch` optional if not `all`

Required response:

```json
{
  "matches": [
    {
      "roll_no": "21071A0501",
      "resume_id": "res_001",
      "score": 0.92,
      "match_reason": "Strong React and Node alignment",
      "matched_chunks": [
        { "text": "Built React dashboard", "score": 0.95 }
      ]
    }
  ]
}
```

#### DB/data required

- student master data
- branch and CGPA fields
- resume repository
- parsed resume chunks/embeddings if semantic search is used
- job description text
- shortlisting runs and results if auditability is needed

### Interview Prep page: `/placements/prep`

Frontend endpoints used:

- `POST /api/v1/placements/prep/start`
- `POST /api/v1/placements/prep/chat`

#### Start session request

```json
{
  "company": "Oracle",
  "topics": []
}
```

#### Start session response expected by frontend

```json
{
  "session_id": "prep_001",
  "company": "Oracle",
  "role": "Software Engineer",
  "topics": ["DSA", "OOPS"],
  "experiences": [
    { "content": "Round 1 focused on DSA" }
  ],
  "questions": [
    { "question": "Explain hashing collisions" }
  ]
}
```

#### Chat request

```json
{
  "session_id": "prep_001",
  "message": "Ask me a mock interview question"
}
```

#### Data required behind prep

- company profiles
- role-specific interview patterns
- interview experiences
- previous year questions
- possibly topic catalogs
- prep session memory

Recommended tables:

- `companies`
- `interview_experiences`
- `previous_year_questions`
- `prep_sessions`
- `prep_messages`

### Application Portal: `/placements/application-portal`

Current state:

- fully local demo feature
- driven by `app/placements/application-portal/data.ts`
- no backend calls yet

#### Current frontend job shape

```json
{
  "id": "1",
  "companyName": "TechNova Solutions",
  "role": "Full Stack Developer (SDE-1)",
  "package": "14.5 LPA",
  "location": "Bangalore",
  "deadline": "Oct 15, 2026",
  "logoText": "TN",
  "logoBg": "bg-blue-100 text-blue-600",
  "tags": ["Full Time", "Software"],
  "description": "Job description",
  "criteria": {
    "cgpa": "7.5 & Above",
    "branches": ["CSE", "IT"],
    "backlogs": "No active backlogs"
  },
  "skills": ["React.js", "Node.js"],
  "examRounds": [
    {
      "round": 1,
      "name": "Online Assessment",
      "date": "Oct 18, 2026",
      "description": "DSA round"
    }
  ],
  "status": "Open",
  "instructions": ["Upload updated resume"],
  "editDeadline": "Oct 20, 2026"
}
```

#### Recommended DB tables

`job_opportunities`

- all fields above except CSS-specific `logoBg`
- better to store branding/theme metadata separately or derive in frontend

`job_rounds`

```json
{
  "id": "round_001",
  "job_id": "job_001",
  "round": 1,
  "name": "Online Coding Assessment",
  "date": "2026-10-18",
  "description": "DSA and reasoning"
}
```

`job_applications`

```json
{
  "id": "app_001",
  "job_id": "job_001",
  "student_id": "stu_001",
  "resume_id": "res_001",
  "status": "Applied",
  "applied_at": "2026-10-10T09:00:00Z",
  "updated_at": "2026-10-11T10:00:00Z"
}
```

#### Current apply/edit/withdraw flow

The frontend only simulates:

- apply
- edit resume
- withdraw

No backend persistence exists yet. To make it real, APIs are needed for:

- list jobs
- get job details
- apply to job
- update application resume
- withdraw application
- list applications for current user

### Admin placements pages

#### `/admin/placements/companies`

Current state:

- local-only company drive records

Fields used:

- `id`
- `name`
- `role`
- `ctc`
- `deadline`
- `status`

#### `/admin/placements/interview-experiences`

Current state:

- local-only

Fields used:

- `id`
- `studentName`
- `company`
- `role`
- `difficulty`
- `date`

#### `/admin/placements/resume-rules`

Current state:

- local-only

Fields used:

- `id`
- `name`
- `category`
- `weight`
- `description`
- global threshold slider

Suggested persistence:

`resume_rules`

```json
{
  "id": "rule_001",
  "name": "Technical Skills Presence",
  "category": "Keyword",
  "weight": 80,
  "description": "Checks for core technologies",
  "is_active": true
}
```

`resume_rule_settings`

```json
{
  "match_threshold": 75
}
```

#### `/admin/placements/data`

Current state:

- local-only placement log and summary cards

Fields used:

- `id`
- `studentName`
- `rollNo`
- `company`
- `package`
- `status`
- `date`

This should eventually be powered from the same placement records used by dashboards and shortlisting.

---

## 5.6 Reports Module

### `/reports`

Current state:

- partially connected
- dropdown choices are local UI values
- actual generation calls report-generation agent
- report list at top is static placeholder

Backend/data needed:

- report-generation endpoint
- report artifact storage
- report history metadata if list should become real

Recommended `reports` table:

```json
{
  "id": "rep_001",
  "name": "Academic Performance",
  "type": "academic_performance",
  "parameters": {
    "dateRange": "Last 30 Days"
  },
  "artifact_path": "/data/reports/rep_001.xlsx",
  "created_at": "2026-04-05T11:30:00Z",
  "created_by": "admin_001"
}
```

## 6. File-Based Data Requirements

These are the file-level data needs that exist today.

### 6.1 Environment file

Required:

- `.env` with `NEXT_PUBLIC_API_URL`

### 6.2 CSV student import

Supported columns:

- `rollNo`
- `name`
- `section`
- `year`
- `attendance`

Also tolerated:

- `roll no` instead of `rollNo`

Example:

```csv
rollNo,name,section,year,attendance
21071A0501,Aarav Patel,A,3,85
21071A0502,Isha Sharma,B,3,92
```

### 6.3 JSON student import

Expected format:

```json
[
  {
    "rollNo": "21071A0501",
    "name": "Aarav Patel",
    "section": "A",
    "year": 3,
    "attendance": 85
  }
]
```

### 6.4 Resume file uploads

Accepted by frontend:

- `.pdf`
- `.docx`
- `.txt`

Application portal apply modal accepts:

- `.pdf`
- `.doc`
- `.docx`

## 7. Current Gaps Between Frontend and Persistent Data

### Fully or mostly backend-connected already

- login
- admissions chatbot
- faculty enquiry agent
- email automation agent
- report generation agent
- placements stats and analytics
- dynamic AI chart routing
- resume analysis
- resume chat
- shortlisting
- interview prep sessions

### Still local-only or mock-driven

- home dashboard `/`
- predictive insights panel
- application portal jobs and apply flow
- admin admissions pages
- admin classwork pages
- admin placements pages
- reports list/history UI
- mail-agent admin configuration page

### Mixed state areas

- profile data after login
- route authorization is real on frontend, but user metadata is still partly mock-enriched

## 8. Recommended Backend/Data Priorities

To make the frontend work reliably end-to-end, the most useful order is:

1. Stabilize auth/user profile response so mock enrichment can be removed.
2. Standardize student master schema used by placements, classwork, and profile.
3. Normalize placements stats and analytics endpoints around one common data model.
4. Replace application portal dummy jobs with real jobs, rounds, and applications tables.
5. Add persistence APIs for admin admissions/classwork/placements pages.
6. Add report history and generated artifact metadata.
7. Add predictive analytics tables only after base operational data is trustworthy.

## 9. Minimum Database Domains Needed

For the current frontend to eventually be fully production-backed, the backend/data layer should cover at least these domains:

- identity and users
- students
- faculty
- departments
- admissions FAQs
- timetable/schedules
- email templates and email logs
- reports and artifacts
- companies and job opportunities
- placement records
- resumes and parsed resume text
- shortlisting runs/results
- interview experiences and prep knowledge
- job applications

## 10. Final Summary

The current frontend is a hybrid system:

- agent-heavy workflows are already mostly API-driven
- operational admin screens are still largely local-state prototypes
- placement analytics are the most mature data-backed area
- admissions and classwork agents need knowledge tables plus structured academic data
- the application portal needs a full backend model before it becomes real

If we want the whole application to work properly without mock/local fallbacks, the most important persistent datasets are:

- users and profiles
- students
- departments and FAQs
- faculty and timetable
- placement records and analytics
- resumes and applications
- report artifacts
- email templates/logs
