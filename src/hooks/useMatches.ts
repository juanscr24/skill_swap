'use client'

import { useApiQuery, useApiMutation, apiMutationHelpers } from '@/shared/hooks'

interface Skill {
  id: string
  name: string
  level: string | null
}

interface PotentialMatch {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  city: string | null
  title: string | null
  skills: Skill[]
  wantedSkills: Array<{
    id: string
    name: string
  }>
  languages: Array<{
    id: string
    name: string
    level: string | null
  }>
}

interface SendMatchRequestData {
  receiverId: string
  skill: string
}

/**
 * Hook refactorizado para manejar matches potenciales
 * Usa React Query para reducir código duplicado
 */
export function useMatches() {
  // Query para obtener matches
  const matchesQuery = useApiQuery<PotentialMatch[]>('matches', '/api/matches', {
    requireAuth: true,
    staleTime: 1000 * 60 * 2, // 2 minutos
  })

  // Mutation para enviar solicitud de match
  const sendRequestMutation = useApiMutation<any, SendMatchRequestData>({
    mutationFn: async (data) => {
      const response = await fetch('/api/matches/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al enviar solicitud')
      }
      return response.json()
    },
    invalidateKeys: ['matches', 'requests'],
  })

  return {
    matches: matchesQuery.data ?? [],
    isLoading: matchesQuery.isLoading,
    error: matchesQuery.error,
    sendMatchRequest: sendRequestMutation.mutateAsync,
    refetch: matchesQuery.refetch,
  }
}
