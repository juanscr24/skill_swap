import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { prisma } from '@/lib/prisma'

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

    // Obtener skills ofrecidas
    const skillsCount = await prisma.skills.count({
      where: {
        owner_id: userId
      }
    })

    // Obtener personas ayudadas (sesiones únicas como host)
    const uniqueGuests = await prisma.sessions.findMany({
      where: {
        host_id: userId,
        status: 'completed'
      },
      select: {
        guest_id: true
      },
      distinct: ['guest_id']
    })

    // Obtener reviews recibidas
    const reviews = await prisma.reviews.findMany({
      where: {
        target_id: userId
      },
      select: {
        rating: true
      }
    })

    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0

    // Obtener idiomas activos
    const languagesCount = await prisma.languages.count({
      where: {
        user_id: userId
      }
    })

    const impact = {
      skillsOffered: skillsCount,
      peopleHelped: uniqueGuests.length,
      averageRating: Number(averageRating.toFixed(1)),
      activeLanguages: languagesCount,
      totalReviews: reviews.length
    }

    return NextResponse.json(impact)
  } catch (error) {
    console.error('Error al obtener impacto del usuario:', error)
    return NextResponse.json(
      { error: 'Error al obtener impacto del usuario' },
      { status: 500 }
    )
  }
}
