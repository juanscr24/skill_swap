'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useApiQuery, useApiMutation } from '@/shared/hooks'

interface Review {
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

interface CreateReviewData {
  targetId: string
  rating: number
  comment?: string
}

/**
 * Hook refactorizado para manejar reseñas
 * Usa React Query para caching y sincronización automática
 */
export function useReviews(targetUserId?: string) {
  const { data: session } = useSession()
  
  // Determinar el userId a usar
  const userId = targetUserId || session?.user?.id

  // Query para obtener reviews
  const reviewsQuery = useApiQuery<Review[]>(
    ['reviews', userId],
    userId ? `/api/reviews?targetId=${userId}` : null,
    {
      requireAuth: true,
      staleTime: 1000 * 60 * 5, // 5 minutos
      enabled: !!userId,
    }
  )

  // Mutation para crear review
  const createMutation = useApiMutation<any, CreateReviewData>({
    mutationFn: async (data) => {
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear reseña')
      }
      return response.json()
    },
    invalidateKeys: [['reviews', userId], 'profile'],
    optimistic: {
      queryKey: ['reviews', userId],
      updateFn: (old: Review[] = [], newReview: CreateReviewData) => {
        const transformedReview = {
          id: 'temp-' + Date.now(),
          authorId: session?.user?.id || '',
          targetId: newReview.targetId,
          rating: newReview.rating,
          comment: newReview.comment || null,
          createdAt: new Date(),
          author: {
            id: session?.user?.id || '',
            name: session?.user?.name || null,
            image: session?.user?.image || null,
          },
          target: null,
        }
        return [transformedReview, ...old]
      },
    },
  })

  // Mutation para eliminar review
  const deleteMutation = useApiMutation<any, string>({
    mutationFn: async (reviewId) => {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al eliminar reseña')
      }
      return response.json()
    },
    invalidateKeys: [['reviews', userId], 'profile'],
    optimistic: {
      queryKey: ['reviews', userId],
      updateFn: (old: Review[] = [], reviewId: string) =>
        old.filter((review) => review.id !== reviewId),
    },
  })

  return {
    reviews: reviewsQuery.data ?? [],
    isLoading: reviewsQuery.isLoading,
    error: reviewsQuery.error,
    createReview: async (targetId: string, rating: number, comment?: string) => {
      return createMutation.mutateAsync({ targetId, rating, comment })
    },
    deleteReview: deleteMutation.mutateAsync,
    refetch: reviewsQuery.refetch,
  }
}
