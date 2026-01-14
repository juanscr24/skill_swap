'use client'

import { useApiQuery, useApiMutation } from '@/shared/hooks'
import { SessionViewData } from '../types'

/**
 * Hook refactorizado para manejar solicitudes de sesión
 * Usa React Query para caching y sincronización automática
 */
export function useSessionRequests() {
  // Query para obtener solicitudes pendientes
  const requestsQuery = useApiQuery<SessionViewData[]>(
    'sessions-pending',
    '/api/sessions/pending',
    { requireAuth: true }
  )

  // Mutation para crear una solicitud de sesión
  const createMutation = useApiMutation<any, {
    mentor_id: string
    availability_id: string
    title: string
    description?: string
    duration_minutes: number
  }>({
    mutationFn: async (data) => {
      const response = await fetch('/api/sessions/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al crear solicitud de sesión')
      }

      return response.json()
    },
    invalidateKeys: ['sessions', 'sessions-pending', 'availability'],
  })

  // Mutation para aceptar solicitud
  const acceptMutation = useApiMutation<any, string>({
    mutationFn: async (sessionId) => {
      const response = await fetch(`/api/sessions/${sessionId}/accept`, {
        method: 'POST',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al aceptar solicitud')
      }
      return response.json()
    },
    invalidateKeys: ['sessions', 'sessions-pending'],
  })

  // Mutation para rechazar solicitud
  const rejectMutation = useApiMutation<any, string>({
    mutationFn: async (sessionId) => {
      const response = await fetch(`/api/sessions/${sessionId}/reject`, {
        method: 'POST',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al rechazar solicitud')
      }
      return response.json()
    },
    invalidateKeys: ['sessions-pending'],
  })

  return {
    requests: requestsQuery.data ?? [],
    isLoading: requestsQuery.isLoading || createMutation.isPending || acceptMutation.isPending || rejectMutation.isPending,
    error: requestsQuery.error || createMutation.error || acceptMutation.error || rejectMutation.error,
    createSessionRequest: createMutation.mutateAsync,
    acceptRequest: acceptMutation.mutateAsync,
    rejectRequest: rejectMutation.mutateAsync,
    refresh: requestsQuery.refetch,
    isCreating: createMutation.isPending,
  }
}
