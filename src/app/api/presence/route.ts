import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { isOnline } = body

    if (typeof isOnline !== 'boolean') {
      return NextResponse.json({ error: 'isOnline must be a boolean' }, { status: 400 })
    }

    // Upsert: crear o actualizar presencia
    const presence = await prisma.user_presence.upsert({
      where: { user_id: session.user.id },
      create: {
        user_id: session.user.id,
        is_online: isOnline,
        last_seen: new Date(),
      },
      update: {
        is_online: isOnline,
        last_seen: new Date(),
        updated_at: new Date(),
      },
    })

    return NextResponse.json(presence)
  } catch (error) {
    console.error('Error updating presence:', error)
    return NextResponse.json(
      { error: 'Failed to update presence' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/presence - Obtener presencia del usuario actual
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const presence = await prisma.user_presence.findUnique({
      where: { user_id: session.user.id },
    })

    if (!presence) {
      return NextResponse.json(
        { error: 'Presence not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(presence)
  } catch (error) {
    console.error('Error fetching presence:', error)
    return NextResponse.json(
      { error: 'Failed to fetch presence' },
      { status: 500 }
    )
  }
}
