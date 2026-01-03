'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

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

export function useReviews(targetUserId?: string) {
  const { data: session, status } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async (userId: string) => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/reviews?targetId=${userId}`)

      if (!response.ok) {
        throw new Error('Error al cargar reseñas')
      }

      const data = await response.json()
      setReviews(data)
    } catch (err: any) {
      console.error('Error fetching reviews:', err)
      setError(err.message || 'Error al cargar reseñas')
    } finally {
      setIsLoading(false)
    }
  }

  const createReview = async (targetId: string, rating: number, comment?: string) => {
    try {
      setError(null)

      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetId, rating, comment }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear reseña')
      }

      const rawReview = await response.json()
      
      // Transformar la estructura para que coincida con la esperada
      const transformedReview = {
        id: rawReview.id,
        rating: rawReview.rating,
        comment: rawReview.comment,
        created_at: rawReview.created_at,
        author: rawReview.users_reviews_author_idTousers || null
      }

      // Agregar la nueva reseña a la lista local
      setReviews((prev) => [transformedReview, ...prev])

      return { success: true, review: transformedReview }
    } catch (err: any) {
      console.error('Error creating review:', err)
      setError(err.message || 'Error al crear reseña')
      return { success: false, error: err.message }
    }
  }

  const deleteReview = async (reviewId: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al eliminar reseña')
      }

      // Eliminar la reseña de la lista local
      setReviews((prev) => prev.filter((review) => review.id !== reviewId))

      return { success: true }
    } catch (err: any) {
      console.error('Error deleting review:', err)
      setError(err.message || 'Error al eliminar reseña')
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    if (targetUserId) {
      fetchReviews(targetUserId)
    } else if (session?.user?.id) {
      // Si no se proporciona un targetUserId, cargar las reseñas del usuario actual
      fetchReviews(session.user.id)
    }
  }, [status, targetUserId, session?.user?.id])

  return {
    reviews,
    isLoading,
    error,
    createReview,
    deleteReview,
    refetch: targetUserId ? () => fetchReviews(targetUserId) : undefined,
  }
}
