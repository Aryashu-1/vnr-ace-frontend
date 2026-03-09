export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

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

export async function login(email: string, password: string) {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    })

    if (!response.ok) {
        throw new Error('Login failed')
    }

    return response.json()
}

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
    const token = getToken()

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
        ...options,
        headers,
    })

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`)
    }

    return response.json()
}

// --- PLACEMENT DASHBOARD API METHODS ---
// Uses localhost:3000/api as requested by the user
const PLACEMENT_BASE = "http://localhost:3000/api";

async function fetchGet(endpoint: string) {
    const res = await fetch(`${PLACEMENT_BASE}${endpoint}`);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return res.json();
}

async function fetchPost(endpoint: string, body: any) {
    const res = await fetch(`${PLACEMENT_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Failed to POST to ${endpoint}`);
    return res.json();
}

export const getStats = () => fetchGet("/placements/stats");
export const getPlacementTrend = () => fetchGet("/charts/placement-trend");
export const getBranchWise = () => fetchGet("/charts/branch-wise");
export const getSalaryDistribution = () => fetchGet("/charts/salary-distribution");
export const getCompanyWise = () => fetchGet("/charts/company-wise");
export const getMinorDegree = () => fetchGet("/charts/minor-degree");
export const getMultipleOffers = () => fetchGet("/charts/multiple-offers");

export const getStudents = (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return fetchGet(`/students${query}`);
};

// AI Visualization / Dynamic Charts
export const queryAiVisualization = (queryStr: string) => {
    const params = new URLSearchParams({ query: queryStr });
    return fetchGet(`/charts/dynamic?${params.toString()}`);
};

export const getPredictionPlacementPercentage = () => fetchGet("/predictions/placement-percentage");
export const getPredictionSalaryTrends = () => fetchGet("/predictions/salary-trends");
export const getPredictionUnplacedRisk = () => fetchGet("/predictions/unplaced-risk");

export const getExportStudentsUrl = () => `${PLACEMENT_BASE}/export/students`;
export const getExportDashboardUrl = () => `${PLACEMENT_BASE}/export/dashboard`;

