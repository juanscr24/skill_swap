import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { availabilityService } from '@/services/availability'

// DELETE /api/availability/[id] - Delete availability slot
export async function DELETE(
    request: NextRequest,
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
    } catch (error: any) {
        console.error('Error deleting availability:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to delete availability' },
            { status: 500 }
        )
    }
}
