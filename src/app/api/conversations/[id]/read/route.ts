import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Marcar conversación como leída
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const conversationId = params.id

    // Actualizar last_read_at
    await prisma.conversation_participants.updateMany({
      where: {
        conversation_id: conversationId,
        user_id: session.user.id,
      },
      data: {
        last_read_at: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking as read:', error)
    return NextResponse.json(
      { error: 'Error al marcar como leído' },
      { status: 500 }
    )
  }
}
