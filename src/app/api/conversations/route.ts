import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrCreateConversation, getUserConversations } from '@/features/chat/services'
import { withErrorHandler, ApiError } from '@/shared/utils/api-handler'

// GET - Obtener todas las conversaciones del usuario
export async function GET() {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new ApiError('No autorizado', 401)
    }

    const conversations = await getUserConversations(session.user.id)

    return NextResponse.json(conversations)
  })
}

// POST - Crear o obtener conversación con otro usuario
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new ApiError('No autorizado', 401)
    }

    const { otherUserId } = await request.json()

    if (!otherUserId) {
      throw new ApiError('otherUserId es requerido', 400)
    }

    const conversationId = await getOrCreateConversation(
      session.user.id,
      otherUserId
    )

    return NextResponse.json({ conversationId })
  })
}
