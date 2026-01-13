import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { withErrorHandler, ApiError } from '@/shared/utils/api-handler'

// GET - Obtener mensajes de una conversación
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new ApiError('No autorizado', 401)
    }

    const conversationId = params.id

    // Verificar que el usuario es participante de la conversación
    const participant = await prisma.conversation_participants.findFirst({
      where: {
        conversation_id: conversationId,
        user_id: session.user.id,
      },
    })

    if (!participant) {
      throw new ApiError('No tienes acceso a esta conversación', 403)
    }

    // Obtener mensajes
    const messages = await prisma.messages.findMany({
      where: {
        conversation_id: conversationId,
      },
      orderBy: {
        created_at: 'asc',
      },
    })

    return NextResponse.json(messages)
  })
}
