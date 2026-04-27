const getBaseUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL
    if (envUrl && envUrl.trim() !== "") {
        return envUrl.endsWith("/") ? `${envUrl}api/v1` : `${envUrl}/api/v1`
    }
    return "http://localhost:8000/api/v1"
}

export const API_BASE_URL = getBaseUrl()

export class ApiError extends Error {
    status: number;
    data: any;

    constructor(message: string, status: number, data?: any) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

// Auth helpers
export const setToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem("vnr_ace_token", token)
    }
}

export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("vnr_ace_token")
    }
    return null
}

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem("vnr_ace_token")
    }
}

export async function login(username: string, password: string) {
    const formData = new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)

    const url = `${API_BASE_URL}/auth/login`
    console.log(`Attempting login at: ${url}`)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    })

    if (!response.ok) {
        let errorMsg = 'Login failed'
        let errorData = null
        try {
            errorData = await response.json()
            errorMsg = errorData.detail || errorData.message || errorMsg
        } catch {
            // keep default
        }
        console.error(`Login failed: ${response.status}`, errorMsg)
        throw new ApiError(errorMsg, response.status, errorData)
    }

    return response.json()
}

// Simplified fetching helper
export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
    const token = typeof window !== 'undefined' ? localStorage.getItem("vnr_ace_token") : null
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    }

    if (!isFormData && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json"
    }

    if (token) headers["Authorization"] = `Bearer ${token}`

    const response = await fetch(url, { ...options, headers })

    if (!response.ok) {
        let message = `API call failed: ${response.status} ${response.statusText}`
        let errorData: any = null;

        try {
            errorData = await response.json()
            message =
                errorData?.detail ||
                errorData?.message ||
                errorData?.reply ||
                (Array.isArray(errorData?.detail)
                    ? errorData.detail.map((item: any) => item?.msg || JSON.stringify(item)).join(", ")
                    : message)
        } catch {
            try {
                const text = await response.text()
                if (text) {
                    message = text
                }
            } catch {
                // Ignore parse failures and keep the default status-based message.
            }
        }

        throw new ApiError(message, response.status, errorData)
    }

    return response.json()
}

// --- NEW STANDARDIZED API METHODS ---

// Analytics & Charts
export const getPlacementTrend = () => fetchFromApi("/analytics/placement-trend");
export const getBranchWise = () => fetchFromApi("/analytics/branch-wise");
export const getSalaryDistribution = () => fetchFromApi("/analytics/salary-distribution");
export const getTopHiring = () => fetchFromApi("/analytics/top-hiring");
export const getMinorImpact = () => fetchFromApi("/analytics/minor-impact");
export const getMultipleOffers = () => fetchFromApi("/analytics/multiple-offers");

// AI Visualization / Dynamic Charts
export const queryAiVisualization = (query: string) =>
    fetchFromApi("/charts/dynamic", {
        method: "POST",
        body: JSON.stringify({ query }),
    });

// Dashboard Stats & Data
export const getDashboardStats = () => fetchFromApi("/placements/stats");
export const getStudents = (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return fetchFromApi(`/data/students${query}`);
};

// Placement Dashboard API Utilities (Legacy/Specific)
export const getExportStudentsUrl = () => `${API_BASE_URL}/export/students`;
export const getExportDashboardUrl = () => `${API_BASE_URL}/export/dashboard`;

// --- NEW LANGGRAPH AGENT API METHODS ---

export interface AgentResponse {
    reply: string;
    state?: any;
    memory?: any[];
    chart_path?: string;
    artifact_path?: string;
    data?: any[];
    approval_required?: boolean;
    waiting_for_human?: boolean;
}

// Agents
export const sendAdmissionsChat = (message: string, thread_id?: string) =>
    fetchFromApi("/agents/admissions", {
        method: "POST",
        body: JSON.stringify({ message, thread_id }),
    });

// Classwork Agents
export const sendEmailAutomation = (message: string, approval?: string) =>
    fetchFromApi("/classwork/email-automation", {
        method: "POST",
        body: JSON.stringify({ message, approval }),
    });

export const sendFacultyEnquiry = (message: string) =>
    fetchFromApi("/classwork/faculty-enquiry", {
        method: "POST",
        body: JSON.stringify({ message }),
    });

