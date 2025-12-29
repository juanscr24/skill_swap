'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

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
  averageRating: number
  totalReviews: number
}

export function useMentors(filters?: {
  skill?: string
  city?: string
  role?: 'MENTOR' | 'STUDENT' | 'USER'
}) {
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
      if (filters?.skill) params.append('skill', filters.skill)
      if (filters?.city) params.append('city', filters.city)
      if (filters?.role) params.append('role', filters.role)

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
    } catch (err: any) {
      console.error('Error fetching mentors:', err)
      setError(err.message || 'Error al cargar mentores')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMentors()
  }, [status, filters?.skill, filters?.city, filters?.role])

  return {
    mentors,
    isLoading,
    error,
    refetch: fetchMentors,
  }
}
