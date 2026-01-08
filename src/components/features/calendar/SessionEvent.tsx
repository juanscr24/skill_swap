'use client'

import { Avatar } from '@/shared/components/ui'
import { formatEventTime, getEventColor } from '@/shared/utils/calendarHelpers'
import type { CalendarEvent } from '@/types/calendar'
import { FiClock, FiUser, FiUsers } from 'react-icons/fi'

interface SessionEventProps {
  event: CalendarEvent
  onClick: (event: CalendarEvent) => void
}

/**
 * Renders a session event in the calendar
 * Shows session title, time, participants, and status-based color
 */
export const SessionEvent = ({ event, onClick }: SessionEventProps) => {
  const colorClass = getEventColor(event)
  const timeStr = formatEventTime(event.startDate, event.endDate)
  
  return (
    <button
      onClick={() => onClick(event)}
      className={`w-full text-left px-2 py-1.5 rounded-md text-xs ${colorClass} hover:opacity-90 transition-opacity mb-1`}
    >
      <div className="flex items-start gap-1.5">
        <FiClock className="w-3 h-3 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">
            {event.title}
          </p>
          <p className="text-[10px] opacity-90">
            {timeStr}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {event.hostImage || event.guestImage ? (
              <div className="flex items-center gap-1">
                {event.hostImage && (
                  <Avatar 
                    src={event.hostImage} 
                    alt={event.hostName || ''} 
                    size="sm" 
                  />
                )}
                {event.guestImage && (
                  <Avatar 
                    src={event.guestImage} 
                    alt={event.guestName || ''} 
                    size="sm" 
                  />
                )}
              </div>
            ) : (
              <FiUsers className="w-3 h-3" />
            )}
            <span className="text-[10px] opacity-80 truncate">
              {event.hostName} & {event.guestName}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
