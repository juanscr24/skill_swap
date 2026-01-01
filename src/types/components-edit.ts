// Props para componentes de edición de perfil

import type { Skill, Language } from './models'

export interface EditAboutMeSectionProps {
  profile: {
    name: string | null
    title?: string | null
    city?: string | null
    bio?: string | null
    image?: string | null
    image_public_id?: string | null
  }
  onUpdate: (data: Partial<EditAboutMeSectionProps['profile']>) => Promise<{ success: boolean }>
}

export interface EditSkillsSectionProps {
  skills: Skill[]
  wantedSkills: Skill[]
  onAddSkill: (data: { name: string; description?: string; level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' }) => Promise<{ success: boolean; data?: any; error?: string }>
  onDeleteSkill: (skillId: string) => Promise<{ success: boolean }>
  onAddWantedSkill: (name: string) => Promise<{ success: boolean }>
  onDeleteWantedSkill: (skillId: string) => Promise<{ success: boolean }>
}

export interface EditLanguagesSectionProps {
  languages: Language[]
  onAddLanguage: (data: { name: string; level: string }) => Promise<{ success: boolean }>
  onDeleteLanguage: (languageId: string) => Promise<{ success: boolean }>
}
