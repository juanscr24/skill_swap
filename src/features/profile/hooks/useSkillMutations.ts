'use client'

import { useApiMutation, apiMutationHelpers } from '@/shared/hooks'

interface SkillData {
  name: string
  level?: string
  description?: string
}

/**
 * Hook para mutations de skills del usuario
 * Separado de useProfile para evitar duplicación
 */
export function useSkillMutations() {
  const addSkill = useApiMutation({
    ...apiMutationHelpers.post<any, SkillData>('/api/skills'),
    invalidateKeys: ['profile', 'skills'],
  })

  const deleteSkill = useApiMutation({
    ...apiMutationHelpers.delete<void>((id) => `/api/skills?id=${id}`),
    invalidateKeys: ['profile', 'skills'],
    optimistic: {
      queryKey: 'skills',
      updateFn: (old: any[], skillId: string) => old?.filter((s) => s.id !== skillId) || [],
    },
  })

  const addWantedSkill = useApiMutation({
    ...apiMutationHelpers.post<any, { name: string }>('/api/skills/wanted'),
    invalidateKeys: ['profile', 'skills'],
  })

  const deleteWantedSkill = useApiMutation({
    ...apiMutationHelpers.delete<void>((id) => `/api/skills/wanted?id=${id}`),
    invalidateKeys: ['profile', 'skills'],
  })

  return {
    addSkill,
    deleteSkill,
    addWantedSkill,
    deleteWantedSkill,
  }
}
