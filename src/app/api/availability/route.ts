import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { availabilityService } from '@/services/availability'

// POST /api/availability - Create availability slot
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { date, start_time, end_time } = body

        if (!date || !start_time || !end_time) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const availability = await availabilityService.createAvailability(
            session.user.id,
            new Date(date),
            start_time,
            end_time
        )

        return NextResponse.json(availability, { status: 201 })
    } catch (error: any) {
        console.error('Error creating availability:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create availability' },
            { status: 500 }
        )
    }
}

// GET /api/availability - Get current user's availability
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const includeBooked = searchParams.get('includeBooked') === 'true'

        const availability = await availabilityService.getMentorAvailability(
            session.user.id,
            includeBooked
        )

        return NextResponse.json(availability)
    } catch (error: any) {
        console.error('Error fetching availability:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch availability' },
            { status: 500 }
        )
    }
}
