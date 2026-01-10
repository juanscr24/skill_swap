import { useState, useEffect } from 'react'
import type { CalendarEvent } from '@/types/calendar'

interface UseCalendarReturn {
  events: CalendarEvent[]
  isLoading: boolean
  error: string | null
  isMentor: boolean
  refetch: (startDate: Date, endDate: Date) => Promise<void>
}

/**
 * Hook to fetch calendar events (availability + sessions)
 * Automatically fetches for the current month on mount
 */
export function useCalendar(
  initialStartDate?: Date,
  initialEndDate?: Date
): UseCalendarReturn {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMentor, setIsMentor] = useState(false)

  const fetchEvents = async (startDate: Date, endDate: Date) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        showAvailability: 'true',
        showSessions: 'true'
      })

      const response = await fetch(`/api/calendar?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch calendar events')
      }

      const data = await response.json()
      
      // Convert date strings back to Date objects
      const eventsWithDates = data.events.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
      }))
      
      setEvents(eventsWithDates)
      setIsMentor(data.isMentor)
    } catch (err: any) {
      setError(err.message || 'Error fetching calendar events')
      console.error('Error fetching calendar:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Default to current month if no dates provided
    const now = new Date()
    const startDate = initialStartDate || new Date(now.getFullYear(), now.getMonth(), 1)
    const endDate = initialEndDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    
    fetchEvents(startDate, endDate)
  }, [])

  return {
    events,
    isLoading,
    error,
    isMentor,
    refetch: fetchEvents
  }
}