export const sendReportGeneration = (message: string) =>
    fetchFromApi("/classwork/report-generation", {
        method: "POST",
        body: JSON.stringify({ message }),
    });

export const sendBulkDataQuery = (message: string) =>
    fetchFromApi("/classwork/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
    });

// Placements Agents
export const sendChartGenerator = (message: string, memory: any[] = []) =>
    fetchFromApi("/placements/chart-generator", {
        method: "POST",
        body: JSON.stringify({ message, memory }),
    });

export const sendLiveDashboard = (message: string, memory: any[] = []) =>
    fetchFromApi("/placements/live-dashboard", {
        method: "POST",
        body: JSON.stringify({ message, memory }),
    });

export interface ResumeFeedbackRequest {
    message: string;
    resume_text: string;
    resume_id?: string;
    memory?: any[];
}

export const sendResumeFeedback = (payload: ResumeFeedbackRequest) =>
    fetchFromApi("/placements/resume-feedback", {
        method: "POST",
        body: JSON.stringify(payload),
    });

export interface ResumeChatRequest {
    message: string;
    structured_analysis: any;
    conversation_history?: any[];
}

export const sendResumeChat = (payload: ResumeChatRequest) =>
    fetchFromApi("/placements/resume/chat", {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const sendShortlistingAgent = (message: string, jd_text: string) =>
    fetchFromApi("/placements/shortlisting-agent", {
        method: "POST",
        body: JSON.stringify({ message, jd_text }),
    });

// --- DIRECT PLACEMENT APIs (Section 6) ---

export const analyzeResumeDirect = (file?: File, resume_text?: string) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (resume_text) formData.append("resume_text", resume_text);

    return fetchFromApi("/placements/resume/analyze", {
        method: "POST",
        body: formData,
    });
};

export interface ResumeSectionFeedback {
    score?: number | null;
    issues?: string[];
    suggestions?: string[];
    example_rewrites?: string[];
    strengths?: string[];
    weaknesses?: string[];
}

export interface ResumeAnalysis {
    overall_score?: number | null;
    score?: number | null;
    summary?: string[];
    strengths?: string[];
    weaknesses?: string[];
    section_feedback?: Record<string, ResumeSectionFeedback>;
    ats_issues?: string[];
    priority_fixes?: string[];
}

export interface ResumeRecord {
    id?: string;
    resume_id?: string;
    file_name?: string;
    title?: string;
    structured_json?: Record<string, any> | null;
    structured_resume?: Record<string, any> | null;
    analysis?: ResumeAnalysis | null;
    latest_analysis?: ResumeAnalysis | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

export const uploadResumeEditor = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return fetchFromApi("/placements/resume/upload", {
        method: "POST",
        body: formData,
    });
};

export const getResumeEditor = (resumeId: string) =>
    fetchFromApi(`/placements/resume/${resumeId}`);

export const editResumeEditor = (resumeId: string, payload: Record<string, any>) =>
    fetchFromApi(`/placements/resume/${resumeId}/edit`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const improveResumeEditor = (resumeId: string, payload: Record<string, any>) =>
    fetchFromApi(`/placements/resume/${resumeId}/improve`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const reanalyzeResumeEditor = (resumeId: string, payload: Record<string, any> = {}) =>
    fetchFromApi(`/placements/resume/${resumeId}/reanalyze`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const runShortlistingDirect = (jd_text: string, no_of_students: number = 5, min_cgpa?: number, branch?: string) => {
    const params = new URLSearchParams();
    params.append("jd_text", jd_text);
    params.append("no_of_students", no_of_students.toString());
    if (min_cgpa) params.append("min_cgpa", min_cgpa.toString());
    if (branch && branch !== "all") params.append("branch", branch);

    return fetchFromApi("/placements/shortlist/run", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    });
};

// Interview Prep Agent
export const startPrepSession = (company: string, topics?: string[]) =>
    fetchFromApi("/placements/prep/start", {
        method: "POST",
        body: JSON.stringify({ company, topics: topics || [] }),
    });

export const sendPrepChat = (session_id: string, message: string) =>
    fetchFromApi("/placements/prep/chat", {
        method: "POST",
        body: JSON.stringify({ session_id, message }),
    });

// AI SQL Engine
