import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { deleteConversation, getConversationById } from '@/features/chat/services'
import { withErrorHandler, ApiError } from '@/shared/utils/api-handler'

// GET - Obtener una conversación específica
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new ApiError('No autorizado', 401)
    }

    const { id } = await params
    const conversation = await getConversationById(id, session.user.id)

    if (!conversation) {
      throw new ApiError('Conversación no encontrada', 404)
    }

    return NextResponse.json(conversation)
  })
}

// DELETE - Eliminar una conversación
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new ApiError('No autorizado', 401)
    }

    const { id } = await params
    await deleteConversation(id, session.user.id)

    return NextResponse.json({ success: true })
  })
}
