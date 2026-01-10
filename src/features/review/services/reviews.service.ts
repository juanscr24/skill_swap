import { prisma } from '@/lib'
import type { ReviewData, ServiceReview } from '@/types'

const mapReviewData = (review: ReviewData | any): ServiceReview => {
  // Manejar tanto la estructura con 'author' como con 'users_reviews_author_idTousers'
  const authorData = review.author || review.users_reviews_author_idTousers
  const targetData = review.target || review.users_reviews_target_idTousers
  
  return {
    id: review.id,
    authorId: review.author_id || '',
    targetId: review.target_id || '',
    rating: review.rating,
    comment: review.comment,
    createdAt: review.created_at,
    author: authorData && authorData.id ? {
      id: authorData.id,
      name: authorData.name || null,
      image: authorData.image || null
    } : null,
    target: targetData && targetData.id ? {
      id: targetData.id,
      name: targetData.name || null,
      image: targetData.image || null
    } : null
  }
}

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
