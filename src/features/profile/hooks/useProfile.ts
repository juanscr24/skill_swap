'use client'

import { useApiQuery, useApiMutation } from '@/shared/hooks'
import { updateProfile, updateAboutMe } from '../services/profile.api'

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
  name?: string | null
  bio?: string | null
  city?: string | null
  image?: string | null
  image_public_id?: string | null
  title?: string | null
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
  // Mutación general del perfil
  const updateProfileMutation = useApiMutation<UserProfile, UpdateProfileData>({
    mutationFn: updateProfile,
    invalidateKeys: ['profile'],
  })

  // Mutación específica para la sección About Me
  const updateAboutMeMutation = useApiMutation<UserProfile, UpdateProfileData>({
    mutationFn: updateAboutMe,
    invalidateKeys: ['profile'],
  })

  return {
    updateProfile: updateProfileMutation.mutateAsync,
    updateAboutMe: updateAboutMeMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingAboutMe: updateAboutMeMutation.isPending,
    updateProfileError: updateProfileMutation.error,
    updateAboutMeError: updateAboutMeMutation.error,
  }
}
