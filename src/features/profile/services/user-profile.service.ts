import { prisma } from '@/lib/prisma'
import { UpdateUserProfileData } from '../types'
import { MentorWithRating, UserWhereClause, UserWithReviews } from '@/features/mentor/types'


/**
 * Obtiene el perfil completo de un usuario por ID
 */
export async function getUserProfile(userId: string) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      image_public_id: true,
      bio: true,
      city: true,
      role: true,
      created_at: true,
      updated_at: true,
      email_verified: true,
      title: true,
      social_links: true,
      availability: true,
      // Relaciones
      skills: {
        select: {
          id: true,
          name: true,
          description: true,
          level: true,
        },
      },
      wanted_skills: {
        select: {
          id: true,
          name: true,
        },
      },
      languages: {
        select: {
          id: true,
          name: true,
          level: true,
        },
      },
      reviews_reviews_target_idTousers: {
        select: {
          id: true,
          rating: true,
          comment: true,
          created_at: true,
          users_reviews_author_idTousers: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
      sessions_sessions_host_idTousers: {
        where: {
          status: 'completed',
        },
        select: {
          start_at: true,
          end_at: true,
        },
      },
    },
  })

  if (!user) {
    throw new Error('Usuario no encontrado')
  }

  // Calcular rating promedio
  const reviews = user.reviews_reviews_target_idTousers
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0

  // Transformar reviews para que tengan la estructura esperada por el componente
  const transformedReviews = reviews.map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,
    author: review.users_reviews_author_idTousers
  }))

  return {
    ...user,
    reviews: transformedReviews,
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews: reviews.length,
    // Calculated stats
    totalSessions: user.sessions_sessions_host_idTousers.length,
    totalHours: user.sessions_sessions_host_idTousers.reduce((acc, session) => {
      const duration = (new Date(session.end_at).getTime() - new Date(session.start_at).getTime()) / (1000 * 60 * 60)
      return acc + duration
    }, 0),
  }
}

/**
 * Actualiza el perfil de un usuario
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateUserProfileData
) {
  const updateData: Record<string, unknown> = {
    ...data,
    updated_at: new Date(),
  }

  // Convertir social_links a formato JSON para Prisma
  if (data.social_links) {
    updateData.social_links = data.social_links
  }

  return prisma.users.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      image_public_id: true,
      bio: true,
      city: true,
      role: true,
      title: true,
      social_links: true,
      availability: true,
      updated_at: true,
    },
  })
}

/**
 * Obtiene todos los mentores/usuarios disponibles con los que el usuario tiene match aceptado
 */
