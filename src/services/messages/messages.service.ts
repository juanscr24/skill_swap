import { prisma } from '@/lib'

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

export const messagesService = {
  async getConversations(userId: string): Promise<Conversation[]> {
    // Obtener todos los mensajes donde el usuario participa
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      include: {
        users_messages_sender_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        users_messages_receiver_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Agrupar mensajes por conversación (usuario)
    const conversationsMap = new Map<string, Conversation>()

    for (const message of messages) {
      const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id
      const otherUser = message.sender_id === userId 
        ? message.users_messages_receiver_idTousers
        : message.users_messages_sender_idTousers

      if (!otherUserId || !otherUser) continue

      if (!conversationsMap.has(otherUserId)) {
        // Contar mensajes no leídos del otro usuario hacia este usuario
        const unreadCount = messages.filter(
          (m: any) => m.sender_id === otherUserId && m.receiver_id === userId && !m.read
        ).length

        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUser.name,
          userImage: otherUser.image,
          lastMessage: {
            content: message.content,
            createdAt: message.created_at
          },
          unreadCount
        })
      }
    }

    // Obtener matches aceptados que no tienen mensajes aún
    const acceptedMatches = await prisma.matches.findMany({
      where: {
        OR: [
          { sender_id: userId, status: 'accepted' },
          { receiver_id: userId, status: 'accepted' }
        ]
      },
      include: {
        users_matches_sender_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        users_matches_receiver_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    // Agregar matches aceptados sin mensajes como conversaciones vacías
    for (const match of acceptedMatches) {
      const otherUserId = match.sender_id === userId ? match.receiver_id : match.sender_id
      const otherUser = match.sender_id === userId 
        ? match.users_matches_receiver_idTousers
        : match.users_matches_sender_idTousers

      if (!otherUserId || !otherUser) continue

      // Solo agregar si no existe ya en el map (no hay mensajes)
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUser.name,
          userImage: otherUser.image,
          lastMessage: {
            content: '', // Sin mensajes aún
            createdAt: match.created_at
          },
          unreadCount: 0
        })
      }
    }

    return Array.from(conversationsMap.values()).sort((a, b) => 
      b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime()
    )
  },

  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          { sender_id: userId, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: userId }
        ]
      },
      include: {
        users_messages_sender_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    })

    return messages.map((m: any) => ({
      id: m.id,
      senderId: m.sender_id || '',
      receiverId: m.receiver_id || '',
      content: m.content,
      read: m.read,
      createdAt: m.created_at,
      sender: {
        id: m.users_messages_sender_idTousers?.id || '',
        name: m.users_messages_sender_idTousers?.name || null,
        image: m.users_messages_sender_idTousers?.image || null
      }
    }))
  },

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const message = await prisma.messages.create({
      data: {
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        read: false
      },
      include: {
        users_messages_sender_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return {
      id: message.id,
      senderId: message.sender_id || '',
      receiverId: message.receiver_id || '',
      content: message.content,
      read: message.read,
      createdAt: message.created_at,
      sender: {
        id: message.users_messages_sender_idTousers?.id || '',
        name: message.users_messages_sender_idTousers?.name || null,
        image: message.users_messages_sender_idTousers?.image || null
      }
    }
  },

  async markAsRead(userId: string, otherUserId: string): Promise<void> {
    await prisma.messages.updateMany({
      where: {
        sender_id: otherUserId,
        receiver_id: userId,
        read: false
      },
      data: {
        read: true
      }
    })
  }
}
