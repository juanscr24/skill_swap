// Tipos para servicios de usuario

export interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
  website?: string
}

export interface UserAvailability {
  monday?: string[]
  tuesday?: string[]
  wednesday?: string[]
  thursday?: string[]
  friday?: string[]
  saturday?: string[]
  sunday?: string[]
}

export interface UpdateUserProfileData {
  name?: string
  bio?: string
  city?: string
  image?: string
  image_public_id?: string
  title?: string
  social_links?: SocialLinks
  availability?: UserAvailability
}

export interface UserFilters {
  userId?: string
  role?: string
  city?: string
  skill?: string
}

export interface UserWhereClause {
  id?: {
    in?: string[]
    not?: string
  }
  role?: 'USER' | 'MENTOR' | 'STUDENT' | 'ADMIN'
  city?: {
    contains: string
    mode: 'insensitive'
  }
  skills?: {
    some: {
      name: {
        contains: string
        mode: 'insensitive'
      }
    }
  }
  OR?: Array<{
    skills: {
      some: {
        name: {
          equals: string
          mode: 'insensitive'
        }
      }
    }
  }>
  languages?: {
    some: {
      OR: Array<{
        name: {
          equals: string
          mode: 'insensitive'
        }
      }>
    }
  }
}

export interface RatingReview {
  rating: number
}

export interface UserWithReviews {
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
  reviews_reviews_target_idTousers: RatingReview[]
}

export interface MentorWithRating {
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
