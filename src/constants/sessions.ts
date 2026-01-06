// Constants for sessions module

export const SESSION_STATUS = {
  PENDING: 'pending',
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
} as const

export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS]

export const SESSION_STATUS_VARIANTS = {
  [SESSION_STATUS.PENDING]: 'warning',
  [SESSION_STATUS.SCHEDULED]: 'warning',
  [SESSION_STATUS.COMPLETED]: 'success',
  [SESSION_STATUS.CANCELLED]: 'error',
  [SESSION_STATUS.REJECTED]: 'error',
} as const

export const SESSION_DURATION_OPTIONS = [
  { value: '30', label: '30' },
  { value: '40', label: '40' },
  { value: '50', label: '50' },
  { value: '60', label: '60' },
  { value: '90', label: '90' },
  { value: '120', label: '120' },
] as const

export const MIN_SESSION_DURATION = 30
export const DURATION_INCREMENT = 10

export const SESSION_TAB_IDS = {
  AVAILABILITY: 'availability',
  MENTORS_AVAILABILITY: 'mentors-availability',
  PENDING: 'pending',
  UPCOMING: 'upcoming',
  PAST: 'past',
} as const

export type SessionTabId = typeof SESSION_TAB_IDS[keyof typeof SESSION_TAB_IDS]
