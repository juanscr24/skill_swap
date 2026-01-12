'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { RecentActivity } from '../types/activity.types'

interface UseAllActivityReturn {
  activities: RecentActivity[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useAllActivity(): UseAllActivityReturn {
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

      // Usa el mismo endpoint pero sin límite o con un límite mayor
      const response = await fetch('/api/dashboard/activity?all=true')

      if (!response.ok) {
        throw new Error('Error al cargar toda la actividad')
      }

      const data = await response.json()
      setActivities(data)
    } catch (err: any) {
      console.error('Error fetching all activities:', err)
      setError(err.message || 'Error al cargar toda la actividad')
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
