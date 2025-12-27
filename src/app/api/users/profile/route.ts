import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { getUserProfile, updateUserProfile } from '@/services/users'

/**
 * GET /api/users/profile
 * Obtiene el perfil del usuario autenticado
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      )
    }

    const profile = await getUserProfile(session.user.id)

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error('Error getting profile:', error)
    return NextResponse.json(
      { message: error.message || 'Error al obtener el perfil' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/users/profile
 * Actualiza el perfil del usuario autenticado
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, bio, city, image, image_public_id, title, social_links, availability } = body

    const updatedProfile = await updateUserProfile(session.user.id, {
      name,
      bio,
      city,
      image,
      image_public_id,
      title,
      social_links,
      availability,
    })

    return NextResponse.json(updatedProfile)
  } catch (error: any) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { message: error.message || 'Error al actualizar el perfil' },
      { status: 500 }
    )
  }
}
