// Tipos para respuestas API y errores
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Tipos específicos para servicios
export interface UserWithRelations {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  city: string | null
  role: string | null
  title?: string | null
  created_at: Date
  skills?: SkillData[]
  wanted_skills?: WantedSkillData[]
  languages?: LanguageData[]
}

export interface SkillData {
  id: string
  name: string
  description?: string | null
  level?: string | null
}

export interface WantedSkillData {
  id: string
  name: string
}

export interface LanguageData {
  id: string
  name: string
  level: string | null
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

export interface ReviewData {
  id: string
  author_id: string
  target_id: string
  rating: number
  comment: string | null
  created_at: Date
  author?: Partial<UserWithRelations>
  target?: Partial<UserWithRelations>
}

export interface MessageData {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: Date
  sender?: Partial<UserWithRelations>
}

export interface SessionData {
  id: string
  host_id: string
  guest_id: string
  title: string
  description: string | null
  start_at: Date
  end_at: Date
  status: string | null
  created_at: Date
  availability_id: string | null
  host?: Partial<UserWithRelations>
  guest?: Partial<UserWithRelations>
}

export interface ConversationData {
  id: string
  created_at: Date
  updated_at: Date
  last_message_at: Date | null
  participants?: ParticipantData[]
  messages?: MessageData[]
}

export interface ParticipantData {
  id: string
  conversation_id: string
  user_id: string
  joined_at: Date
  last_read_at: Date | null
  user?: Partial<UserWithRelations>
}
