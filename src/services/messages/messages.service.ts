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
    // Usar la nueva estructura de conversaciones
    const conversations = await prisma.conversations.findMany({
      where: {
        participants: {
          some: {
            user_id: userId
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        messages: {
          orderBy: {
            created_at: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updated_at: 'desc'
      }
    })

    // Transformar a formato esperado por el frontend
    const conversationsData = conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p.user_id !== userId)
      const lastMessage = conv.messages[0]

      // Contar mensajes no leídos (simplificado)
      const unreadCount = 0 // Se puede calcular si es necesario

      return {
        userId: otherParticipant?.user_id || '',
        userName: otherParticipant?.user.name || null,
        userImage: otherParticipant?.user.image || null,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.created_at
        } : {
          content: '',
          createdAt: new Date()
        },
        unreadCount
      }
    })

    // Agregar matches aceptados que no tienen conversación aún
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

    // Crear un Set con los IDs de usuarios que ya tienen conversación
    const existingUserIds = new Set(conversationsData.map(c => c.userId))

    // Agregar matches sin conversación
    for (const match of acceptedMatches) {
      const otherUserId = match.sender_id === userId ? match.receiver_id : match.sender_id
      const otherUser = match.sender_id === userId 
        ? match.users_matches_receiver_idTousers
        : match.users_matches_sender_idTousers

      if (!otherUserId || !otherUser || existingUserIds.has(otherUserId)) continue

      conversationsData.push({
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

    return conversationsData.sort((a, b) => 
      b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime()
    )
  },

  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    // Buscar conversación entre los dos usuarios
    const conversation = await prisma.conversations.findFirst({
      where: {
        participants: {
          every: {
            user_id: {
              in: [userId, otherUserId]
            }
          }
        }
      },
      include: {
        messages: {
          include: {
            sender: {
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
        }
      }
    })

    if (!conversation) {
      return []
    }

    return conversation.messages.map((m: any) => ({
      id: m.id,
      senderId: m.sender_id || '',
      receiverId: m.sender_id === userId ? otherUserId : userId, // Inferir receiver
      content: m.content,
      read: true, // Simplificado
      createdAt: m.created_at,
      sender: {
        id: m.sender?.id || '',
        name: m.sender?.name || null,
        image: m.sender?.image || null
      }
    }))
  },

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    // Buscar o crear conversación
    let conversation = await prisma.conversations.findFirst({
      where: {
        participants: {
          every: {
            user_id: {
              in: [senderId, receiverId]
            }
          }
        }
      }
    })

    if (!conversation) {
      // Crear nueva conversación
      conversation = await prisma.conversations.create({
        data: {
          participants: {
            create: [
              { user_id: senderId },
              { user_id: receiverId }
            ]
          }
        }
      })
    }

    // Crear mensaje
    const message = await prisma.messages.create({
      data: {
        conversation_id: conversation.id,
        sender_id: senderId,
        content
      },
      include: {
        sender: {
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
      receiverId: receiverId,
      content: message.content,
      read: true,
      createdAt: message.created_at,
      sender: {
        id: message.sender?.id || '',
        name: message.sender?.name || null,
        image: message.sender?.image || null
      }
    }
  },

  async markAsRead(userId: string, otherUserId: string): Promise<void> {
    // Buscar conversación
    const conversation = await prisma.conversations.findFirst({
      where: {
        participants: {
          every: {
            user_id: {
              in: [userId, otherUserId]
            }
          }
        }
      }
    })

    if (!conversation) return

    // Actualizar last_read_at del participante
    await prisma.conversation_participants.updateMany({
      where: {
        conversation_id: conversation.id,
        user_id: userId
      },
      data: {
        last_read_at: new Date()
      }
    })
  }
}
