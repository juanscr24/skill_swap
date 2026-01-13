'use client'

import { useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useApiQuery } from '@/shared/hooks'
import { MentorQueryParams, MentorWithRating } from '../types'

/**
 * Hook refactorizado para obtener lista de mentores con filtros
 * Usa React Query para caching automático por filtros
 */
export function useMentors(filters?: MentorQueryParams) {
  const { data: session } = useSession()

  // Construir URL con query params
  const url = useMemo(() => {
    if (!filters) return '/api/users/mentors'

    const params = new URLSearchParams()
    if (filters.skills) params.append('skills', filters.skills)
    if (filters.languages) params.append('languages', filters.languages)
    if (filters.city) params.append('city', filters.city)
    if (filters.minRating) params.append('minRating', filters.minRating.toString())
    if (filters.availability) params.append('availability', filters.availability)

    return `/api/users/mentors${params.toString() ? `?${params.toString()}` : ''}`
  }, [filters])

  // Query con key dinámica basada en filtros
  const queryKey = useMemo(
    () => ['mentors', filters ?? {}],
    [filters]
  )

  const mentorsQuery = useApiQuery<MentorWithRating[]>(queryKey, url, {
    requireAuth: true,
    staleTime: 1000 * 60 * 3, // 3 minutos
  })

  // Filtrar usuario actual de la lista
  const filteredMentors = useMemo(() => {
    if (!mentorsQuery.data) return []
    const currentUserId = session?.user?.id
    return currentUserId
      ? mentorsQuery.data.filter((mentor) => mentor.id !== currentUserId)
      : mentorsQuery.data
  }, [mentorsQuery.data, session?.user?.id])

  return {
    mentors: filteredMentors,
    isLoading: mentorsQuery.isLoading,
    error: mentorsQuery.error,
    refetch: mentorsQuery.refetch,
  }
}
