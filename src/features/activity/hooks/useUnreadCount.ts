'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface UseUnreadCountReturn {
  unreadCount: number
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useUnreadCount(): UseUnreadCountReturn {
  const { data: session, status } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUnreadCount = async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/dashboard/activity/unread-count')

      if (!response.ok) {
        throw new Error('Error al obtener el conteo de notificaciones no leídas')
      }

      const data = await response.json()
      setUnreadCount(data.count || 0)
    } catch (err: any) {
      console.error('Error fetching unread count:', err)
      setError(err.message || 'Error al obtener el conteo')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
  }, [status])

  return {
    unreadCount,
    isLoading,
    error,
    refetch: fetchUnreadCount
  }
}
