import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { createSessionRequest } from '@/services/sessions'

/**
 * POST /api/sessions/request
 * Crea una solicitud de sesión basada en disponibilidad del mentor
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { mentor_id, availability_id, title, description, duration_minutes } =
      body

    if (!mentor_id || !availability_id || !title || !duration_minutes) {
      return NextResponse.json(
        { message: 'Datos incompletos' },
        { status: 400 }
      )
    }

    const sessionRequest = await createSessionRequest({
      mentor_id,
      guest_id: session.user.id,
      availability_id,
      title,
      description,
      duration_minutes: parseInt(duration_minutes),
    })

    return NextResponse.json(sessionRequest, { status: 201 })
  } catch (error: any) {
    console.error('Error creating session request:', error)
    return NextResponse.json(
      { message: error.message || 'Error al solicitar sesión' },
      { status: 500 }
    )
  }
}
