export interface Review {
    id: string
    author_id: string
    target_id: string
    rating: number
    comment: string | null
    created_at: Date
    author?: {
        id: string
        name: string | null
        image: string | null
    }
    target?: {
        id: string
        name: string | null
        image: string | null
    }
}

export interface ReviewData {
    id: string
    author_id: string
    target_id: string
    rating: number
    comment: string | null
    created_at: Date
}

export interface ServiceReview {
    id: string
    authorId: string
    targetId: string
    rating: number
    comment: string | null
    createdAt: Date
    author: {
        id: string
        name: string | null
        image: string | null
    } | null
    target: {
        id: string
        name: string | null
        image: string | null
    } | null
}
