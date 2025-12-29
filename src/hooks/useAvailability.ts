import { useState, useEffect } from 'react'
import { MentorAvailability } from '@/types/models'

export function useAvailability(mentorId?: string) {
  const [availability, setAvailability] = useState<MentorAvailability[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAvailability = async (includeBooked = false) => {
    if (!mentorId) {
      setAvailability([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (includeBooked) params.append('includeBooked', 'true')

      const response = await fetch(
        `/api/availability/mentor/${mentorId}?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch availability')
      }

      const data = await response.json()
      setAvailability(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (mentorId) {
      fetchAvailability()
    } else {
      setAvailability([])
      setIsLoading(false)
    }
  }, [mentorId])

  const addAvailability = async (
    date: Date,
    startTime: string,
    endTime: string
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date.toISOString(),
          start_time: startTime,
          end_time: endTime,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add availability')
      }

      const newAvailability = await response.json()
      setAvailability((prev) => [...prev, newAvailability])
      return newAvailability
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAvailability = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/availability/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete availability')
      }

      setAvailability((prev) => prev.filter((a) => a.id !== id))
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const refresh = () => {
    fetchAvailability()
  }

  return {
    availability,
    isLoading,
    error,
    addAvailability,
    deleteAvailability,
    refresh,
  }
}
