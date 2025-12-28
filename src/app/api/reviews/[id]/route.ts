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
 * DELETE /api/reviews/[id]
 * Delete a review by ID
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: 'No autenticado' },
                { status: 401 }
            )
        }

        const { id } = await params

        // Verify review exists and belongs to current user
        const review = await prisma.reviews.findUnique({
            where: { id },
        })

        if (!review) {
            return NextResponse.json(
                { message: 'Review not found' },
                { status: 404 }
            )
        }

        if (review.author_id !== session.user.id) {
            return NextResponse.json(
                { message: 'No tienes permiso para eliminar esta review' },
                { status: 403 }
            )
        }

        // Delete the review
        await prisma.reviews.delete({
            where: { id },
        })

        return NextResponse.json(
            { message: 'Review eliminada exitosamente' },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Error deleting review:', error)
        return NextResponse.json(
            { message: error.message || 'Error al eliminar la review' },
            { status: 500 }
        )
    }
}
