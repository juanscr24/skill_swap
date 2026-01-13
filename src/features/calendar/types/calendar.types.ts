/**
 * Unified calendar event type that merges mentor_availability and sessions
 */
export interface CalendarEvent {
    id: string
    type: 'availability' | 'session'
    startDate: Date
    endDate: Date
    title: string
    description?: string
    status?: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'rejected'

    // For availability events
    mentorId?: string
    mentorName?: string
    mentorImage?: string
    isBooked?: boolean

    // For session events
    hostId?: string
    hostName?: string
    hostImage?: string
    guestId?: string
    guestName?: string
    guestImage?: string
    availabilityId?: string
}

/**
 * Raw mentor_availability from Prisma
 */
export interface PrismaMentorAvailability {
    id: string
    mentor_id: string
    date: Date
    start_time: string // "HH:mm"
    end_time: string   // "HH:mm"
    is_booked: boolean
    created_at: Date
    users: {
        id: string
        name: string | null
        image: string | null
    }
}

/**
 * Raw session from Prisma
 */
export interface PrismaSession {
    id: string
    host_id: string | null
    guest_id: string | null
    title: string
    description: string | null
    start_at: Date
    end_at: Date
    status: string | null
    created_at: Date
    availability_id: string | null
    users_sessions_host_idTousers: {
        id: string
        name: string | null
        image: string | null
    } | null
    users_sessions_guest_idTousers: {
        id: string
        name: string | null
        image: string | null
    } | null
}

/**
 * Calendar filter options
 */
export interface CalendarFilters {
    startDate: Date
    endDate: Date
    showAvailability?: boolean
    showSessions?: boolean
    statusFilter?: ('pending' | 'scheduled' | 'completed' | 'cancelled' | 'rejected')[]
}

/**
 * Calendar view mode
 */
export type CalendarViewMode = 'month' | 'week' | 'day'

/**
 * Day cell data for rendering
 */
export interface CalendarDayData {
    date: Date
    isCurrentMonth: boolean
    isToday: boolean
    events: CalendarEvent[]
}
