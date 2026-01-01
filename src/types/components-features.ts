// Props para componentes de funcionalidades

export interface AvailabilityManagerProps {
  mentorId: string
}

export interface StartChatButtonProps {
  userId: string
  userName?: string
}

export interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export interface UserCardProps {
  user: {
    id: string
    name: string | null
    email?: string | null
    image: string | null
    bio: string | null
    skills?: Array<{ name: string }>
  }
  onViewProfile?: () => void
  onSendRequest?: () => void
}

export interface MatchCardProps {
  user: {
    id: string
    name: string
    image?: string
    city?: string
    title?: string
    bio?: string
    rating?: number
    teachingSkills: string[]
    learningSkills: string[]
    matchPercentage?: number
    yearsExperience?: number
    languages?: string[]
  }
  onAccept: () => void
  onReject: () => void
}

export interface DashboardNavbarProps {
  userName?: string
}
