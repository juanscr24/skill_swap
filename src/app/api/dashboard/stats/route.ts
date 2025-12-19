import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { getSessionStats } from '@/services/sessions'

/**
 * GET /api/dashboard/stats
 * Obtiene las estadísticas del dashboard
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 })
    }

    const stats = await getSessionStats(session.user.id)

    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Error getting dashboard stats:', error)
    return NextResponse.json(
      { message: error.message || 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
