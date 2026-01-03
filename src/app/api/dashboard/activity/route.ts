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

    // Obtener actividad reciente del usuario (últimas 2 semanas)
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    // Obtener mensajes recientes
    const recentMessages = await prisma.messages.findMany({
      where: {
        conversation: {
          participants: {
            some: {
              user_id: userId
            }
          }
        },
        created_at: {
          gte: twoWeeksAgo
        },
        NOT: {
          sender_id: userId
        }
      },
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
        created_at: 'desc'
      },
      take: 3
    })

    // Obtener matches recientes
    const recentMatches = await prisma.matches.findMany({
      where: {
        OR: [
          { sender_id: userId },
          { receiver_id: userId }
        ],
        status: 'accepted',
        updated_at: {
          gte: twoWeeksAgo
        }
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
      },
      orderBy: {
        updated_at: 'desc'
      },
      take: 3
    })

    // Obtener reviews recientes
    const recentReviews = await prisma.reviews.findMany({
      where: {
        target_id: userId,
        created_at: {
          gte: twoWeeksAgo
        }
      },
      include: {
        users_reviews_author_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 3
    })

    // Obtener sesiones completadas recientes
    const recentSessions = await prisma.sessions.findMany({
      where: {
        OR: [
          { host_id: userId },
          { guest_id: userId }
        ],
        status: 'completed',
        end_at: {
          gte: twoWeeksAgo
        }
      },
      include: {
        users_sessions_host_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        users_sessions_guest_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        end_at: 'desc'
      },
      take: 3
    })

    // Consolidar todas las actividades
    const activities = [
      ...recentMessages.map(msg => ({
        id: `message-${msg.id}`,
        type: 'message' as const,
        title: 'Nuevo mensaje',
        description: msg.content.substring(0, 100),
        timestamp: msg.created_at,
        user: msg.sender
      })),
      ...recentMatches.map(match => {
        const otherUser = match.sender_id === userId 
          ? match.users_matches_receiver_idTousers
          : match.users_matches_sender_idTousers
        return {
          id: `match-${match.id}`,
          type: 'match' as const,
          title: 'Nuevo match',
          description: `Tienes un nuevo match para ${match.skill}`,
          timestamp: match.updated_at,
          user: otherUser
        }
      }),
      ...recentReviews.map(review => ({
        id: `review-${review.id}`,
        type: 'review' as const,
        title: 'Nueva reseña',
        description: review.comment || 'Recibiste una nueva reseña',
        timestamp: review.created_at,
        user: review.users_reviews_author_idTousers,
        metadata: {
          rating: review.rating
        }
      })),
      ...recentSessions.map(session => {
        const otherUser = session.host_id === userId
          ? session.users_sessions_guest_idTousers
          : session.users_sessions_host_idTousers
        return {
          id: `session-${session.id}`,
          type: 'session' as const,
          title: 'Sesión completada',
          description: session.title,
          timestamp: session.end_at,
          user: otherUser
        }
      })
    ]

    // Ordenar por timestamp y limitar a 10
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const limitedActivities = activities.slice(0, 10)

    return NextResponse.json(limitedActivities)
  } catch (error) {
    console.error('Error al obtener actividad reciente:', error)
    return NextResponse.json(
      { error: 'Error al obtener actividad reciente' },
      { status: 500 }
    )
  }
}
