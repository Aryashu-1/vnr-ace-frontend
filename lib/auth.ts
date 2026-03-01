// Mock authentication utility - Replace with real auth when implementing
export type UserRole = "student" | "faculty" | "admin" | "guest" | "placement_officer"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  // Extended details
  department?: string
  studentId?: string // For students
  year?: string // For students
  section?: string // For students
  designation?: string // For faculty
  joinDate?: string
  phone?: string
}

// Mock user data - In production, use real authentication
export const mockUsers: Record<string, User> = {
  student1: {
    id: "1",
    name: "Arjun Sharma",
    email: "arjun@student.edu",
    role: "student",
    avatar: "AS",
    department: "Computer Science & Engineering",
    studentId: "21071A0501",
    year: "IV",
    section: "A",
    joinDate: "2021-09-01",
    phone: "+91 98765 43210",
  },
  faculty1: {
    id: "2",
    name: "Prof. Rajesh Kumar",
    email: "rajesh@faculty.edu",
    role: "faculty",
    avatar: "RK",
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    joinDate: "2015-06-15",
    phone: "+91 98765 12345",
  },
  admin1: {
    id: "3",
    name: "Admin Officer",
    email: "admin@vnr.edu",
    role: "admin",
    avatar: "AO",
    department: "Administration",
    designation: "System Administrator",
    joinDate: "2018-01-10",
    phone: "+91 98765 67890",
  },
  po1: {
    id: "4",
    name: "Placement Officer",
    email: "po@vnr.edu",
    role: "placement_officer",
    avatar: "PO",
    department: "Training & Placements",
    designation: "Head of Placements",
    joinDate: "2016-03-20",
    phone: "+91 98765 99999",
  },
}

export function getUser(id: string): User | null {
  return mockUsers[id] || null
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const accessRules: Record<UserRole, string[]> = {
    student: ["/dashboard", "/dashboard/admissions"],
    faculty: [
      "/dashboard",
      "/dashboard/admissions",
      "/dashboard/classwork",
      "/dashboard/placements",
      "/dashboard/reports",
    ],
    admin: [
      "/dashboard",
      "/dashboard/admissions",
      "/dashboard/classwork",
      "/dashboard/placements",
      "/dashboard/reports",
      "/dashboard/admin",
    ],
    guest: ["/dashboard/admissions"],
    placement_officer: [
      "/dashboard",
      "/dashboard/admissions",
      "/dashboard/classwork",
      "/dashboard/placements",
      "/dashboard/reports",
    ],
  }

  return accessRules[userRole]?.some((allowedRoute) => route.startsWith(allowedRoute)) || false
}
