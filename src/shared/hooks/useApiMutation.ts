'use client'

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query'
import { useCallback } from 'react'

interface UseApiMutationOptions<TData, TVariables> {
  invalidateKeys?: (string | (string | number | null | undefined)[])[]
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: Error, variables: TVariables) => void
  optimistic?: {
    queryKey: string | (string | number | null | undefined)[]
    updateFn: (old: any, variables: TVariables) => any
  }
  mutationOptions?: Omit<
    UseMutationOptions<TData, Error, TVariables>,
    'mutationFn' | 'onSuccess' | 'onError' | 'onMutate'
  >
}

/**
 * Hook genérico para hacer mutaciones a la API con React Query
 * 
 * @param mutationFn - Función que ejecuta la mutación
 * @param options - Opciones adicionales (invalidación, optimistic updates, etc.)
 * 
 * @example
 * // Uso básico
 * const { mutate, isPending } = useApiMutation({
 *   mutationFn: async (data: SkillData) => {
 *     const res = await fetch('/api/skills', {
 *       method: 'POST',
 *       body: JSON.stringify(data),
 *     })
 *     return res.json()
 *   },
 *   invalidateKeys: ['skills', 'profile']
 * })
 * 
 * @example
 * // Con optimistic update
 * const { mutate } = useApiMutation({
 *   mutationFn: deleteSkill,
 *   invalidateKeys: ['skills'],
 *   optimistic: {
 *     queryKey: 'skills',
 *     updateFn: (old, skillId) => old.filter(s => s.id !== skillId)
 *   }
 * })
 */
export function useApiMutation<TData = unknown, TVariables = void>(
  options: {
    mutationFn: (variables: TVariables) => Promise<TData>
  } & UseApiMutationOptions<TData, TVariables>
) {
  const queryClient = useQueryClient()

  const {
    mutationFn,
    invalidateKeys = [],
    onSuccess,
    onError,
    optimistic,
    mutationOptions = {},
  } = options

  const mutation = useMutation<TData, Error, TVariables, { previous?: any } | undefined>({
    mutationFn,

    // Optimistic update
    onMutate: async (variables) => {
      if (optimistic) {
        const queryKey = Array.isArray(optimistic.queryKey)
          ? optimistic.queryKey
          : [optimistic.queryKey]

        // Cancel ongoing queries
        await queryClient.cancelQueries({ queryKey })

        // Snapshot previous value
        const previous = queryClient.getQueryData(queryKey)

        // Optimistically update
        queryClient.setQueryData(queryKey, (old: any) => {
          return optimistic.updateFn(old, variables)
        })

        return { previous }
      }
      return undefined
    },

    // On success
    onSuccess: (data, variables, context) => {
      // Invalidar queries relacionadas
      invalidateKeys.forEach((key) => {
        const queryKey = Array.isArray(key) ? key : [key]
        queryClient.invalidateQueries({ queryKey })
      })

      // Callback personalizado
      onSuccess?.(data, variables)
    },

    // On error
    onError: (error, variables, context) => {
      // Revertir optimistic update
      if (context?.previous && optimistic) {
        const queryKey = Array.isArray(optimistic.queryKey)
          ? optimistic.queryKey
          : [optimistic.queryKey]
        queryClient.setQueryData(queryKey, context.previous)
      }

      // Callback personalizado
      onError?.(error, variables)

      // Log error
      console.error('Mutation error:', error)
    },

    ...mutationOptions,
  })

  // Wrapper para mantener compatibilidad con código que espera { success, error }
  const mutateAsync = useCallback(
    async (variables: TVariables) => {
      try {
        const data = await mutation.mutateAsync(variables)
        return { success: true, data }
      } catch (error: any) {
        return { success: false, error: error.message || 'Error desconocido' }
      }
    },
    [mutation]
  )

  return {
    ...mutation,
    // Alias para compatibilidad
    isPending: mutation.isPending,
    isLoading: mutation.isPending, // Para código legacy
    mutate: mutation.mutate,
    mutateAsync,
  }
}

/**
 * Helper para crear mutaciones HTTP comunes
 */
export const apiMutationHelpers = {
  /**
   * POST request
   */
  post: <TData, TVariables>(endpoint: string) => ({
    mutationFn: async (data: TVariables) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `HTTP ${response.status}`)
      }
      return response.json() as Promise<TData>
    },
  }),

  /**
   * PUT/PATCH request
   */
  update: <TData, TVariables extends { id: string }>(
    endpoint: (id: string) => string,
    method: 'PUT' | 'PATCH' = 'PATCH'
  ) => ({
    mutationFn: async (data: TVariables) => {
      const response = await fetch(endpoint(data.id), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `HTTP ${response.status}`)
      }
      return response.json() as Promise<TData>
    },
  }),

  /**
   * DELETE request
   */
  delete: <TData = void>(endpoint: (id: string) => string) => ({
    mutationFn: async (id: string) => {
      const response = await fetch(endpoint(id), {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `HTTP ${response.status}`)
      }
      return (response.status === 204 ? undefined : response.json()) as Promise<TData>
    },
  }),
}
