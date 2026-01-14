'use client'

import { useApiQuery } from '@/shared/hooks'
import { useSkillMutations } from './useSkillMutations'

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

/**
 * Hook para obtener las skills y wanted skills del usuario
 * Las mutaciones están en useSkillMutations para evitar duplicación con useProfile
 */
export function useSkills() {
  const skillsQuery = useApiQuery<Skill[]>('skills', '/api/skills', {
    requireAuth: true,
  })

  const wantedSkillsQuery = useApiQuery<WantedSkill[]>(
    'wanted-skills',
    '/api/skills/wanted',
    {
      requireAuth: true,
    }
  )

  // Importar mutations desde el hook dedicado
  const mutations = useSkillMutations()

  return {
    skills: skillsQuery.data ?? [],
    wantedSkills: wantedSkillsQuery.data ?? [],
    isLoading: skillsQuery.isLoading || wantedSkillsQuery.isLoading,
    error: skillsQuery.error || wantedSkillsQuery.error,
    refetch: () => {
      skillsQuery.refetch()
      wantedSkillsQuery.refetch()
    },
    // Re-export mutations for convenience
    ...mutations,
  }
}
