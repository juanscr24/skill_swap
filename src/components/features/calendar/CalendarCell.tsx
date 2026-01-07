'use client'

import type { CalendarDayData, CalendarEvent } from '@/types/calendar'
import { SessionEvent } from './SessionEvent'
import { AvailabilityEvent } from './AvailabilityEvent'

interface CalendarCellProps {
  dayData: CalendarDayData
  onEventClick: (event: CalendarEvent) => void
}

/**
 * Individual calendar cell representing a single day
 * Shows day number and all events for that day
 * 
 * Visual states:
 * - Current month days: full opacity
 * - Other month days: reduced opacity
 * - Today: highlighted with border
 */
export const CalendarCell = ({ dayData, onEventClick }: CalendarCellProps) => {
  const { date, isCurrentMonth, isToday, events } = dayData
  const dayNumber = date.getDate()
  
  // Separate events by type
  const sessionEvents = events.filter(e => e.type === 'session')
  const availabilityEvents = events.filter(e => e.type === 'availability')
  
  return (
    <div
      className={`
        min-h-[120px] p-2 border border-(--border-1)
        ${!isCurrentMonth ? 'opacity-40 bg-(--bg-3)' : 'bg-(--bg-2)'}
        ${isToday ? 'ring-2 ring-(--button-1)' : ''}
        hover:bg-(--bg-1) transition-colors
      `}
    >
      {/* Day number */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`
            text-sm font-semibold
            ${isToday 
              ? 'bg-(--button-1) text-(--button-1-text) w-6 h-6 flex items-center justify-center rounded-full' 
              : 'text-(--text-1)'
            }
          `}
        >
          {dayNumber}
        </span>
        
        {/* Event count badge */}
        {events.length > 0 && (
          <span className="text-[10px] bg-(--bg-3) text-(--text-2) px-1.5 py-0.5 rounded-full">
            {events.length}
          </span>
        )}
      </div>
      
      {/* Events list */}
      <div className="space-y-1 overflow-y-auto max-h-[80px]">
        {/* Sessions first */}
        {sessionEvents.map((event) => (
          <SessionEvent 
            key={event.id} 
            event={event} 
            onClick={onEventClick}
          />
        ))}
        
        {/* Then availability */}
        {availabilityEvents.map((event) => (
          <AvailabilityEvent 
            key={event.id} 
            event={event} 
            onClick={onEventClick}
          />
        ))}
        
        {/* Show "+N more" if too many events */}
        {events.length > 3 && (
          <div className="text-[10px] text-(--text-2) text-center py-1">
            +{events.length - 3} more
          </div>
        )}
      </div>
    </div>
  )
}
