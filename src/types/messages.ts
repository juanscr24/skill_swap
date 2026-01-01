// Tipos para el servicio de messages (legacy)

export interface MessageConversation {
  userId: string
  userName: string | null
  userImage: string | null
  lastMessage: {
    content: string
    createdAt: Date
  }
  unreadCount: number
}

export interface MessageDetail {
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
