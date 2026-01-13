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
