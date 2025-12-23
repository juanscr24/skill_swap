import { prisma } from '@/lib'

export interface MatchRequest {
  id: string
  senderId: string
  receiverId: string
  skill: string
  status: string | null
  createdAt: Date
  sender: {
    id: string
    name: string | null
    image: string | null
  } | null
  receiver: {
    id: string
    name: string | null
    image: string | null
  } | null
}

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
    })

    return requests.map((r: any) => ({
      id: r.id,
      senderId: r.sender_id || '',
      receiverId: r.receiver_id || '',
      skill: r.skill,
      status: r.status,
      createdAt: r.created_at,
      sender: r.users_matches_sender_idTousers,
      receiver: r.users_matches_receiver_idTousers
    }))
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
    })

    return requests.map((r: any) => ({
      id: r.id,
      senderId: r.sender_id || '',
      receiverId: r.receiver_id || '',
      skill: r.skill,
      status: r.status,
      createdAt: r.created_at,
      sender: r.users_matches_sender_idTousers,
      receiver: r.users_matches_receiver_idTousers
    }))
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
    })

    return requests.map((r: any) => ({
      id: r.id,
      senderId: r.sender_id || '',
      receiverId: r.receiver_id || '',
      skill: r.skill,
      status: r.status,
      createdAt: r.created_at,
      sender: r.users_matches_sender_idTousers,
      receiver: r.users_matches_receiver_idTousers
    }))
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
