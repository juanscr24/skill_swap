// Tipos específicos para Supabase Realtime
export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  delivered_at?: string | null
  read_at?: string | null
}

// Estados del mensaje
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read'

export interface Conversation {
  id: string
  created_at: string
  updated_at: string
  last_message_at: string | null
}

export interface ConversationParticipant {
  id: string
  conversation_id: string
  user_id: string
  joined_at: string
  last_read_at: string | null
}

// Presencia de usuario
export interface UserPresence {
  id: string
  user_id: string
  is_online: boolean
  last_seen: string
  updated_at: string
}

export interface ConversationWithDetails extends Conversation {
  participants: ConversationParticipant[]
  lastMessage?: ChatMessage
  otherUser?: {
    id: string
    name: string | null
    email: string
    image: string | null
    presence?: UserPresence
  }
  unreadCount?: number
}

export interface RealtimeMessage {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: ChatMessage
  old: ChatMessage | null
}
