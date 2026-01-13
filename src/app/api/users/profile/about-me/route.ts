import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { updateUserProfile } from '@/features/profile/services'
import { withErrorHandler, ApiError } from '@/shared/utils/api-handler'
import { aboutMeSchema } from '@/features/profile/validations/profile.schema'

/**
 * PATCH /api/users/profile/about-me
 * Actualiza solo la sección About Me del perfil
 */
export async function PATCH(request: NextRequest) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new ApiError('No autenticado', 401)
    }

    const body = await request.json()

    // Validar con Zod
    const validatedData = aboutMeSchema.parse(body)

    const updatedProfile = await updateUserProfile(session.user.id, validatedData)

    return NextResponse.json(updatedProfile)
  })
}
