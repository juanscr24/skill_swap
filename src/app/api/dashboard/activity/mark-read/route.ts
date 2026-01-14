import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Marcar todos los mensajes no leídos como leídos
    await prisma.messages.updateMany({
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
      },
      data: {
        read_at: new Date()
      }
    })

    return NextResponse.json({ success: true, message: 'Todas las notificaciones fueron marcadas como leídas' })
  } catch (error) {
    console.error('Error en POST /api/dashboard/activity/mark-read:', error)
    return NextResponse.json(
      { error: 'Error al marcar las notificaciones como leídas' },
      { status: 500 }
    )
  }
}
