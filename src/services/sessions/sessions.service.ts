import { prisma } from '@/lib/prisma'

/**
 * Obtiene todas las sesiones de un usuario (como host o guest)
 */
export async function getUserSessions(userId: string) {
  const sessions = await prisma.sessions.findMany({
    where: {
      OR: [{ host_id: userId }, { guest_id: userId }],
    },
    include: {
      users_sessions_host_idTousers: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      users_sessions_guest_idTousers: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      start_at: 'desc',
    },
  })

  return sessions
}

/**
 * Obtiene las próximas sesiones de un usuario
 */
export async function getUpcomingSessions(userId: string) {
  const now = new Date()

  const sessions = await prisma.sessions.findMany({
    where: {
      OR: [{ host_id: userId }, { guest_id: userId }],
      start_at: {
        gte: now,
      },
      status: {
        not: 'cancelled',
      },
    },
    include: {
      users_sessions_host_idTousers: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      users_sessions_guest_idTousers: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      start_at: 'asc',
    },
    take: 5,
  })

  return sessions
}

/**
 * Crea una nueva sesión
 */
export async function createSession(data: {
  host_id: string
  guest_id: string
  title: string
  description?: string
  start_at: Date
  end_at: Date
}) {
  return prisma.sessions.create({
    data: {
      host_id: data.host_id,
      guest_id: data.guest_id,
      title: data.title,
      description: data.description,
      start_at: data.start_at,
      end_at: data.end_at,
      status: 'scheduled',
    },
    include: {
      users_sessions_host_idTousers: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      users_sessions_guest_idTousers: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })
}

/**
 * Actualiza el estado de una sesión
 */
export async function updateSessionStatus(
  sessionId: string,
  status: 'scheduled' | 'completed' | 'cancelled'
) {
  return prisma.sessions.update({
    where: { id: sessionId },
    data: { status },
  })
}

/**
 * Cancela una sesión
 */
export async function cancelSession(sessionId: string, userId: string) {
  // Verificar que el usuario es el host o guest
  const session = await prisma.sessions.findFirst({
    where: {
      id: sessionId,
      OR: [{ host_id: userId }, { guest_id: userId }],
    },
  })

  if (!session) {
    throw new Error('Sesión no encontrada o no tienes permiso para cancelarla')
  }

  return prisma.sessions.update({
    where: { id: sessionId },
    data: { status: 'cancelled' },
  })
}

/**
 * Obtiene estadísticas de sesiones de un usuario
 */
export async function getSessionStats(userId: string) {
  const [asHost, asGuest, completed] = await Promise.all([
    // Sesiones como host
    prisma.sessions.count({
      where: {
        host_id: userId,
        status: 'completed',
      },
    }),
    // Sesiones como guest
    prisma.sessions.count({
      where: {
        guest_id: userId,
        status: 'completed',
      },
    }),
    // Total de sesiones completadas
    prisma.sessions.findMany({
      where: {
        OR: [{ host_id: userId }, { guest_id: userId }],
        status: 'completed',
      },
      select: {
        start_at: true,
        end_at: true,
      },
    }),
  ])

  // Calcular horas totales
  const totalHours = completed.reduce((acc, session) => {
    const duration =
      (new Date(session.end_at).getTime() -
        new Date(session.start_at).getTime()) /
      (1000 * 60 * 60) // Convertir a horas
    return acc + duration
  }, 0)

  return {
    classesGiven: asHost,
    classesTaken: asGuest,
    totalHours: Math.round(totalHours),
    totalCompleted: asHost + asGuest,
  }
}
