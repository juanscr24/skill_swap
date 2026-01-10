import { prisma } from '@/lib'
import type { PrismaMatch, MatchRequest } from '@/types'

const mapMatchToRequest = (match: PrismaMatch): MatchRequest => ({
  id: match.id,
  senderId: match.sender_id || '',
  receiverId: match.receiver_id || '',
  skill: match.skill,
  status: match.status,
  createdAt: match.created_at,
  sender: match.users_matches_sender_idTousers || null,
  receiver: match.users_matches_receiver_idTousers || null
})

export const requestsService = {
  async getReceivedRequests(userId: string): Promise<MatchRequest[]> {
    const requests = await prisma.matches.findMany({
      where: {
        receiver_id: userId,
        status: 'pending' // Solo mostrar pendientes en recibidas
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
        created_at: 'desc'
      }
    }) as PrismaMatch[]

    return requests.map(mapMatchToRequest)
  },

  async getAcceptedRequests(userId: string): Promise<MatchRequest[]> {
    const requests = await prisma.matches.findMany({
      where: {
        status: 'accepted',
        OR: [
          { sender_id: userId },
          { receiver_id: userId }
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
      },
      orderBy: {
        updated_at: 'desc'
      }
    }) as PrismaMatch[]

    return requests.map(mapMatchToRequest)
  },

  async getSentRequests(userId: string): Promise<MatchRequest[]> {
    const requests = await prisma.matches.findMany({
      where: {
        sender_id: userId
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
        created_at: 'desc'
      }
    }) as PrismaMatch[]

    return requests.map(mapMatchToRequest)
  },

  async acceptRequest(requestId: string, userId: string): Promise<void> {
    // Verificar que el usuario es el receptor
    const request = await prisma.matches.findUnique({
      where: { id: requestId }
    })

    if (!request || request.receiver_id !== userId) {
      throw new Error('No autorizado')
    }

    await prisma.matches.update({
      where: { id: requestId },
      data: { status: 'accepted', updated_at: new Date() }
    })
  },

  async rejectRequest(requestId: string, userId: string): Promise<void> {
    // Verificar que el usuario es el receptor
    const request = await prisma.matches.findUnique({
      where: { id: requestId }
    })

    if (!request || request.receiver_id !== userId) {
      throw new Error('No autorizado')
    }

    await prisma.matches.update({
      where: { id: requestId },
      data: { status: 'rejected', updated_at: new Date() }
    })
  },

  async cancelRequest(requestId: string, userId: string): Promise<void> {
    // Verificar que el usuario es el emisor
    const request = await prisma.matches.findUnique({
      where: { id: requestId }
    })

    if (!request || request.sender_id !== userId) {
      throw new Error('No autorizado')
    }

    await prisma.matches.delete({
      where: { id: requestId }
    })
  }
}
