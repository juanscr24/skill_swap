import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { messagesService } from '@/features/chat/services'
import { withErrorHandler, ApiError } from '@/shared/utils/api-handler'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new ApiError('No autenticado', 401)
    }

    const { conversationId, receiverId, content } = await request.json()

    if (!content) {
      throw new ApiError('Contenido requerido', 400)
    }

    // Si viene conversationId, usar la nueva estructura
    if (conversationId) {
      // Verificar que el usuario es participante
      const participant = await prisma.conversation_participants.findFirst({
        where: {
          conversation_id: conversationId,
          user_id: session.user.id,
        },
      })

      if (!participant) {
        throw new ApiError('No autorizado', 403)
      }

      // Crear mensaje
      const message = await prisma.messages.create({
        data: {
          conversation_id: conversationId,
          sender_id: session.user.id,
          content: content.trim(),
        },
      })

      return NextResponse.json(message)
    }

    // Fallback al sistema antiguo con receiverId
    if (!receiverId) {
      throw new ApiError('receiverId o conversationId requerido', 400)
    }

    const message = await messagesService.sendMessage(
      session.user.id,
      receiverId,
      content
    )

    return NextResponse.json(message)
  })
}
