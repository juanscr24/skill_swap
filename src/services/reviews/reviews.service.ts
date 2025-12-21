import { prisma } from '@/lib'

export interface Review {
  id: string
  authorId: string
  targetId: string
  rating: number
  comment: string | null
  createdAt: Date
  author: {
    id: string
    name: string | null
    image: string | null
  } | null
  target: {
    id: string
    name: string | null
    image: string | null
  } | null
}

export const reviewsService = {
  async getUserReviews(userId: string): Promise<Review[]> {
    const reviews = await prisma.reviews.findMany({
      where: {
        target_id: userId
      },
      include: {
        users_reviews_author_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        users_reviews_target_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return reviews.map((r: any) => ({
      id: r.id,
      authorId: r.author_id || '',
      targetId: r.target_id || '',
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      author: r.users_reviews_author_idTousers,
      target: r.users_reviews_target_idTousers
    }))
  },

  async createReview(
    authorId: string,
    targetId: string,
    rating: number,
    comment?: string
  ): Promise<Review> {
    // Verificar que no existe una review previa del mismo autor al mismo target
    const existingReview = await prisma.reviews.findFirst({
      where: {
        author_id: authorId,
        target_id: targetId
      }
    })

    if (existingReview) {
      throw new Error('Ya has dejado una reseña para este usuario')
    }

    // Validar rating
    if (rating < 1 || rating > 5) {
      throw new Error('La calificación debe estar entre 1 y 5')
    }

    const review = await prisma.reviews.create({
      data: {
        author_id: authorId,
        target_id: targetId,
        rating,
        comment: comment || null
      },
      include: {
        users_reviews_author_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        users_reviews_target_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return {
      id: review.id,
      authorId: review.author_id || '',
      targetId: review.target_id || '',
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      author: review.users_reviews_author_idTousers,
      target: review.users_reviews_target_idTousers
    }
  }
}
