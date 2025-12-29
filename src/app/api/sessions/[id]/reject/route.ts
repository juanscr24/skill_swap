import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { rejectSessionRequest } from '@/services/sessions'

/**
 * POST /api/sessions/[id]/reject
 * Rechaza una solicitud de sesión
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 })
    }

    const { id } = await params

    const rejectedSession = await rejectSessionRequest(id, session.user.id)

    return NextResponse.json(rejectedSession)
  } catch (error: any) {
    console.error('Error rejecting session request:', error)
    return NextResponse.json(
      { message: error.message || 'Error al rechazar solicitud' },
      { status: 500 }
    )
  }
}
