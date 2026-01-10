'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import type { UserImpact } from '@/types/dashboard'

export function useUserImpact() {
  const { data: session, status } = useSession()
  const [impact, setImpact] = useState<UserImpact | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchImpact = async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/dashboard/impact')

      if (!response.ok) {
        throw new Error('Error al cargar datos de impacto')
      }

      const data = await response.json()
      setImpact(data)
    } catch (err: any) {
      console.error('Error fetching impact:', err)
      setError(err.message || 'Error al cargar datos de impacto')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchImpact()
  }, [status])

  return {
    impact,
    isLoading,
    error,
    refetch: fetchImpact,
  }
}
