import { UserWithRelations } from '@/shared/types/api.types'

export interface MatchCardProps {
    match: MatchRequest
    onAccept: (id: string) => Promise<void>
    onReject: (id: string) => Promise<void>
}

export interface MatchRequest {
    id: string
    senderId: string
    receiverId: string
    skill: string
    status: string | null
    createdAt: Date
    sender: {
        id: string
        name: string | null
        image: string | null
    } | null
    receiver: {
        id: string
        name: string | null
        image: string | null
    } | null
}

export interface MatchData {
    id: string
    sender_id: string
    receiver_id: string
    skill: string
    status: string | null
    created_at: Date
    sender?: Partial<UserWithRelations>
    receiver?: Partial<UserWithRelations>
}

export interface PrismaMatch {
    id: string
    sender_id: string
    receiver_id: string
    skill: string
    status: string | null
    created_at: Date
    users_matches_sender_idTousers?: {
        id: string
        name: string | null
        image: string | null
    }
    users_matches_receiver_idTousers?: {
        id: string
        name: string | null
        image: string | null
    }
}

export interface PotentialMatch {
    id: string
    name: string | null
    email: string
    image: string | null
    bio: string | null
    city: string | null
    title: string | null
    skills: Array<{
        id: string
        name: string
        level: string | null
    }>
    wantedSkills: Array<{
        id: string
        name: string
    }>
    languages: Array<{
        id: string
        name: string
        level: string | null
    }>
}

export interface MatchRequestView {
    id: string
    senderId: string
    receiverId: string
    skill: string
    status: string | null
    createdAt: Date
    sender: {
        id: string
        name: string | null
        image: string | null
    } | null
    receiver: {
        id: string
        name: string | null
        image: string | null
    } | null
}
