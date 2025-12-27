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
  title: string | null
  social_links: {
    linkedin?: string
    github?: string
    website?: string
  } | null
  availability: {
    [key: string]: string // e.g., "mon": "10am - 5pm" or "busy"
  } | null
  skills: Skill[]
  wanted_skills: WantedSkill[]
  reviews: Review[]
  averageRating: number
  totalReviews: number
  totalSessions: number
  totalHours: number
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
    title?: string
    social_links?: any
    availability?: any
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

  const addSkill = async (name: string, level: string = 'intermediate') => {
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, level })
      })
      if (!response.ok) throw new Error('Failed to add skill')
      const newSkill = await response.json()
      if (profile) {
        setProfile({ ...profile, skills: [...profile.skills, newSkill] })
      }
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const removeSkill = async (id: string) => {
    try {
      const response = await fetch(`/api/skills?id=${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to remove skill')
      if (profile) {
        setProfile({ ...profile, skills: profile.skills.filter(s => s.id !== id) })
      }
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const addWantedSkill = async (name: string) => {
    try {
      const response = await fetch('/api/skills/wanted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      if (!response.ok) throw new Error('Failed to add wanted skill')
      const newSkill = await response.json()
      if (profile) {
        setProfile({ ...profile, wanted_skills: [...profile.wanted_skills, newSkill] })
      }
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const removeWantedSkill = async (id: string) => {
    try {
      const response = await fetch(`/api/skills/wanted?id=${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to remove wanted skill')
      if (profile) {
        setProfile({ ...profile, wanted_skills: profile.wanted_skills.filter(s => s.id !== id) })
      }
      return { success: true }
    } catch (err: any) {
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
    addSkill,
    removeSkill,
    addWantedSkill,
    removeWantedSkill,
    refetch: fetchProfile,
  }
}
