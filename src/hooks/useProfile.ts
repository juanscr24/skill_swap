'use client'

import { useApiQuery, useApiMutation } from '@/shared/hooks'

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

interface Language {
  id: string
  name: string
  level: string | null
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

export interface UserProfile {
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
  languages: Language[]
  reviews: Review[]
  averageRating: number
  totalReviews: number
  totalSessions: number
  totalHours: number
}

interface UpdateProfileData {
  name?: string
  bio?: string
  city?: string
  image?: string
  image_public_id?: string
  title?: string
  social_links?: any
  availability?: any
}

/**
 * Hook para obtener el perfil del usuario autenticado
 * Usa React Query para caching y sincronización automática
 */
export function useProfile() {
  const query = useApiQuery<UserProfile>('profile', '/api/users/profile', {
    requireAuth: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook para mutaciones del perfil del usuario
 * Separado de useProfile para mejor organización
 */
export function useProfileMutations() {
  const updateProfile = useApiMutation<UserProfile, UpdateProfileData>({
    mutationFn: async (data) => {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Error al actualizar el perfil')
      return response.json()
    },
    invalidateKeys: ['profile'],
  })

  return {
    updateProfile,
  }
}
