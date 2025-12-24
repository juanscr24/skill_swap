'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface DashboardStats {
  classesGiven: number
  classesTaken: number
  totalHours: number
  totalCompleted: number
}

export function useDashboardStats() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/dashboard/stats')

      if (!response.ok) {
        throw new Error('Error al cargar estadísticas')
      }

      const data = await response.json()
      setStats(data)
    } catch (err: any) {
      console.error('Error fetching stats:', err)
      setError(err.message || 'Error al cargar estadísticas')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [status])

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  }
}
