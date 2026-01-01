// Props para componentes de disponibilidad

import { MentorAvailability } from './models'

export interface AvailabilityDisplayProps {
  availability: MentorAvailability[]
  title: string
  emptyMessage: string
}

export interface BookSessionModalProps {
  mentorId: string
  mentorName: string
  availability: MentorAvailability[]
  onClose: () => void
  onSuccess: () => void
  translations: {
    bookSession: string
    selectAvailability: string
    topic: string
    topicPlaceholder: string
    description: string
    descriptionPlaceholder: string
    selectDuration: string
    requestSession: string
    minimumDuration: string
    [key: string]: string
  }
}

export interface PendingRequestsListProps {
  translations: {
    pendingRequests: string
    acceptRequest: string
    rejectRequest: string
    requestAccepted: string
    requestRejected: string
    errorManagingRequest: string
    topic: string
    description: string
    duration: string
    minutes: string
    date: string
    time: string
  }
}
