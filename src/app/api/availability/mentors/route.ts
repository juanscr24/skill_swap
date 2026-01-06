import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { prisma } from '@/lib'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get all accepted matches for the current user
    const acceptedMatches = await prisma.matches.findMany({
      where: {
        status: 'accepted',
        OR: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      include: {
        users_matches_sender_idTousers: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true
          }
        },
        users_matches_receiver_idTousers: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true
          }
        }
      }
    })

    // Extract unique mentor IDs (excluding current user)
    const mentorIds = new Set<string>()
    acceptedMatches.forEach((match) => {
      if (match.sender_id && match.sender_id !== userId) {
        mentorIds.add(match.sender_id)
      }
      if (match.receiver_id && match.receiver_id !== userId) {
        mentorIds.add(match.receiver_id)
      }
    })

    // Get availabilities for all matched mentors
    const mentorsAvailability = await Promise.all(
      Array.from(mentorIds).map(async (mentorId) => {
        const mentor = acceptedMatches.find(
          (m) => m.sender_id === mentorId || m.receiver_id === mentorId
        )

        const mentorData = mentor?.sender_id === mentorId
          ? mentor.users_matches_sender_idTousers
          : mentor?.users_matches_receiver_idTousers

        const availability = await prisma.mentor_availability.findMany({
          where: {
            mentor_id: mentorId,
            is_booked: false,
            date: {
              gte: new Date()
            }
          },
          orderBy: [
            { date: 'asc' },
            { start_time: 'asc' }
          ]
        })

        return {
          mentorId,
          mentorName: mentorData?.name || 'Unknown',
          mentorImage: mentorData?.image || null,
          mentorBio: mentorData?.bio || null,
          availability: availability.map((slot) => ({
            id: slot.id,
            date: slot.date,
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_booked: slot.is_booked || false
          }))
        }
      })
    )

    // Filter out mentors without availability
    const mentorsWithAvailability = mentorsAvailability.filter(
      (m) => m.availability.length > 0
    )

    return NextResponse.json(mentorsWithAvailability)
  } catch (error: any) {
    console.error('Error al obtener disponibilidades de mentores:', error)
    return NextResponse.json(
      { error: error.message || 'Error al obtener disponibilidades de mentores' },
      { status: 500 }
    )
  }
}
