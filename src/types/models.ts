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
    description?: string
    level?: string
}

export interface WantedSkill {
    id: string
    name: string
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
    status: 'scheduled' | 'completed' | 'cancelled'
    created_at: Date
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
    data?: any
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
