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
    const { messageId } = body

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    // Actualizar mensaje como entregado
    const message = await prisma.messages.update({
      where: { id: messageId },
      data: {
        delivered_at: new Date(),
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error marking message as delivered:', error)
    return NextResponse.json(
      { error: 'Failed to mark message as delivered' },
      { status: 500 }
    )
  }
}
