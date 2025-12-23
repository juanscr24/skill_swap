import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { requestsService } from '@/services'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const requests = await requestsService.getAcceptedRequests(session.user.id)

    return NextResponse.json(requests)
  } catch (error: any) {
    console.error('Error al obtener solicitudes aceptadas:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener solicitudes aceptadas' },
      { status: 500 }
    )
  }
}
