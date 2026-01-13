import { useState, useEffect } from 'react'
import { MentorAvailabilityData } from '@/features/session/types'

export function useMentorsAvailability() {
  const [mentorAvailabilities, setMentorAvailabilities] = useState<MentorAvailabilityData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMentorsAvailability = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/availability/mentors')

      if (!response.ok) {
        throw new Error('Failed to fetch mentors availability')
      }

      const data = await response.json()
      setMentorAvailabilities(data)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching mentors availability:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMentorsAvailability()
  }, [])

  return {
    mentorAvailabilities,
    isLoading,
    error,
    refetch: fetchMentorsAvailability,
  }
}
