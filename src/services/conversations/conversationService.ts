import { prisma } from '@/lib/prisma'
import type { ConversationWithDetails } from '@/types/chat'

/**
 * Servicio para manejar conversaciones usando Prisma
 * Las conversaciones se gestionan con Prisma, mientras que los mensajes
 * en tiempo real se manejan directamente con Supabase
 */

// Obtener o crear una conversación entre dos usuarios
export async function getOrCreateConversation(
  userId1: string,
  userId2: string
): Promise<string> {
  // Buscar conversación existente
  const existingConversation = await prisma.conversations.findFirst({
    where: {
      participants: {
        every: {
          user_id: {
            in: [userId1, userId2],
          },
        },
      },
    },
    include: {
      participants: true,
    },
  })

  // Si ya existe una conversación entre estos usuarios
  if (
    existingConversation &&
    existingConversation.participants.length === 2
  ) {
    return existingConversation.id
  }

  // Crear nueva conversación con sus participantes
  const newConversation = await prisma.conversations.create({
    data: {
      participants: {
        create: [
          { user_id: userId1 },
          { user_id: userId2 },
        ],
      },
    },
  })

  return newConversation.id
}

// Obtener todas las conversaciones de un usuario con detalles
export async function getUserConversations(
  userId: string
): Promise<ConversationWithDetails[]> {
  const conversations = await prisma.conversations.findMany({
    where: {
      participants: {
        some: {
          user_id: userId,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          created_at: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      updated_at: 'desc',
    },
  })

  // Transformar los datos para incluir el otro usuario y contar no leídos
  return conversations.map((conv) => {
    const currentUserParticipant = conv.participants.find(
      (p) => p.user_id === userId
    )
    const otherParticipant = conv.participants.find((p) => p.user_id !== userId)

    return {
      id: conv.id,
      created_at: conv.created_at.toISOString(),
      updated_at: conv.updated_at.toISOString(),
      last_message_at: conv.last_message_at?.toISOString() || null,
      participants: conv.participants.map((p) => ({
        id: p.id,
        conversation_id: p.conversation_id,
        user_id: p.user_id,
        joined_at: p.joined_at.toISOString(),
        last_read_at: p.last_read_at?.toISOString() || null,
      })),
      lastMessage: conv.messages[0]
        ? {
            id: conv.messages[0].id,
            conversation_id: conv.messages[0].conversation_id,
            sender_id: conv.messages[0].sender_id,
            content: conv.messages[0].content,
            created_at: conv.messages[0].created_at.toISOString(),
          }
        : undefined,
      otherUser: otherParticipant
        ? {
            id: otherParticipant.user.id,
            name: otherParticipant.user.name,
            email: otherParticipant.user.email,
            image: otherParticipant.user.image,
          }
        : undefined,
      // Calcular mensajes no leídos (aproximado, basado en last_read_at)
      unreadCount: 0, // Se puede calcular con una query adicional si es necesario
    }
  })
}

// Obtener detalles de una conversación específica
export async function getConversationById(
  conversationId: string,
  userId: string
) {
  const conversation = await prisma.conversations.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: {
          user_id: userId,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  })

  if (!conversation) return null

  const otherParticipant = conversation.participants.find(
    (p) => p.user_id !== userId
  )

  return {
    ...conversation,
    otherUser: otherParticipant?.user,
  }
}

// Eliminar una conversación
export async function deleteConversation(
  conversationId: string,
  userId: string
) {
  // Verificar que el usuario es parte de la conversación
  const participant = await prisma.conversation_participants.findFirst({
    where: {
      conversation_id: conversationId,
      user_id: userId,
    },
  })

  if (!participant) {
    throw new Error('No autorizado para eliminar esta conversación')
  }

  // Eliminar la conversación (cascade eliminará participantes y mensajes)
  await prisma.conversations.delete({
    where: {
      id: conversationId,
    },
  })
}
