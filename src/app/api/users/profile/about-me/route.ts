import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { updateUserProfile } from '@/services/users'

/**
 * PATCH /api/users/profile/about-me
 * Actualiza solo la sección About Me del perfil
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
    const { name, bio, city, image, image_public_id, title } = body

    // Validar que name esté presente
    if (!name || !name.trim()) {
      return NextResponse.json(
        { message: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    const updatedProfile = await updateUserProfile(session.user.id, {
      name,
      bio,
      city,
      image,
      image_public_id,
      title,
    })

    return NextResponse.json(updatedProfile)
  } catch (error: any) {
    console.error('Error updating about me:', error)
    return NextResponse.json(
      { message: error.message || 'Error al actualizar About Me' },
      { status: 500 }
    )
  }
}
