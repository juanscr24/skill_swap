'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: Date
  users_reviews_author_idTousers: {
    id: string
    name: string | null
    image: string | null
  } | null
}

interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  city: string | null
  role: string
  skills: Array<{
    id: string
    name: string
    description: string | null
    level: string | null
  }>
  wanted_skills: Array<{
    id: string
    name: string
  }>
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export function useUserProfile(userId: string) {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (status !== 'authenticated' || !userId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/users/${userId}`)

      if (!response.ok) {
        throw new Error('Error al cargar el perfil')
      }

      const data = await response.json()
      setProfile(data)
    } catch (err: any) {
      console.error('Error fetching profile:', err)
      setError(err.message || 'Error al cargar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [status, userId])

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  }
}

// Hook para crear una review
export function useCreateReview() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createReview = async (data: {
    targetId: string
    rating: number
    comment: string
  }) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear la review')
      }

      return result
    } catch (err: any) {
      console.error('Error creating review:', err)
      setError(err.message || 'Error al crear la review')
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    createReview,
    isSubmitting,
    error,
  }
}
