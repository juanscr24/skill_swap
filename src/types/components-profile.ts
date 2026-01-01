// Props para componentes de perfil

export interface ProfileHeaderProps {
  name: string | null
  image: string | null
  city: string | null
  role: string | null
}

export interface MentorProfileHeaderProps {
  name: string | null
  image: string | null
  city: string | null
  rating: number
  totalReviews: number
}

export interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export interface MentorStatsProps {
  hoursTeaching: number
  studentsHelped: number
  rating: number
  totalReviews: number
}

export interface SocialLinksProps {
  links: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
}

export interface SkillsSectionProps {
  skills: Array<{
    id: string
    name: string
    level?: string | null
    description?: string | null
  }>
  wantedSkills?: Array<{
    id: string
    name: string
  }>
}

export interface MentorSkillsSectionProps {
  skills: Array<{
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
  availability: Record<string, string[]>
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
}

export interface MentorReviewsSectionProps {
  reviews: Array<{
    id: string
    rating: number
    comment: string | null
    created_at: Date
    author: {
      name: string | null
      image: string | null
    } | null
  }>
}

export interface SimilarMentor {
  id: string
  name: string | null
  image: string | null
  rating: number
  skills: Array<{ name: string }>
}

export interface MentorSimilarProfilesProps {
  mentorId: string
}

export interface MentorAvailabilityProps {
  mentorId: string
  onBookSession?: (slotId: string) => void
}
