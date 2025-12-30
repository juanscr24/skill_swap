import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserConversations, getOrCreateConversation } from '@/services/conversations'

// GET - Obtener todas las conversaciones del usuario
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const conversations = await getUserConversations(session.user.id)

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Error al obtener conversaciones' },
      { status: 500 }
    )
  }
}

// POST - Crear o obtener conversación con otro usuario
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { otherUserId } = await request.json()

    if (!otherUserId) {
      return NextResponse.json(
        { error: 'otherUserId es requerido' },
        { status: 400 }
      )
    }

    const conversationId = await getOrCreateConversation(
      session.user.id,
      otherUserId
    )

    return NextResponse.json({ conversationId })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Error al crear conversación' },
      { status: 500 }
    )
  }
}
