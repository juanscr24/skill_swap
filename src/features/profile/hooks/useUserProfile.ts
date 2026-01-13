'use client'

import { useApiQuery } from '@/shared/hooks'
import { useCallback } from 'react'

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

export interface UserProfile {
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

/**
 * Hook refactorizado para manejar perfiles de usuario
 * Usa React Query para caching y sincronización automática
 */
export function useUserProfile(userId: string) {
  const query = useApiQuery<UserProfile>(
    ['profile', userId],
    userId ? `/api/users/${userId}` : null,
    {
      requireAuth: true,
      staleTime: 1000 * 60 * 5, // 5 minutos
    }
  )

  // Nota: updateReviews ya no es necesario manejarlo manualmente aquí
  // porque useReviews invalida la clave ['profile', userId] (o 'profile')
  // lo que provoca que este hook vuelva a cargar los datos actualizados.
  // Sin embargo, para compatibilidad con código existente, mantenemos la firma.
  const updateReviews = useCallback(() => {
    query.refetch()
  }, [query])

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ? query.error.message : null,
    refetch: query.refetch,
    updateReviews,
  }
}
