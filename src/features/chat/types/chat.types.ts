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

// Tipo para la lista de conversaciones (Venta de mensajes/Legacy)
export interface Conversation {
    userId: string
    userName: string | null
    userImage: string | null
    lastMessage: {
        content: string
        createdAt: Date
    }
    unreadCount: number
}

// Tipo para mensajes individuales
export interface Message {
    id: string
    senderId: string
    receiverId: string
    content: string
    read: boolean
    createdAt: Date
    sender: {
        id: string
        name: string | null
        image: string | null
    }
}

export interface SendMessageData {
    receiverId: string
    content: string
}

// Tipos para el nuevo sistema de Chat (Realtime)
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

// Conversación detallada para el sistema nuevo
export interface ConversationWithDetails {
    id: string
    participants: ConversationParticipant[]
    lastMessage?: ChatMessage
    otherUser?: {
        id: string
        name: string | null
        email: string
        image: string | null
        presence?: UserPresence
    }
    unreadCount: number
}

export interface RealtimeMessage {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE'
    new: ChatMessage
    old: ChatMessage | null
}

export interface PresenceIndicatorProps {
    isOnline: boolean
    size?: 'sm' | 'md' | 'lg'
    showOffline?: boolean
    className?: string
}
