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

export interface Notification {
    id: string
    user_id: string
    type: string
    data?: Record<string, unknown>
    read: boolean
    created_at: Date
}
