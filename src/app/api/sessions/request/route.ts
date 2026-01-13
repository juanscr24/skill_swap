import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { createSessionRequest } from '@/features/session/services'
import { withErrorHandler, ApiError } from '@/shared/utils/api-handler'
import { sessionRequestSchema } from '@/features/session/validations/session.schema'

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new ApiError('No autenticado', 401)
    }

    const body = await request.json()

    // Validar con Zod
    const validatedData = sessionRequestSchema.parse({
      ...body,
      duration_minutes: typeof body.duration_minutes === 'string'
        ? parseInt(body.duration_minutes)
        : body.duration_minutes
    })

    const sessionRequest = await createSessionRequest({
      mentor_id: validatedData.mentor_id,
      guest_id: session.user.id,
      availability_id: validatedData.availability_id,
      title: validatedData.title,
      description: validatedData.description,
      duration_minutes: validatedData.duration_minutes,
    })

    return NextResponse.json(sessionRequest, { status: 201 })
  })
}
