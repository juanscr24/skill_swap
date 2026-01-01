// Props para componentes UI específicos

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export interface PasswordRequirement {
  label: string
  regex: RegExp
}

export interface PasswordStrengthProps {
  password: string
  show?: boolean
}

export interface SkillSelectorProps {
  onAdd: (skillName: string) => void
  placeholder?: string
}

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export interface MentorCardProps {
  id: string
  name: string
  image?: string | null
  city?: string | null
  bio?: string | null
  averageRating: number
  totalReviews: number
  skills: Array<{ id: string; name: string }>
}
