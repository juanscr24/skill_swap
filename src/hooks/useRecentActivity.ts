'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import type { RecentActivity } from '@/types/dashboard'

export function useRecentActivity() {
  const { data: session, status } = useSession()
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/dashboard/activity')

      if (!response.ok) {
        throw new Error('Error al cargar actividad reciente')
      }

      const data = await response.json()
      setActivities(data)
    } catch (err: any) {
      console.error('Error fetching activities:', err)
      setError(err.message || 'Error al cargar actividad reciente')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [status])

  return {
    activities,
    isLoading,
    error,
    refetch: fetchActivities,
  }
}
