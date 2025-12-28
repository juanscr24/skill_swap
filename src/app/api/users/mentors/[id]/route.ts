import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { prisma } from '@/lib/prisma'

interface RouteParams {
    params: Promise<{
        id: string
    }>
}

/**
 * GET /api/users/mentors/[id]
 * Fetch mentor profile by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params

        // Fetch user with MENTOR role
        const user = await prisma.users.findUnique({
            where: { id },
            include: {
                skills: {
                    orderBy: { created_at: 'desc' },
                },
                wanted_skills: {
                    orderBy: { created_at: 'desc' },
                },
                reviews_reviews_target_idTousers: {
                    include: {
                        users_reviews_author_idTousers: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                title: true,
                            },
                        },
                    },
                    orderBy: { created_at: 'desc' },
                },
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Mentor not found' },
                { status: 404 }
            )
        }

        // Verify user is a mentor
        if (user.role !== 'MENTOR') {
            return NextResponse.json(
                { error: 'User is not a mentor' },
                { status: 404 }
            )
        }

        // Calculate average rating and total reviews
        const reviews = user.reviews_reviews_target_idTousers
        const totalReviews = reviews.length
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0

        // Get total sessions (as host)
        const totalSessions = await prisma.sessions.count({
            where: {
                host_id: id,
                status: 'completed',
            },
        })

        // Calculate total hours (assuming 1 hour per session for now)
        const totalHours = totalSessions

        // Format response
        const mentorProfile = {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            bio: user.bio,
            city: user.city,
            role: user.role,
            title: user.title,
            social_links: user.social_links,
            availability: user.availability,
            skills: user.skills,
            wanted_skills: user.wanted_skills,
            reviews: reviews,
            averageRating,
            totalReviews,
            totalSessions,
            totalHours,
        }

        return NextResponse.json(mentorProfile)
    } catch (error) {
        console.error('Error fetching mentor profile:', error)
        return NextResponse.json(
            { error: 'Error fetching mentor profile' },
            { status: 500 }
        )
    }
}
