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
  role?: string
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
}
