'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Skill {
  id: string
  name: string
  description: string | null
  level: string | null
  created_at: Date
}

interface WantedSkill {
  id: string
  name: string
  created_at: Date
}

export function useSkills() {
  const { data: session, status } = useSession()
  const [skills, setSkills] = useState<Skill[]>([])
  const [wantedSkills, setWantedSkills] = useState<WantedSkill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSkills = async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const [skillsRes, wantedRes] = await Promise.all([
        fetch('/api/skills'),
        fetch('/api/skills/wanted'),
      ])

      if (!skillsRes.ok || !wantedRes.ok) {
        throw new Error('Error al cargar las skills')
      }

      const [skillsData, wantedData] = await Promise.all([
        skillsRes.json(),
        wantedRes.json(),
      ])

      setSkills(skillsData)
      setWantedSkills(wantedData)
    } catch (err: any) {
      console.error('Error fetching skills:', err)
      setError(err.message || 'Error al cargar las skills')
    } finally {
      setIsLoading(false)
    }
  }

  const addSkill = async (data: {
    name: string
    description?: string
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  }) => {
    try {
      setError(null)

      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Error al crear la skill')
      }

      const newSkill = await response.json()
      setSkills([...skills, newSkill])

      return { success: true, data: newSkill }
    } catch (err: any) {
      console.error('Error adding skill:', err)
      setError(err.message || 'Error al crear la skill')
      return { success: false, error: err.message }
    }
  }

  const deleteSkill = async (skillId: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/skills?id=${skillId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la skill')
      }

      setSkills(skills.filter((s) => s.id !== skillId))

      return { success: true }
    } catch (err: any) {
      console.error('Error deleting skill:', err)
      setError(err.message || 'Error al eliminar la skill')
      return { success: false, error: err.message }
    }
  }

  const addWantedSkill = async (name: string) => {
    try {
      setError(null)

      const response = await fetch('/api/skills/wanted', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error('Error al crear la wanted skill')
      }

      const newWantedSkill = await response.json()
      setWantedSkills([...wantedSkills, newWantedSkill])

      return { success: true, data: newWantedSkill }
    } catch (err: any) {
      console.error('Error adding wanted skill:', err)
      setError(err.message || 'Error al crear la wanted skill')
      return { success: false, error: err.message }
    }
  }

  const deleteWantedSkill = async (wantedSkillId: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/skills/wanted?id=${wantedSkillId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la wanted skill')
      }

      setWantedSkills(wantedSkills.filter((s) => s.id !== wantedSkillId))

      return { success: true }
    } catch (err: any) {
      console.error('Error deleting wanted skill:', err)
      setError(err.message || 'Error al eliminar la wanted skill')
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [status])

  return {
    skills,
    wantedSkills,
    isLoading,
    error,
    addSkill,
    deleteSkill,
    addWantedSkill,
    deleteWantedSkill,
    refetch: fetchSkills,
  }
}
