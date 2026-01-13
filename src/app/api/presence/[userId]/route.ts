import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = params

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const presence = await prisma.user_presence.findUnique({
      where: { user_id: userId },
    })

    if (!presence) {
      // Si no existe, crear una entrada de presencia offline
      const newPresence = await prisma.user_presence.create({
        data: {
          user_id: userId,
          is_online: false,
          last_seen: new Date(),
        },
      })
      return NextResponse.json(newPresence)
    }

    return NextResponse.json(presence)
  } catch (error) {
    console.error('Error fetching user presence:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user presence' },
      { status: 500 }
    )
  }
}
