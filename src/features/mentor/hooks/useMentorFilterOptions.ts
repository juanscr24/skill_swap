'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface MentorFilterOptions {
  skills: Array<{
    id: string
    name: string
  }>
  languages: Array<{
    id: string
    name: string
  }>
  cities: string[]
}

/**
 * Hook para obtener las opciones de filtros disponibles
 * basadas en los mentors reales del usuario
 */
export function useMentorFilterOptions() {
  const { status } = useSession()
  const [options, setOptions] = useState<MentorFilterOptions>({
    skills: [],
    languages: [],
    cities: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOptions = async () => {
      if (status !== 'authenticated') {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/users/mentors/filters')
        
        if (!response.ok) {
          throw new Error('Error al cargar opciones de filtros')
        }

        const data = await response.json()
        setOptions(data)
      } catch (err) {
        console.error('Error fetching filter options:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOptions()
  }, [status])

  return {
    options,
    isLoading,
    error,
  }
}
