'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface MatchRequest {
  id: string
  senderId: string
  receiverId: string
  skill: string
  status: string | null
  createdAt: Date
  sender: {
    id: string
    name: string | null
    image: string | null
  } | null
  receiver: {
    id: string
    name: string | null
    image: string | null
  } | null
}

export function useRequests(type: 'received' | 'sent' = 'received') {
  const { data: session, status } = useSession()
  const [requests, setRequests] = useState<MatchRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const endpoint = type === 'received' ? '/api/matches/received' : '/api/matches/sent'
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error('Error al cargar solicitudes')
      }

      const data = await response.json()
      setRequests(data)
    } catch (err: any) {
      console.error('Error fetching requests:', err)
      setError(err.message || 'Error al cargar solicitudes')
    } finally {
      setIsLoading(false)
    }
  }

  const acceptRequest = async (requestId: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/matches/${requestId}/accept`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Error al aceptar solicitud')
      }

      // Actualizar la lista local
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: 'accepted' } : r
        )
      )

      return { success: true }
    } catch (err: any) {
      console.error('Error accepting request:', err)
      setError(err.message || 'Error al aceptar solicitud')
      return { success: false, error: err.message }
    }
  }

  const rejectRequest = async (requestId: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/matches/${requestId}/reject`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Error al rechazar solicitud')
      }

      // Actualizar la lista local
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: 'rejected' } : r
        )
      )

      return { success: true }
    } catch (err: any) {
      console.error('Error rejecting request:', err)
      setError(err.message || 'Error al rechazar solicitud')
      return { success: false, error: err.message }
    }
  }

  const cancelRequest = async (requestId: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/matches/${requestId}/cancel`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al cancelar solicitud')
      }

      // Eliminar de la lista local
      setRequests((prev) => prev.filter((r) => r.id !== requestId))

      return { success: true }
    } catch (err: any) {
      console.error('Error cancelling request:', err)
      setError(err.message || 'Error al cancelar solicitud')
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [status, type])

  return {
    requests,
    isLoading,
    error,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    refetch: fetchRequests,
  }
}
