// Tipos específicos para Supabase Realtime
export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
}

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

export interface ConversationWithDetails extends Conversation {
  participants: ConversationParticipant[]
  lastMessage?: ChatMessage
  otherUser?: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  unreadCount?: number
}

export interface RealtimeMessage {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: ChatMessage
  old: ChatMessage | null
}
