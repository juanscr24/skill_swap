'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Skill {
  id: string
  name: string
  level: string | null
}

interface PotentialMatch {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  city: string | null
  title: string | null
  skills: Skill[]
  wantedSkills: Array<{
    id: string
    name: string
  }>
}

export function useMatches() {
  const { data: session, status } = useSession()
  const [matches, setMatches] = useState<PotentialMatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMatches = async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/matches')

      if (!response.ok) {
        throw new Error('Error al cargar matches potenciales')
      }

      const data = await response.json()
      setMatches(data)
    } catch (err: any) {
      console.error('Error fetching matches:', err)
      setError(err.message || 'Error al cargar matches potenciales')
    } finally {
      setIsLoading(false)
    }
  }

  const sendMatchRequest = async (receiverId: string, skill: string) => {
    try {
      setError(null)

      const response = await fetch('/api/matches/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId, skill }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al enviar solicitud')
      }

      const match = await response.json()

      return { success: true, match }
    } catch (err: any) {
      console.error('Error sending match request:', err)
      setError(err.message || 'Error al enviar solicitud')
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [status])

  return {
    matches,
    isLoading,
    error,
    sendMatchRequest,
    refetch: fetchMatches,
  }
}
