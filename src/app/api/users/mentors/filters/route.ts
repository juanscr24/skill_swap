import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMentorFiltersOptions } from '@/features/profile/services'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const filterOptions = await getMentorFiltersOptions(session.user.id)

    return NextResponse.json(filterOptions)
  } catch (error) {
    console.error('Error fetching mentor filter options:', error)
    return NextResponse.json(
      { error: 'Error al cargar opciones de filtros' },
      { status: 500 }
    )
  }
}
