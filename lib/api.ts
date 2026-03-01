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
