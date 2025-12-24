'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

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
  created_at: Date
  updated_at: Date
  skills: Skill[]
  wanted_skills: WantedSkill[]
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export function useProfile() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/users/profile')

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

  const updateProfile = async (data: {
    name?: string
    bio?: string
    city?: string
    image?: string
    image_public_id?: string
  }) => {
    try {
      setError(null)

      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil')
      }

      const updatedData = await response.json()
      
      // Actualizar el perfil local
      if (profile) {
        setProfile({ ...profile, ...updatedData })
      }

      return { success: true, data: updatedData }
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError(err.message || 'Error al actualizar el perfil')
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [status])

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch: fetchProfile,
  }
}
