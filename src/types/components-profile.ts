// Props para componentes de perfil

export interface ProfileHeaderProps {
  name: string | null
  title?: string | null
  image: string | null
  city: string | null
  role?: string | null
  rating?: number
  totalReviews?: number
}

export interface MentorProfileHeaderProps {
  name: string | null
  title?: string | null
  image: string | null
  city: string | null
  rating: number
  totalReviews: number
  languages?: string[]
  isOnline?: boolean
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
}

export interface StatsCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export interface MentorStatsProps {
  totalSessions: number
  totalHours: number
  totalReviews: number
  averageRating: number
}

export interface SocialLinksProps {
  links: {
    github?: string
    linkedin?: string
    twitter?: string
    instagram?: string
    facebook?: string
    whatsapp?: string
    website?: string
  }
  onUpdate?: (data: { social_links: SocialLinksProps['links'] }) => Promise<void>
}

export interface SkillsSectionProps {
  skillsTeach: Array<{
    id: string
    name: string
    level?: string | null
    description?: string | null
  }>
  skillsLearn: Array<{
    id: string
    name: string
    level?: string | null
    description?: string | null
  }>
  onAddSkill?: (skillName: string) => Promise<void>
  onRemoveSkill?: (skillId: string) => Promise<void>
  onAddWantedSkill?: (skillName: string) => Promise<void>
  onRemoveWantedSkill?: (skillId: string) => Promise<void>
}

export interface MentorSkillsSectionProps {
  skillsTeach: Array<{
    id: string
    name: string
    level?: string | null
    description?: string | null
  }>
  skillsLearn: Array<{
    id: string
    name: string
    level?: string | null
    description?: string | null
  }>
}

export interface LanguagesSectionProps {
  languages: Array<{
    id: string
    name: string
    level: string | null
  }>
}

export interface AvailabilityScheduleProps {
  availability?: Record<string, string>
}

export interface MentorAboutSectionProps {
  bio: string | null
  languages: Array<{
    name: string
    level: string | null
  }>
}

export interface ReviewsChartProps {
  reviews: Array<{
    rating: number
    created_at: Date
  }>
  averageRating: number
  totalReviews: number
}

export interface MentorReviewsSectionProps {
  reviews: Array<{
    id: string
    rating: number
    comment: string | null
    created_at: Date
    author: {
      id: string
      name: string | null
      image: string | null
      title?: string | null
    } | null
  }>
  mentorId: string
  onAddReview: (rating: number, comment: string) => Promise<void>
  onDeleteReview: (reviewId: string) => Promise<void>
  isSubmitting: boolean
}

export interface SimilarMentor {
  id: string
  name: string | null
  image: string | null
  title?: string | null
  averageRating: number
  skills: Array<{ name: string }>
}

export interface MentorSimilarProfilesProps {
  mentorName: string
  similarMentors: SimilarMentor[]
}

export interface MentorAvailabilityProps {
  mentorId: string
  mentorName?: string
  availability?: any
  onBookSession?: (slotId: string) => void
}
