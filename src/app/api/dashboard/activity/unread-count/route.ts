import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Solo contar mensajes no leídos (son las únicas notificaciones que podemos marcar como leídas)
    const unreadMessages = await prisma.messages.count({
      where: {
        conversation: {
          participants: {
            some: {
              user_id: userId
            }
          }
        },
        NOT: {
          sender_id: userId
        },
        read_at: null
      }
    })

    return NextResponse.json({ count: unreadMessages })
  } catch (error) {
    console.error('Error en GET /api/dashboard/activity/unread-count:', error)
    return NextResponse.json(
      { error: 'Error al obtener el conteo de notificaciones no leídas' },
      { status: 500 }
    )
  }
}
