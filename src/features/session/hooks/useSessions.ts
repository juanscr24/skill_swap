'use client'

import { useMemo } from 'react'
import { useApiQuery, useApiMutation } from '@/shared/hooks'

interface SessionUser {
  id: string
  name: string | null
  image: string | null
}

interface Session {
  id: string
  title: string
  description: string | null
  start_at: Date
  end_at: Date
  status: string | null
  users_sessions_host_idTousers: SessionUser | null
  users_sessions_guest_idTousers: SessionUser | null
}

interface UpdateSessionStatusData {
  sessionId: string
  status: string
}

/**
 * Hook refactorizado para manejar sesiones
 * Usa React Query para caching y sincronización automática
 */
export function useSessions(type: 'all' | 'upcoming' = 'all') {
  // Query para obtener sesiones
  const sessionsQuery = useApiQuery<Session[]>(
    ['sessions', type],
    `/api/sessions?type=${type}`,
    {
      requireAuth: true,
      staleTime: 1000 * 60 * 3, // 3 minutos
    }
  )

  // Mutation para cancelar sesión
  const cancelMutation = useApiMutation<any, string>({
    mutationFn: async (sessionId) => {
      const response = await fetch(`/api/sessions?id=${sessionId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Error al cancelar sesión')
      return response.json()
    },
    invalidateKeys: [['sessions', type], ['sessions', 'all']],
    optimistic: {
      queryKey: ['sessions', type],
      updateFn: (old: Session[] = [], sessionId: string) =>
        old.map((s) => (s.id === sessionId ? { ...s, status: 'cancelled' } : s)),
    },
  })

  // Mutation para actualizar estado de sesión
  const updateStatusMutation = useApiMutation<any, UpdateSessionStatusData>({
    mutationFn: async (data) => {
      const response = await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Error al actualizar sesión')
      return response.json()
    },
    invalidateKeys: [['sessions', type], ['sessions', 'all']],
    optimistic: {
      queryKey: ['sessions', type],
      updateFn: (old: Session[] = [], data: UpdateSessionStatusData) =>
        old.map((s) => (s.id === data.sessionId ? { ...s, status: data.status } : s)),
    },
  })

  return {
    sessions: sessionsQuery.data ?? [],
    isLoading: sessionsQuery.isLoading,
    error: sessionsQuery.error,
    cancelSession: cancelMutation.mutateAsync,
    updateSessionStatus: async (sessionId: string, status: string) => {
      return updateStatusMutation.mutateAsync({ sessionId, status })
    },
    refetch: sessionsQuery.refetch,
  }
}
