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

    // Contar actividades recientes no leídas de diferentes fuentes
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    // Mensajes no leídos
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
        read_at: null,
        created_at: {
          gte: oneWeekAgo
        }
      }
    })

    // Matches recientes pendientes o aceptados en la última semana
    const recentMatches = await prisma.matches.count({
      where: {
        OR: [
          { receiver_id: userId, status: 'pending' },
          {
            OR: [
              { sender_id: userId },
              { receiver_id: userId }
            ],
            status: 'accepted',
            updated_at: {
              gte: oneWeekAgo
            }
          }
        ]
      }
    })

    // Reviews recientes no leídas
    const recentReviews = await prisma.reviews.count({
      where: {
        target_id: userId,
        created_at: {
          gte: oneWeekAgo
        }
      }
    })

    // Sesiones pendientes o programadas próximas
    const upcomingSessions = await prisma.sessions.count({
      where: {
        OR: [
          { host_id: userId },
          { guest_id: userId }
        ],
        status: {
          in: ['pending', 'scheduled']
        },
        start_at: {
          gte: new Date()
        }
      }
    })

    // Sumar todos los conteos
    const totalCount = unreadMessages + recentMatches + recentReviews + upcomingSessions

    return NextResponse.json({ count: totalCount })
  } catch (error) {
    console.error('Error en GET /api/dashboard/activity/unread-count:', error)
    return NextResponse.json(
      { error: 'Error al obtener el conteo de notificaciones no leídas' },
      { status: 500 }
    )
  }
}
