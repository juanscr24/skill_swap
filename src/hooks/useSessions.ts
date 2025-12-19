'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

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

export function useSessions(type: 'all' | 'upcoming' = 'all') {
  const { data: session, status } = useSession()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSessions = async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/sessions?type=${type}`)

      if (!response.ok) {
        throw new Error('Error al cargar sesiones')
      }

      const data = await response.json()
      setSessions(data)
    } catch (err: any) {
      console.error('Error fetching sessions:', err)
      setError(err.message || 'Error al cargar sesiones')
    } finally {
      setIsLoading(false)
    }
  }

  const cancelSession = async (sessionId: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/sessions?id=${sessionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al cancelar sesión')
      }

      // Actualizar la lista local
      setSessions(
        sessions.map((s) =>
          s.id === sessionId ? { ...s, status: 'cancelled' } : s
        )
      )

      return { success: true }
    } catch (err: any) {
      console.error('Error cancelling session:', err)
      setError(err.message || 'Error al cancelar sesión')
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [status, type])

  return {
    sessions,
    isLoading,
    error,
    cancelSession,
    refetch: fetchSessions,
  }
}
