import { prisma } from '@/lib'
import type { MessageData, MessageConversation, MessageDetail } from '@/types'

export const messagesService = {
  async getConversations(userId: string): Promise<MessageConversation[]> {
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

    // Transformar a formato esperado por el frontend y deduplicar por userId
    const conversationsMap = new Map<string, MessageConversation>()
    
    for (const conv of conversations) {
      const otherParticipant = conv.participants.find(p => p.user_id !== userId)
      
      // Saltar si no hay otro participante válido
      if (!otherParticipant?.user_id) continue
      
      // Si ya procesamos una conversación con este usuario, mantener la más reciente
      const existingConv = conversationsMap.get(otherParticipant.user_id)
      if (existingConv) {
        const existingDate = new Date(existingConv.lastMessage.createdAt).getTime()
        const currentDate = conv.messages[0]?.created_at.getTime() || 0
        
        // Mantener la conversación con el mensaje más reciente
        if (currentDate <= existingDate) continue
      }
      
      const lastMessage = conv.messages[0]

      conversationsMap.set(otherParticipant.user_id, {
        userId: otherParticipant.user_id,
        userName: otherParticipant.user.name || null,
        userImage: otherParticipant.user.image || null,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.created_at
        } : {
          content: '',
          createdAt: new Date()
        },
        unreadCount: 0
      })
    }

    const conversationsData = Array.from(conversationsMap.values())

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
    
    // Set para evitar agregar el mismo usuario dos veces desde matches
    const addedMatchUserIds = new Set<string>()

    // Agregar matches sin conversación (evitando duplicados)
    for (const match of acceptedMatches) {
      const otherUserId = match.sender_id === userId ? match.receiver_id : match.sender_id
      const otherUser = match.sender_id === userId 
        ? match.users_matches_receiver_idTousers
        : match.users_matches_sender_idTousers

      // Saltar si ya existe conversación o si ya agregamos este usuario
      if (!otherUserId || !otherUser || existingUserIds.has(otherUserId) || addedMatchUserIds.has(otherUserId)) {
        continue
      }

      addedMatchUserIds.add(otherUserId)

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

    // Deduplicar conversationsData por userId por si acaso
    const uniqueConversations = Array.from(
      new Map(conversationsData.map(conv => [conv.userId, conv])).values()
    )

    return uniqueConversations.sort((a, b) => 
      b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime()
    )
  },

  async getMessages(userId: string, otherUserId: string): Promise<MessageDetail[]> {
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

    return conversation.messages.map((m: MessageData) => ({
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

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<MessageDetail> {
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
