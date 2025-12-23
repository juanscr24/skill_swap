import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { getUserProfile } from '@/services/users'

/**
 * GET /api/users/[id]
 * Obtiene el perfil público de un usuario con sus reviews
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      )
    }

    const { id: userId } = await params

    if (!userId) {
      return NextResponse.json(
        { message: 'ID de usuario no proporcionado' },
        { status: 400 }
      )
    }

    const profile = await getUserProfile(userId)

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error('Error getting user profile:', error)
    return NextResponse.json(
      { message: error.message || 'Error al obtener el perfil' },
      { status: 500 }
    )
  }
}
