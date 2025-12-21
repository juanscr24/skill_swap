import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { reviewsService } from '@/services'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { targetId, rating, comment } = await request.json()

    if (!targetId || !rating) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
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
