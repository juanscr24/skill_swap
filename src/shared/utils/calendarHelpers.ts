import type {
  CalendarEvent,
  PrismaMentorAvailability,
  PrismaSession,
  CalendarDayData
} from '@/features/calendar/types/calendar.types'

/**
 * Maps mentor_availability to CalendarEvent
 * Combines date + start_time/end_time to create Date objects
 */
export function mapAvailabilityToEvent(
  availability: PrismaMentorAvailability
): CalendarEvent {
  const { date, start_time, end_time, users, is_booked, id, mentor_id } = availability

  // Parse time strings "HH:mm" and combine with date
  const startDate = combineDateAndTime(date, start_time)
  const endDate = combineDateAndTime(date, end_time)

  return {
    id,
    type: 'availability',
    startDate,
    endDate,
    title: is_booked ? 'Booked' : 'Available',
    mentorId: mentor_id,
    mentorName: users.name || 'Unknown Mentor',
    mentorImage: users.image || undefined,
    isBooked: is_booked,
  }
}

/**
 * Maps session to CalendarEvent
 * Sessions already have DateTime fields
 */
export function mapSessionToEvent(session: PrismaSession): CalendarEvent {
  const {
    id,
    title,
    description,
    start_at,
    end_at,
    status,
    host_id,
    guest_id,
    availability_id,
    users_sessions_host_idTousers,
    users_sessions_guest_idTousers
  } = session

  return {
    id,
    type: 'session',
    startDate: new Date(start_at),
    endDate: new Date(end_at),
    title,
    description: description || undefined,
    status: (status as any) || 'pending',
    hostId: host_id || undefined,
    hostName: users_sessions_host_idTousers?.name || 'Unknown Host',
    hostImage: users_sessions_host_idTousers?.image || undefined,
    guestId: guest_id || undefined,
    guestName: users_sessions_guest_idTousers?.name || 'Unknown Guest',
    guestImage: users_sessions_guest_idTousers?.image || undefined,
    availabilityId: availability_id || undefined,
  }
}

/**
 * Combines a Date (date only) with a time string "HH:mm"
 * Returns a proper Date object with time
 */
export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number)
  const combined = new Date(date)
  combined.setHours(hours, minutes, 0, 0)
  return combined
}

/**
 * Generates calendar grid for a given month
 * Returns array of 35 or 42 days (5-6 weeks) including padding days
 */
export function generateCalendarDays(
  year: number,
  month: number,
  events: CalendarEvent[]
): CalendarDayData[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDay = firstDay.getDay() // 0 = Sunday
  const daysInMonth = lastDay.getDate()

  const days: CalendarDayData[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Add padding days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: date.getTime() === today.getTime(),
      events: getEventsForDate(date, events)
    })
  }

  // Add current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    days.push({
      date,
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime(),
      events: getEventsForDate(date, events)
    })
  }

  // Add padding days from next month
  const remainingDays = 42 - days.length // Always show 6 weeks
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: date.getTime() === today.getTime(),
      events: getEventsForDate(date, events)
    })
  }

  return days
}

/**
 * Filters events that occur on a specific date
 */
export function getEventsForDate(date: Date, events: CalendarEvent[]): CalendarEvent[] {
  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)

  return events.filter(event => {
    const eventDate = new Date(event.startDate)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate.getTime() === targetDate.getTime()
  })
}

/**
 * Gets color class for event based on type and status
 */
export function getEventColor(event: CalendarEvent): string {
  if (event.type === 'availability') {
    return event.isBooked
      ? 'bg-gray-400 text-gray-900' // Booked availability
      : 'bg-blue-500 text-white'     // Available slot
  }

  // Session colors based on status
  switch (event.status) {
    case 'scheduled':
      return 'bg-green-500 text-white'
    case 'completed':
      return 'bg-gray-500 text-white'
    case 'pending':
      return 'bg-yellow-500 text-white'
    case 'cancelled':
    case 'rejected':
      return 'bg-red-500 text-white'
    default:
      return 'bg-blue-500 text-white'
  }
}

/**
 * Formats event time for display
 */
export function formatEventTime(startDate: Date, endDate: Date): string {
  const start = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  const end = endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  return `${start} - ${end}`
}

/**
 * Gets month name
 */
export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[month]
}

/**
 * Gets day name abbreviation
 */
export function getDayName(day: number): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[day]
}
