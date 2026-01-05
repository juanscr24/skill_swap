'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import type { MentorQueryParams } from '@/types/filters'

interface Mentor {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  city: string | null
  role: string
  skills: Array<{
    id: string
    name: string
    description: string | null
    level: string | null
  }>
  languages?: Array<{
    id: string
    name: string
    level: string | null
  }>
  averageRating: number
  totalReviews: number
}

export function useMentors(filters?: MentorQueryParams) {
  const { data: session, status } = useSession()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMentors = async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Construir query params
      const params = new URLSearchParams()
      
      if (filters?.skills) params.append('skills', filters.skills)
      if (filters?.languages) params.append('languages', filters.languages)
      if (filters?.city) params.append('city', filters.city)
      if (filters?.minRating) params.append('minRating', filters.minRating.toString())
      if (filters?.availability) params.append('availability', filters.availability)

      const url = `/api/users/mentors${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Error al cargar mentores')
      }

      const data = await response.json()
      
      // Filtrar al usuario actual de la lista de mentores
      const currentUserId = session?.user?.id
      const filteredMentors = currentUserId 
        ? data.filter((mentor: Mentor) => mentor.id !== currentUserId)
        : data
      
      setMentors(filteredMentors)
    } catch (err) {
      console.error('Error fetching mentors:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar mentores')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMentors()
  }, [
    status, 
    filters?.skills, 
    filters?.languages, 
    filters?.city, 
    filters?.minRating, 
    filters?.availability
  ])

  return {
    mentors,
    isLoading,
    error,
    refetch: fetchMentors,
  }
}
