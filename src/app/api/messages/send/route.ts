import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { messagesService } from '@/services'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { conversationId, receiverId, content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Contenido requerido' },
        { status: 400 }
      )
    }

    // Si viene conversationId, usar la nueva estructura
    if (conversationId) {
      const { prisma } = await import('@/lib/prisma')
      
      // Verificar que el usuario es participante
      const participant = await prisma.conversation_participants.findFirst({
        where: {
          conversation_id: conversationId,
          user_id: session.user.id,
        },
      })

      if (!participant) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 403 }
        )
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
      return NextResponse.json(
        { error: 'receiverId o conversationId requerido' },
        { status: 400 }
      )
    }

    const message = await messagesService.sendMessage(
      session.user.id,
      receiverId,
      content
    )

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error al enviar mensaje:', error)
    return NextResponse.json(
      { error: 'Error al enviar mensaje' },
      { status: 500 }
    )
  }
}
