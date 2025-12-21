import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import {
  getUserSessions,
  getUpcomingSessions,
  createSession,
  cancelSession,
} from '@/services/sessions'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/sessions
 * Obtiene las sesiones del usuario autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'all' or 'upcoming'

    const sessions =
      type === 'upcoming'
        ? await getUpcomingSessions(session.user.id)
        : await getUserSessions(session.user.id)

    return NextResponse.json(sessions)
  } catch (error: any) {
    console.error('Error getting sessions:', error)
    return NextResponse.json(
      { message: error.message || 'Error al obtener sesiones' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/sessions
 * Crea una nueva sesión
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { guest_id, title, description, start_at, end_at } = body

    if (!guest_id || !title || !start_at || !end_at) {
      return NextResponse.json(
        { message: 'Datos incompletos' },
        { status: 400 }
      )
    }

    const newSession = await createSession({
      host_id: session.user.id,
      guest_id,
      title,
      description,
      start_at: new Date(start_at),
      end_at: new Date(end_at),
    })

    return NextResponse.json(newSession, { status: 201 })
  } catch (error: any) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { message: error.message || 'Error al crear sesión' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/sessions
 * Cancela una sesión
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'El ID de la sesión es requerido' },
        { status: 400 }
      )
    }

    await cancelSession(id, session.user.id)

    return NextResponse.json({ message: 'Sesión cancelada correctamente' })
  } catch (error: any) {
    console.error('Error cancelling session:', error)
    return NextResponse.json(
      { message: error.message || 'Error al cancelar sesión' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/sessions
 * Actualiza el estado de una sesión (aprobar, rechazar, completar)
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, status } = body

    if (!sessionId || !status) {
      return NextResponse.json(
        { message: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // Validar estados permitidos
    const allowedStatuses = ['scheduled', 'completed', 'cancelled', 'rejected']
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Estado no válido' },
        { status: 400 }
      )
    }

    const updatedSession = await prisma.sessions.update({
      where: { id: sessionId },
      data: { status },
    })

    return NextResponse.json(updatedSession)
  } catch (error: any) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { message: error.message || 'Error al actualizar sesión' },
      { status: 500 }
    )
  }
}
