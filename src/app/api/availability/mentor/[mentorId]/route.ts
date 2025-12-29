import { NextRequest, NextResponse } from 'next/server'
import { availabilityService } from '@/services/availability'

// GET /api/availability/mentor/[mentorId] - Get mentor availability
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ mentorId: string }> }
) {
    try {
        const { mentorId } = await params
        const { searchParams } = new URL(request.url)
        const includeBooked = searchParams.get('includeBooked') === 'true'

        const availability = await availabilityService.getMentorAvailability(
            mentorId,
            includeBooked
        )

        return NextResponse.json(availability)
    } catch (error: any) {
        console.error('Error fetching mentor availability:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch availability' },
            { status: 500 }
        )
    }
}
