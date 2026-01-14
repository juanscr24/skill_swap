import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Eliminar todas las sesiones del usuario excepto la actual
    const currentSessionToken = request.cookies.get('next-auth.session-token')?.value ||
                               request.cookies.get('__Secure-next-auth.session-token')?.value

    if (currentSessionToken) {
      await prisma.account_sessions.deleteMany({
        where: {
          user_id: userId,
          NOT: {
            session_token: currentSessionToken
          }
        }
      })
    } else {
      // Si no hay token actual, eliminar todas
      await prisma.account_sessions.deleteMany({
        where: {
          user_id: userId
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Todas las sesiones han sido cerradas'
    })
  } catch (error) {
    console.error('Error en POST /api/settings/close-sessions:', error)
    return NextResponse.json(
      { error: 'Error al cerrar las sesiones' },
      { status: 500 }
    )
  }
}
