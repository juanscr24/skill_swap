import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { matchesService } from '@/services'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const potentialMatches = await matchesService.getPotentialMatches(session.user.id)

    return NextResponse.json(potentialMatches)
  } catch (error) {
    console.error('Error al obtener matches potenciales:', error)
    return NextResponse.json(
      { error: 'Error al obtener matches potenciales' },
      { status: 500 }
    )
  }
}
