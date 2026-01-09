'use client'

import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

interface UseApiQueryOptions<T> {
  requireAuth?: boolean
  enabled?: boolean
  staleTime?: number
  gcTime?: number
  refetchInterval?: number
  refetchOnWindowFocus?: boolean
  queryOptions?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn' | 'enabled'>
}

/**
 * Hook genérico para hacer queries a la API con React Query
 * 
 * @param key - Query key (string o array)
 * @param endpoint - URL del endpoint (null para deshabilitar)
 * @param options - Opciones adicionales
 * 
 * @example
 * // Uso básico
 * const { data, isLoading, error } = useApiQuery<UserProfile>(
 *   'profile',
 *   '/api/profile',
 *   { requireAuth: true }
 * )
 * 
 * @example
 * // Con múltiples keys
 * const { data } = useApiQuery<Message[]>(
 *   ['messages', conversationId],
 *   conversationId ? `/api/messages/${conversationId}` : null
 * )
 */
export function useApiQuery<T>(
  key: string | (string | number | null | undefined)[],
  endpoint: string | null,
  options: UseApiQueryOptions<T> = {}
) {
  const { data: session, status } = useSession()

  const {
    requireAuth = false,
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minutos
    gcTime = 1000 * 60 * 30, // 30 minutos
    refetchInterval,
    refetchOnWindowFocus = true,
    queryOptions = {},
  } = options

  const queryKey = Array.isArray(key) ? key : [key]

  // Determinar si la query debe estar habilitada
  const isEnabled =
    enabled &&
    endpoint !== null &&
    (requireAuth ? status === 'authenticated' : true)

  const query = useQuery<T, Error>({
    queryKey,
    queryFn: async () => {
      if (!endpoint) throw new Error('No endpoint provided')

      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`)
      }

      return response.json()
    },
    enabled: isEnabled,
    staleTime,
    gcTime,
    refetchInterval,
    refetchOnWindowFocus,
    ...queryOptions,
  })

  return {
    ...query,
    // Aliases para mantener compatibilidad con código existente
    isLoading: query.isLoading,
    error: query.error,
    data: query.data,
    refetch: query.refetch,
  }
}
