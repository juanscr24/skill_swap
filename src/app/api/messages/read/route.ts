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
    const { messageIds } = body

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json({ error: 'Message IDs array is required' }, { status: 400 })
    }

    // Actualizar mensajes como leídos (solo los que no son propios)
    const messages = await prisma.messages.updateMany({
      where: {
        id: { in: messageIds },
        sender_id: { not: session.user.id }, // No marcar nuestros propios mensajes
      },
      data: {
        read_at: new Date(),
        delivered_at: new Date(), // También marcar como entregado si no lo estaba
      },
    })

    return NextResponse.json({ count: messages.count })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    )
  }
}
