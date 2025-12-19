import { prisma } from '@/lib/prisma'

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

  return {
    ...user,
    reviews,
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews: reviews.length,
  }
}

/**
 * Actualiza el perfil de un usuario
 */
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string
    bio?: string
    city?: string
    image?: string
    image_public_id?: string
  }
) {
  return prisma.users.update({
    where: { id: userId },
    data: {
      ...data,
      updated_at: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      image_public_id: true,
      bio: true,
      city: true,
      role: true,
      updated_at: true,
    },
  })
}

/**
 * Obtiene todos los mentores/usuarios disponibles
 */
export async function getMentors(filters?: {
  skill?: string
  city?: string
  role?: 'MENTOR' | 'STUDENT' | 'USER'
}) {
  const where: any = {}

  if (filters?.role) {
    where.role = filters.role
  }

  if (filters?.city) {
    where.city = {
      contains: filters.city,
      mode: 'insensitive',
    }
  }

  if (filters?.skill) {
    where.skills = {
      some: {
        name: {
          contains: filters.skill,
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
  return users.map((user) => {
    const reviews = user.reviews_reviews_target_idTousers
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
