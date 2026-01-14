import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { availabilityService } from '@/features/mentor/services'

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        await availabilityService.deleteAvailability(id, session.user.id)

        return NextResponse.json({ message: 'Availability deleted successfully' })
    } catch (error: unknown) {
        console.error('Error deleting availability:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete availability'
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}
