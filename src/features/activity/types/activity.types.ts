export interface ActivityFiltersProps {
    filterType: string
    onFilterChange: (type: string) => void
}

export interface ActivityItemProps {
    activity: RecentActivity
}

export interface EmptyActivityStateProps {
    filterType: string
}

export interface RecentActivity {
    id: string
    type: 'message' | 'match' | 'review' | 'session'
    title: string
    description: string
    timestamp: Date
    isRead?: boolean
    user?: {
        id: string
        name: string | null
        image: string | null
    }
    metadata?: {
        rating?: number
        status?: string
    }
}