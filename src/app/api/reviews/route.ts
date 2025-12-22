import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { reviewsService } from '@/services'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Esquema de validación para crear review
const createReviewSchema = z.object({
  targetId: z.string().uuid('ID de usuario inválido'),
  rating: z.number().int().min(1, 'La calificación debe ser al menos 1').max(5, 'La calificación debe ser máximo 5'),
  comment: z.string().min(1, 'El comentario es obligatorio').max(500, 'El comentario es muy largo'),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const targetId = searchParams.get('targetId')

    if (!targetId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      )
    }

    const reviews = await reviewsService.getUserReviews(targetId)

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error al obtener reseñas:', error)
    return NextResponse.json(
      { error: 'Error al obtener reseñas' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/reviews
 * Crea una nueva review para un usuario
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validar datos
    const validationResult = createReviewSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Datos inválidos', 
          errors: validationResult.error.issues 
        },
        { status: 400 }
      )
    }

    const { targetId, rating, comment } = validationResult.data

    // Verificar que no esté intentando hacer review a sí mismo
    if (targetId === session.user.id) {
      return NextResponse.json(
        { message: 'No puedes hacer una review a ti mismo' },
        { status: 400 }
      )
    }

    // Verificar que el usuario objetivo existe
    const targetUser = await prisma.users.findUnique({
      where: { id: targetId },
    })

    if (!targetUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que existe un match aceptado entre ambos usuarios
    const match = await prisma.matches.findFirst({
      where: {
        status: 'accepted',
        OR: [
          { sender_id: session.user.id, receiver_id: targetId },
          { sender_id: targetId, receiver_id: session.user.id },
        ],
      },
    })

    if (!match) {
      return NextResponse.json(
        { message: 'Solo puedes hacer reviews a usuarios con los que tienes match' },
        { status: 403 }
      )
    }

    // Verificar si ya existe una review de este usuario al target
    const existingReview = await prisma.reviews.findFirst({
      where: {
        author_id: session.user.id,
        target_id: targetId,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { message: 'Ya has hecho una review a este usuario' },
        { status: 400 }
      )
    }

    // Crear la review
    const review = await prisma.reviews.create({
      data: {
        author_id: session.user.id,
        target_id: targetId,
        rating,
        comment,
      },
      include: {
        users_reviews_author_idTousers: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error: any) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { message: error.message || 'Error al crear la review' },
      { status: 500 }
    )
  }
}
