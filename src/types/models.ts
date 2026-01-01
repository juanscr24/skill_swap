export interface User {
    id: string
    name: string
    email: string
    image?: string
    bio?: string
    city?: string
    role: 'USER' | 'MENTOR' | 'STUDENT' | 'ADMIN'
    created_at: Date
    skills: Skill[]
    wanted_skills: WantedSkill[]
    rating?: number
    totalReviews?: number
    hoursTeaching?: number
    classesTaken?: number
    classesGiven?: number
}

export interface Skill {
    id: string
    name: string
    description?: string | null
    level?: string | null
}

export interface WantedSkill {
    id: string
    name: string
}

export interface Language {
    id: string
    name: string
    level?: string | null
}

export interface Match {
    id: string
    sender: User
    receiver: User
    skill: string
    status: 'pending' | 'accepted' | 'rejected'
    created_at: Date
}

export interface Message {
    id: string
    sender: User
    receiver: User
    content: string
    read: boolean
    created_at: Date
}

export interface Session {
    id: string
    host: User
    guest: User
    title: string
    description?: string
    start_at: Date
    end_at: Date
    status: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'rejected'
    created_at: Date
    availability_id?: string
}

export interface MentorAvailability {
    id: string
    mentor_id: string
    date: Date
    start_time: string // Format: "HH:mm"
    end_time: string // Format: "HH:mm"
    is_booked: boolean
    created_at: Date
}

export interface AvailabilitySlot {
    id: string
    date: string
    start_time: string
    end_time: string
    is_booked: boolean
}

export interface SessionRequest {
    mentor_id: string
    title: string
    description?: string
    availability_id: string
    duration_minutes: number
}

export interface Review {
    id: string
    author: User
    target: User
    rating: number
    comment?: string
    created_at: Date
}

export interface Notification {
    id: string
    user_id: string
    type: string
    data?: Record<string, unknown>
    read: boolean
    created_at: Date
}

export interface ChatConversation {
    id: string
    user: User
    lastMessage: Message
    unreadCount: number
}

export interface DashboardStats {
    classesTaken: number
    classesGiven: number
    hoursTeaching: number
    progressLevel: number
}
