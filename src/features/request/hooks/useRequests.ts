'use client'

import { useMemo } from 'react'
import { useApiQuery, useApiMutation } from '@/shared/hooks'

interface MatchRequest {
  id: string
  senderId: string
  receiverId: string
  skill: string
  status: string | null
  createdAt: Date
  sender: {
    id: string
    name: string | null
    image: string | null
  } | null
  receiver: {
    id: string
    name: string | null
    image: string | null
  } | null
}

/**
 * Hook refactorizado para manejar solicitudes de match
 * Usa React Query para caching y sincronización automática
 */
export function useRequests(type: 'received' | 'sent' | 'accepted' = 'received') {
  // Determinar endpoint basado en tipo
  const endpoint = useMemo(() => {
    switch (type) {
      case 'sent':
        return '/api/matches/sent'
      case 'accepted':
        return '/api/matches/accepted'
      default:
        return '/api/matches/received'
    }
  }, [type])

  // Query para obtener requests
  const requestsQuery = useApiQuery<MatchRequest[]>(
    ['requests', type],
    endpoint,
    {
      requireAuth: true,
      staleTime: 1000 * 60 * 2, // 2 minutos
    }
  )

  // Mutation para aceptar request
  const acceptMutation = useApiMutation<any, string>({
    mutationFn: async (requestId) => {
      const response = await fetch(`/api/matches/${requestId}/accept`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Error al aceptar solicitud')
      return response.json()
    },
    invalidateKeys: [['requests', 'received'], ['requests', 'accepted'], 'sessions'],
    optimistic: {
      queryKey: ['requests', type],
      updateFn: (old: MatchRequest[] = [], requestId: string) =>
        old.map((r) => (r.id === requestId ? { ...r, status: 'accepted' } : r)),
    },
  })

  // Mutation para rechazar request
  const rejectMutation = useApiMutation<any, string>({
    mutationFn: async (requestId) => {
      const response = await fetch(`/api/matches/${requestId}/reject`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Error al rechazar solicitud')
      return response.json()
    },
    invalidateKeys: [['requests', 'received']],
    optimistic: {
      queryKey: ['requests', type],
      updateFn: (old: MatchRequest[] = [], requestId: string) =>
        old.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r)),
    },
  })

  // Mutation para cancelar request
  const cancelMutation = useApiMutation<any, string>({
    mutationFn: async (requestId) => {
      const response = await fetch(`/api/matches/${requestId}/cancel`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Error al cancelar solicitud')
      return response.json()
    },
    invalidateKeys: [['requests', 'sent']],
    optimistic: {
      queryKey: ['requests', type],
      updateFn: (old: MatchRequest[] = [], requestId: string) =>
        old.filter((r) => r.id !== requestId),
    },
  })

  return {
    requests: requestsQuery.data ?? [],
    isLoading: requestsQuery.isLoading,
    error: requestsQuery.error,
    acceptRequest: acceptMutation.mutateAsync,
    rejectRequest: rejectMutation.mutateAsync,
    cancelRequest: cancelMutation.mutateAsync,
    refetch: requestsQuery.refetch,
  }
}