export async function getMentors(filterParams?: {
  skill?: string
  skills?: string // Multi-select: "React,Python"
  city?: string
  languages?: string // Multi-select: "English,Spanish"
  minRating?: number
  availability?: 'available' | 'all'
  role?: 'MENTOR' | 'STUDENT' | 'USER'
  userId?: string // ID del usuario actual para filtrar por matches
}) {
  // Si se proporciona userId, filtrar solo usuarios con match aceptado
  if (filterParams?.userId) {
    // Obtener IDs de usuarios con match aceptado
    const matches = await prisma.matches.findMany({
      where: {
        status: 'accepted',
        OR: [
          { sender_id: filterParams.userId },
          { receiver_id: filterParams.userId },
        ],
      },
      select: {
        sender_id: true,
        receiver_id: true,
      },
    })

    // Extraer IDs únicos de los matches
    const matchedUserIds = new Set<string>()
    matches.forEach((match) => {
      if (match.sender_id && match.sender_id !== filterParams.userId) {
        matchedUserIds.add(match.sender_id)
      }
      if (match.receiver_id && match.receiver_id !== filterParams.userId) {
        matchedUserIds.add(match.receiver_id)
      }
    })

    // Si no hay matches, retornar array vacío
    if (matchedUserIds.size === 0) {
      return []
    }

    // Construir filtros
    const where: UserWhereClause = {
      id: {
        in: Array.from(matchedUserIds),
      },
    }

    if (filterParams?.role) {
      where.role = filterParams.role
    }

    if (filterParams?.city) {
      where.city = {
        contains: filterParams.city,
        mode: 'insensitive',
      }
    }

    // Filtro de skills - soporta single y multi-select
    if (filterParams?.skills) {
      // Para multi-select, buscar usuarios que tengan AL MENOS una de estas skills
      const arraySkills = (filterParams.skills as string).split(',').map(s => s.trim())
      where.OR = arraySkills.map((skillName) => ({
        skills: {
          some: {
            name: {
              equals: skillName,
              mode: 'insensitive' as const,
            },
          },
        },
      }))
    } else if (filterParams?.skill) {
      where.skills = {
        some: {
          name: {
            contains: filterParams.skill,
            mode: 'insensitive' as const,
          },
        },
      }
    }

    // Filtro de languages (multi-select)
    if (filterParams?.languages) {
      const arrayLangs = (filterParams.languages as string).split(',').map(l => l.trim())
      where.languages = {
        some: {
          OR: arrayLangs.map((langName) => ({
            name: {
              equals: langName,
              mode: 'insensitive' as const,
            },
          })),
        },
      }
    }

    const users = await prisma.users.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        city: true,
        role: true,
        title: true,
        skills: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true,
          },
          take: 5,
        },
        languages: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        reviews_reviews_target_idTousers: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    // Calcular rating promedio para cada usuario
    const mentorsWithRating = (users as unknown as UserWithReviews[]).map((user): MentorWithRating => {
      const reviews = user.reviews_reviews_target_idTousers || []
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
          : 0

      return {
        ...user,
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: reviews.length,
      }
    })

    // Aplicar filtro de rating mínimo si se especifica
    if (filterParams?.minRating) {
      return mentorsWithRating.filter(
        (mentor) => mentor.averageRating >= filterParams.minRating!
      )
    }

    return mentorsWithRating
  }

  // Lógica original si no se proporciona userId (fallback)
  const where: UserWhereClause = {}

  if (filterParams?.role) {
    where.role = filterParams.role
  }

  if (filterParams?.city) {
    where.city = {
      contains: filterParams.city,
      mode: 'insensitive',
    }
  }

  if (filterParams?.skill) {
    where.skills = {
      some: {
        name: {
          contains: filterParams.skill,
          mode: 'insensitive',
        },
      },
    }
  }

  const users = await prisma.users.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      city: true,
      role: true,
      title: true,
      skills: {
        select: {
          id: true,
          name: true,
          description: true,
          level: true,
        },
        take: 5,
      },
      reviews_reviews_target_idTousers: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  // Calcular rating promedio para cada usuario
  return (users as unknown as UserWithReviews[]).map((user): MentorWithRating => {
    const reviews = user.reviews_reviews_target_idTousers || []
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length
        : 0

    return {
      ...user,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
    }
  })
}

/**
 * Busca usuarios por nombre o email
 */
export async function searchUsers(query: string) {
  return prisma.users.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      city: true,
      role: true,
    },
    take: 20,
  })
}

/**
 * Obtiene las habilidades y ciudades únicas de los mentors del usuario
 * Solo retorna los valores que existen en sus mentors (con match aceptado)
 */
export async function getMentorFiltersOptions(userId: string) {
  // Obtener IDs de usuarios con match aceptado
  const matches = await prisma.matches.findMany({
    where: {
      status: 'accepted',
      OR: [
        { sender_id: userId },
        { receiver_id: userId },
      ],
    },
    select: {
      sender_id: true,
      receiver_id: true,
    },
  })

  // Extraer IDs únicos de los matches
  const matchedUserIds = new Set<string>()
  matches.forEach((match) => {
    if (match.sender_id && match.sender_id !== userId) {
      matchedUserIds.add(match.sender_id)
    }
    if (match.receiver_id && match.receiver_id !== userId) {
      matchedUserIds.add(match.receiver_id)
    }
  })

  // Si no hay matches, retornar arrays vacíos
  if (matchedUserIds.size === 0) {
    return {
      skills: [],
      languages: [],
      cities: [],
    }
  }

  // Obtener usuarios con sus skills, languages y cities
  const mentors = await prisma.users.findMany({
    where: {
      id: {
        in: Array.from(matchedUserIds),
      },
    },
    select: {
      city: true,
      skills: {
        select: {
          id: true,
          name: true,
        },
      },
      languages: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  // Extraer skills únicas
  const skillsMap = new Map<string, { id: string; name: string }>()
  mentors.forEach((mentor) => {
    mentor.skills.forEach((skill) => {
      if (!skillsMap.has(skill.name)) {
        skillsMap.set(skill.name, skill)
      }
    })
  })

  // Extraer languages únicas
  const languagesMap = new Map<string, { id: string; name: string }>()
  mentors.forEach((mentor) => {
    mentor.languages?.forEach((lang) => {
      if (!languagesMap.has(lang.name)) {
        languagesMap.set(lang.name, lang)
      }
    })
  })

  // Extraer ciudades únicas (filtrar nulls)
  const citiesSet = new Set<string>()
  mentors.forEach((mentor) => {
    if (mentor.city) {
      citiesSet.add(mentor.city)
    }
  })

  return {
    skills: Array.from(skillsMap.values()),
    languages: Array.from(languagesMap.values()),
    cities: Array.from(citiesSet).sort(),
  }
}

