'use client'

import { useState, useEffect } from 'react'

interface Skill {
  id: string
  name: string
  description: string | null
  level: string | null
}

interface WantedSkill {
  id: string
  name: string
}

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: Date
  author: {
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
  image_public_id: string | null
  bio: string | null
  city: string | null
  role: string
  title: string | null
  social_links: {
    linkedin?: string
    github?: string
    website?: string
  } | null
  availability: {
    [key: string]: string
  } | null
  created_at: Date
  updated_at: Date
  email_verified: Date | null
  skills: Skill[]
  wanted_skills: WantedSkill[]
  reviews: Review[]
  averageRating: number
  totalReviews: number
  totalSessions: number
  totalHours: number
}

export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/users/${userId}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Usuario no encontrado')
        }
        if (response.status === 401) {
          throw new Error('No autorizado')
        }
        throw new Error('Error al cargar el perfil')
      }

      const data = await response.json()
      setProfile(data)
    } catch (err: any) {
      console.error('Error fetching user profile:', err)
      setError(err.message || 'Error al cargar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const updateReviews = (reviewOrId: any, isDelete: boolean = false) => {
    if (!profile) return

    if (isDelete) {
      // Eliminar review del estado local
      const reviewId = reviewOrId
      const updatedReviews = profile.reviews.filter(r => r.id !== reviewId)
      setProfile({
        ...profile,
        reviews: updatedReviews,
        totalReviews: updatedReviews.length,
        averageRating: updatedReviews.length > 0 
          ? Number((updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1))
          : 0
      })
    } else {
      // Agregar nueva review al estado local
      const newReview = reviewOrId
      const updatedReviews = [newReview, ...profile.reviews]
      setProfile({
        ...profile,
        reviews: updatedReviews,
        totalReviews: updatedReviews.length,
        averageRating: Number((updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1))
      })
    }
  }

  useEffect(() => {
    if (userId) {
      fetchProfile()
    }
  }, [userId])

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
    updateReviews,
  }
}
