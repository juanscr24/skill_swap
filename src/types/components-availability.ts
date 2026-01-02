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
}
