// Types for sessions module

export interface SessionUser {
  id: string
  name: string | null
  image: string | null
}

export interface SessionViewData {
  id: string
  title: string
  description: string | null
  start_at: Date
  end_at: Date
  status: string | null
  users_sessions_host_idTousers: SessionUser | null
  users_sessions_guest_idTousers: SessionUser | null
}

export interface SessionCardProps {
  sessionData: SessionViewData
  currentUserId?: string
  onCancel: (id: string) => Promise<{ success: boolean; error?: string }>
  onApprove: (id: string) => Promise<{ success: boolean; error?: string }>
  onReject: (id: string) => Promise<{ success: boolean; error?: string }>
  onComplete: (id: string) => Promise<{ success: boolean; error?: string }>
}

export interface MentorAvailabilityData {
  mentorId: string
  mentorName: string
  mentorImage: string | null
  mentorBio: string | null
  availability: Array<{
    id: string
    date: string | Date
    start_time: string
    end_time: string
    is_booked: boolean
  }>
}

export interface MentorsAvailabilityCalendarProps {
  mentorAvailabilities: MentorAvailabilityData[]
  isLoading: boolean
}
