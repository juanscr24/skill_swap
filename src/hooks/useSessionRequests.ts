import { useState, useEffect } from 'react'

export function useSessionRequests() {
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPendingRequests = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/sessions/pending')

      if (!response.ok) {
        throw new Error('Failed to fetch pending requests')
      }

      const data = await response.json()
      setRequests(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingRequests()
  }, [])

  const createSessionRequest = async (data: {
    mentor_id: string
    availability_id: string
    title: string
    description?: string
    duration_minutes: number
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/sessions/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create session request')
      }

      const newRequest = await response.json()
      return newRequest
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const acceptRequest = async (sessionId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/sessions/${sessionId}/accept`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to accept request')
      }

      const acceptedSession = await response.json()
      setRequests((prev) => prev.filter((r) => r.id !== sessionId))
      return acceptedSession
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const rejectRequest = async (sessionId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/sessions/${sessionId}/reject`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to reject request')
      }

      setRequests((prev) => prev.filter((r) => r.id !== sessionId))
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const refresh = () => {
    fetchPendingRequests()
  }

  return {
    requests,
    isLoading,
    error,
    createSessionRequest,
    acceptRequest,
    rejectRequest,
    refresh,
  }
}
