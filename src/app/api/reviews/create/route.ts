import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { reviewsService } from '@/features/review/services'

import { createReviewSchema } from '@/features/review/schemas/review.schema'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = createReviewSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.format() },
        { status: 400 }
      )
    }

    const { targetId, rating, comment } = validation.data

    if (targetId === session.user.id) {
      return NextResponse.json(
        { error: 'No puedes reseñarte a ti mismo' },
        { status: 400 }
      )
    }


    const review = await reviewsService.createReview(
      session.user.id,
      targetId,
      rating,
      comment
    )

    return NextResponse.json(review)
  } catch (error: any) {
    console.error('Error al crear reseña:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear reseña' },
      { status: 500 }
    )
  }
}
