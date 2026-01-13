import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { prisma } from '@/lib'
import {
  mapAvailabilityToEvent,
  mapSessionToEvent
} from '@/shared/utils/calendarHelpers'
import { PrismaMentorAvailability, PrismaSession } from '@/features/calendar/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const startDateStr = searchParams.get('startDate')
    const endDateStr = searchParams.get('endDate')
    const showAvailability = searchParams.get('showAvailability') !== 'false'
    const showSessions = searchParams.get('showSessions') !== 'false'

    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      )
    }

    const startDate = new Date(startDateStr)
    const endDate = new Date(endDateStr)

    // Fetch user to check role
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const isMentor = user.role === 'MENTOR' || user.role === 'ADMIN'
    const events: any[] = []

    // Fetch mentor availability (only for mentors)
    if (showAvailability && isMentor) {
      const availabilities = await prisma.mentor_availability.findMany({
        where: {
          mentor_id: userId,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: [
          { date: 'asc' },
          { start_time: 'asc' }
        ]
      }) as PrismaMentorAvailability[]

      const availabilityEvents = availabilities.map(mapAvailabilityToEvent)
      events.push(...availabilityEvents)
    }

    // Fetch sessions
    if (showSessions) {
      const sessionWhere = isMentor
        ? {
          // Mentors see sessions where they are host or guest
          OR: [
            { host_id: userId },
            { guest_id: userId }
          ],
          start_at: {
            gte: startDate,
            lte: endDate
          }
        }
        : {
          // Students only see sessions where they are guest
          guest_id: userId,
          start_at: {
            gte: startDate,
            lte: endDate
          }
        }

      const sessions = await prisma.sessions.findMany({
        where: sessionWhere,
        include: {
          users_sessions_host_idTousers: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          users_sessions_guest_idTousers: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          start_at: 'asc'
        }
      }) as PrismaSession[]

      const sessionEvents = sessions.map(mapSessionToEvent)
      events.push(...sessionEvents)
    }

    // Sort all events by start date
    events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

    return NextResponse.json({
      events,
      isMentor,
      dateRange: { startDate, endDate }
    })
  } catch (error: any) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching calendar events' },
      { status: 500 }
    )
  }
}
