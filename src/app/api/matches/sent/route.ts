import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { requestsService } from '@/services'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const requests = await requestsService.getSentRequests(session.user.id)

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error al obtener solicitudes enviadas:', error)
    return NextResponse.json(
      { error: 'Error al obtener solicitudes enviadas' },
      { status: 500 }
    )
  }
}
