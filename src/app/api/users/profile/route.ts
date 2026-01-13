import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { getUserProfile, updateUserProfile } from '@/features/profile/services'
import { withErrorHandler, ApiError } from '@/shared/utils/api-handler'
import { updateProfileSchema } from '@/features/profile/validations/profile.schema'

/**
 * GET /api/users/profile
 * Obtiene el perfil del usuario autenticado
 */
export async function GET() {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new ApiError('No autenticado', 401)
    }

    const profile = await getUserProfile(session.user.id)

    return NextResponse.json(profile)
  })
}

/**
 * PATCH /api/users/profile
 * Actualiza el perfil del usuario autenticado
 */
export async function PATCH(request: NextRequest) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new ApiError('No autenticado', 401)
    }

    const body = await request.json()

    // Validar con Zod
    const validatedData = updateProfileSchema.parse(body)

    const updatedProfile = await updateUserProfile(session.user.id, validatedData)

    return NextResponse.json(updatedProfile)
  })
}
