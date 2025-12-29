import { prisma } from '@/lib/prisma'
import { MentorAvailability } from '@/types/models'

export const availabilityService = {
    // Create availability slot for a mentor
    async createAvailability(
        mentorId: string,
        date: Date,
        startTime: string,
        endTime: string
    ): Promise<MentorAvailability> {
        // Validate time format (must be in multiples of 10 minutes)
        if (!this.isValidTimeFormat(startTime) || !this.isValidTimeFormat(endTime)) {
            throw new Error('Time must be in multiples of 10 minutes')
        }

        // Validate minimum duration (30 minutes)
        const duration = this.calculateDuration(startTime, endTime)
        if (duration < 30) {
            throw new Error('Minimum duration is 30 minutes')
        }

        const availability = await prisma.mentor_availability.create({
            data: {
                mentor_id: mentorId,
                date,
                start_time: startTime,
                end_time: endTime,
                is_booked: false,
            },
        })

        return availability as MentorAvailability
    },

    // Get all availability slots for a mentor
    async getMentorAvailability(
        mentorId: string,
        includeBooked: boolean = false
    ): Promise<MentorAvailability[]> {
        const where: any = {
            mentor_id: mentorId,
            date: {
                gte: new Date(), // Only future dates
            },
        }

        if (!includeBooked) {
            where.is_booked = false
        }

        const availability = await prisma.mentor_availability.findMany({
            where,
            orderBy: [{ date: 'asc' }, { start_time: 'asc' }],
        })

        return availability as MentorAvailability[]
    },

    // Get availability by ID
    async getAvailabilityById(id: string): Promise<MentorAvailability | null> {
        const availability = await prisma.mentor_availability.findUnique({
            where: { id },
        })

        return availability as MentorAvailability | null
    },

    // Delete availability slot
    async deleteAvailability(id: string, mentorId: string): Promise<void> {
        const availability = await prisma.mentor_availability.findUnique({
            where: { id },
        })

        if (!availability) {
            throw new Error('Availability not found')
        }

        if (availability.mentor_id !== mentorId) {
            throw new Error('Unauthorized')
        }

        if (availability.is_booked) {
            throw new Error('Cannot delete booked availability')
        }

        await prisma.mentor_availability.delete({
            where: { id },
        })
    },

    // Mark availability as booked
    async markAsBooked(id: string): Promise<void> {
        await prisma.mentor_availability.update({
            where: { id },
            data: { is_booked: true },
        })
    },

    // Mark availability as available (when session is cancelled)
    async markAsAvailable(id: string): Promise<void> {
        await prisma.mentor_availability.update({
            where: { id },
            data: { is_booked: false },
        })
    },

    // Validate time format (HH:mm in multiples of 10 minutes)
    isValidTimeFormat(time: string): boolean {
        const [hours, minutes] = time.split(':').map(Number)
        
        if (isNaN(hours) || isNaN(minutes)) return false
        if (hours < 0 || hours > 23) return false
        if (minutes < 0 || minutes > 59) return false
        if (minutes % 10 !== 0) return false

        return true
    },

    // Calculate duration in minutes between two times
    calculateDuration(startTime: string, endTime: string): number {
        const [startHours, startMinutes] = startTime.split(':').map(Number)
        const [endHours, endMinutes] = endTime.split(':').map(Number)

        const startTotalMinutes = startHours * 60 + startMinutes
        const endTotalMinutes = endHours * 60 + endMinutes

        return endTotalMinutes - startTotalMinutes
    },

    // Get next available slots (limited to first N slots)
    async getNextAvailableSlots(
        mentorId: string,
        limit: number = 5
    ): Promise<MentorAvailability[]> {
        const availability = await prisma.mentor_availability.findMany({
            where: {
                mentor_id: mentorId,
                is_booked: false,
                date: {
                    gte: new Date(),
                },
            },
            orderBy: [{ date: 'asc' }, { start_time: 'asc' }],
            take: limit,
        })

        return availability as MentorAvailability[]
    },
}
