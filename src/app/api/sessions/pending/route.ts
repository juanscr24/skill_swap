import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { getPendingRequests } from '@/services/sessions'

/**
 * GET /api/sessions/pending
 * Obtiene solicitudes de sesión pendientes para el mentor
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 })
    }

    const pendingRequests = await getPendingRequests(session.user.id)

    return NextResponse.json(pendingRequests)
  } catch (error: any) {
    console.error('Error getting pending requests:', error)
    return NextResponse.json(
      { message: error.message || 'Error al obtener solicitudes' },
      { status: 500 }
    )
  }
}
