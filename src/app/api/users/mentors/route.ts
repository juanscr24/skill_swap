import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { getMentors } from '@/services/users'

/**
 * GET /api/users/mentors
 * Obtiene la lista de mentores/usuarios disponibles
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      )
    }

    // Obtener parámetros de búsqueda
    const { searchParams } = new URL(request.url)
    const skill = searchParams.get('skill') || undefined
    const city = searchParams.get('city') || undefined
    const role = searchParams.get('role') as 'MENTOR' | 'STUDENT' | 'USER' | undefined

    const mentors = await getMentors({ skill, city, role })

    // Excluir al usuario actual
    const filteredMentors = mentors.filter(
      (mentor) => mentor.id !== session.user.id
    )

    return NextResponse.json(filteredMentors)
  } catch (error: any) {
    console.error('Error getting mentors:', error)
    return NextResponse.json(
      { message: error.message || 'Error al obtener mentores' },
      { status: 500 }
    )
  }
}
