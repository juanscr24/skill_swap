import { prisma } from '@/lib/prisma'
import { availabilityService } from '@/services/availability'

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
  availability_id?: string
}) {
  return prisma.sessions.create({
    data: {
      host_id: data.host_id,
      guest_id: data.guest_id,
      title: data.title,
      description: data.description,
      start_at: data.start_at,
      end_at: data.end_at,
      availability_id: data.availability_id,
      status: 'pending',
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
 * Crea una solicitud de sesión basada en disponibilidad
 */
export async function createSessionRequest(data: {
  mentor_id: string
  guest_id: string
  availability_id: string
  title: string
  description?: string
  duration_minutes: number
}) {
  // Validate availability exists and is not booked
  const availability = await availabilityService.getAvailabilityById(
    data.availability_id
  )

  if (!availability) {
    throw new Error('Availability not found')
  }

  if (availability.is_booked) {
    throw new Error('This time slot is already booked')
  }

  if (availability.mentor_id !== data.mentor_id) {
    throw new Error('Availability does not belong to this mentor')
  }

  // Validate duration
  if (data.duration_minutes < 30) {
    throw new Error('Minimum duration is 30 minutes')
  }

  if (data.duration_minutes % 10 !== 0) {
    throw new Error('Duration must be in multiples of 10 minutes')
  }

  // Calculate start and end times
  const [startHours, startMinutes] = availability.start_time.split(':').map(Number)
  const startAt = new Date(availability.date)
  startAt.setHours(startHours, startMinutes, 0, 0)

  const endAt = new Date(startAt)
  endAt.setMinutes(endAt.getMinutes() + data.duration_minutes)

  // Validate that end time doesn't exceed availability end time
  const [endHours, endMinutes] = availability.end_time.split(':').map(Number)
  const availabilityEnd = new Date(availability.date)
  availabilityEnd.setHours(endHours, endMinutes, 0, 0)

  if (endAt > availabilityEnd) {
    throw new Error('Session duration exceeds available time')
  }

  // Create session request
  return prisma.sessions.create({
    data: {
      host_id: data.mentor_id,
      guest_id: data.guest_id,
      title: data.title,
      description: data.description,
      start_at: startAt,
      end_at: endAt,
      availability_id: data.availability_id,
      status: 'pending',
    },
    include: {
      users_sessions_host_idTousers: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      users_sessions_guest_idTousers: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
    },
  })
}

/**
 * Obtiene solicitudes pendientes para un mentor
 */
export async function getPendingRequests(mentorId: string) {
  return prisma.sessions.findMany({
    where: {
      host_id: mentorId,
      status: 'pending',
    },
    include: {
      users_sessions_guest_idTousers: {
        select: {
          id: true,
          name: true,
          title: true,
          image: true,
          email: true,
        },
      },
      mentor_availability: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  })
}

/**
 * Acepta una solicitud de sesión
 */
export async function acceptSessionRequest(sessionId: string, mentorId: string) {
  // Verify session exists and belongs to mentor
  const session = await prisma.sessions.findFirst({
    where: {
      id: sessionId,
      host_id: mentorId,
      status: 'pending',
    },
    include: {
      mentor_availability: true,
    },
  })

  if (!session) {
    throw new Error('Session request not found or unauthorized')
  }

  // Reject all other pending requests for the same availability
  if (session.availability_id) {
    await prisma.sessions.updateMany({
      where: {
        availability_id: session.availability_id,
        status: 'pending',
        id: {
          not: sessionId,
        },
      },
      data: {
        status: 'rejected',
      },
    })

    // Mark availability as booked
    await availabilityService.markAsBooked(session.availability_id)
  }

  // Accept the session
  return prisma.sessions.update({
    where: { id: sessionId },
    data: { status: 'scheduled' },
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
 * Rechaza una solicitud de sesión
 */
export async function rejectSessionRequest(sessionId: string, mentorId: string) {
  const session = await prisma.sessions.findFirst({
    where: {
      id: sessionId,
      host_id: mentorId,
      status: 'pending',
    },
  })

  if (!session) {
    throw new Error('Session request not found or unauthorized')
  }

  return prisma.sessions.update({
    where: { id: sessionId },
    data: { status: 'rejected' },
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

  // If session has availability, mark it as available again
  if (session.availability_id) {
    await availabilityService.markAsAvailable(session.availability_id)
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
