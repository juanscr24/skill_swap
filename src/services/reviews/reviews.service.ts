import { prisma } from '@/lib'
import type { ReviewData, ServiceReview } from '@/types'

const mapReviewData = (review: ReviewData): ServiceReview => ({
  id: review.id,
  authorId: review.author_id || '',
  targetId: review.target_id || '',
  rating: review.rating,
  comment: review.comment,
  createdAt: review.created_at,
  author: review.author && review.author.id ? {
    id: review.author.id,
    name: review.author.name || null,
    image: review.author.image || null
  } : null,
  target: review.target && review.target.id ? {
    id: review.target.id,
    name: review.target.name || null,
    image: review.target.image || null
  } : null
})

export const reviewsService = {
  async getUserReviews(userId: string): Promise<ServiceReview[]> {
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
    }) as ReviewData[]

    return reviews.map(mapReviewData)
  },

  async createReview(
    authorId: string,
    targetId: string,
    rating: number,
    comment?: string
  ): Promise<ServiceReview> {
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
    }) as ReviewData

    return mapReviewData(review)
  }
}
