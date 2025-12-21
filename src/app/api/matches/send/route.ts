import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { matchesService } from '@/services'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { receiverId, skill } = await request.json()

    if (!receiverId || !skill) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    const match = await matchesService.sendMatchRequest(
      session.user.id,
      receiverId,
      skill
    )

    return NextResponse.json(match)
  } catch (error: any) {
    console.error('Error al enviar solicitud de match:', error)
    return NextResponse.json(
      { error: error.message || 'Error al enviar solicitud de match' },
      { status: 500 }
    )
  }
}
