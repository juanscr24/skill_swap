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
  // Query optimizado: buscar conversación con ambos usuarios directamente
  const existingConversation = await prisma.conversations.findFirst({
    where: {
      AND: [
        {
          participants: {
            some: {
              user_id: userId1,
            },
          },
        },
        {
          participants: {
            some: {
              user_id: userId2,
            },
          },
        },
      ],
    },
    select: {
      id: true,
    },
  })

  // Si ya existe, retornar su ID
  if (existingConversation) {
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
    select: {
      id: true,
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
        select: {
          id: true,
          conversation_id: true,
          sender_id: true,
          content: true,
          created_at: true,
        },
      },
    },
    orderBy: {
      updated_at: 'desc',
    },
  })

  // Calcular unreadCount para cada conversación
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      // Encontrar el participante actual y el otro participante
      const currentParticipant = conv.participants.find((p) => p.user_id === userId)
      const otherParticipant = conv.participants.find((p) => p.user_id !== userId)

      // Contar mensajes no leídos (después del last_read_at del usuario actual)
      const unreadCount = await prisma.messages.count({
        where: {
          conversation_id: conv.id,
          sender_id: {
            not: userId, // Solo mensajes del otro usuario
          },
          created_at: {
            gt: currentParticipant?.last_read_at || new Date(0), // Mensajes después de last_read_at
          },
        },
      })

      return {
        id: conv.id,
        created_at: conv.created_at.toISOString(),
        updated_at: conv.updated_at.toISOString(),
        last_message_at: conv.last_message_at?.toISOString() || null,
        participants: [], // No necesitamos devolver todos los participantes
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
        unreadCount,
      }
    })
  )

  return conversationsWithUnread
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
