'use client'

import { Avatar } from '@/shared/components/ui'
import { formatEventTime, getEventColor } from '@/shared/utils/calendarHelpers'
import type { CalendarEvent } from '@/types/calendar'
import { FiClock, FiUser } from 'react-icons/fi'

interface AvailabilityEventProps {
  event: CalendarEvent
  onClick: (event: CalendarEvent) => void
}

/**
 * Renders an availability slot in the calendar
 * Shows time range and mentor info
 * Visual distinction for booked vs available slots
 */
export const AvailabilityEvent = ({ event, onClick }: AvailabilityEventProps) => {
  const colorClass = getEventColor(event)
  const timeStr = formatEventTime(event.startDate, event.endDate)
  
  return (
    <button
      onClick={() => onClick(event)}
      className={`w-full text-left px-2 py-1.5 rounded-md text-xs ${colorClass} hover:opacity-90 transition-opacity mb-1`}
      disabled={event.isBooked}
    >
      <div className="flex items-start gap-1.5">
        <FiClock className="w-3 h-3 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold">
            {event.isBooked ? 'Booked' : 'Available'}
          </p>
          <p className="text-[10px] opacity-90">
            {timeStr}
          </p>
          {event.mentorImage && (
            <div className="flex items-center gap-1 mt-1">
              <Avatar 
                src={event.mentorImage} 
                alt={event.mentorName || ''} 
                size="sm" 
              />
              <span className="text-[10px] opacity-80 truncate">
                {event.mentorName}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
