import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { acceptSessionRequest, rejectSessionRequest } from '@/services/sessions'

/**
 * POST /api/sessions/[id]/accept
 * Acepta una solicitud de sesión
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

    const acceptedSession = await acceptSessionRequest(id, session.user.id)

    return NextResponse.json(acceptedSession)
  } catch (error: any) {
    console.error('Error accepting session request:', error)
    return NextResponse.json(
      { message: error.message || 'Error al aceptar solicitud' },
      { status: 500 }
    )
  }
}
