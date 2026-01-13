'use client'

import { CalendarEvent } from '@/features/calendar/types'
import { Avatar, Button } from '@/shared/components/ui'
import { formatEventTime } from '@/shared/utils/calendarHelpers'
import { FiX, FiCalendar, FiClock, FiUser, FiUsers, FiFileText } from 'react-icons/fi'

interface EventDetailModalProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  isMentor: boolean
}

/**
 * Modal to show detailed information about a calendar event
 * Displays different content for availability vs sessions
 */
export const EventDetailModal = ({
  event,
  isOpen,
  onClose,
  isMentor
}: EventDetailModalProps) => {
  if (!isOpen || !event) return null

  const timeStr = formatEventTime(event.startDate, event.endDate)
  const dateStr = event.startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const isAvailability = event.type === 'availability'
  const isSession = event.type === 'session'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-(--bg-2) rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-(--border-1)">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-(--text-1)">
              {event.title}
            </h2>
            {event.status && (
              <span className={`
                inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
                ${event.status === 'scheduled' ? 'bg-green-500/10 text-green-500' : ''}
                ${event.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                ${event.status === 'completed' ? 'bg-gray-500/10 text-gray-500' : ''}
                ${event.status === 'cancelled' || event.status === 'rejected' ? 'bg-red-500/10 text-red-500' : ''}
              `}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-(--bg-3) rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6 text-(--text-2)" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date and Time */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FiCalendar className="w-5 h-5 text-(--button-1) mt-0.5" />
              <div>
                <p className="font-semibold text-(--text-1)">Date</p>
                <p className="text-(--text-2)">{dateStr}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiClock className="w-5 h-5 text-(--button-1) mt-0.5" />
              <div>
                <p className="font-semibold text-(--text-1)">Time</p>
                <p className="text-(--text-2)">{timeStr}</p>
              </div>
            </div>
          </div>

          {/* Session-specific details */}
          {isSession && (
            <>
              {/* Description */}
              {event.description && (
                <div className="flex items-start gap-3">
                  <FiFileText className="w-5 h-5 text-(--button-1) mt-0.5" />
                  <div>
                    <p className="font-semibold text-(--text-1)">Description</p>
                    <p className="text-(--text-2) whitespace-pre-wrap">{event.description}</p>
                  </div>
                </div>
              )}

              {/* Participants */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiUsers className="w-5 h-5 text-(--button-1)" />
                  <p className="font-semibold text-(--text-1)">Participants</p>
                </div>

                {/* Host */}
                <div className="flex items-center gap-3 p-3 bg-(--bg-3) rounded-lg">
                  <Avatar
                    src={event.hostImage || ''}
                    alt={event.hostName || 'Host'}
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-(--text-1)">{event.hostName}</p>
                    <p className="text-sm text-(--text-2)">Host / Mentor</p>
                  </div>
                </div>

                {/* Guest */}
                <div className="flex items-center gap-3 p-3 bg-(--bg-3) rounded-lg">
                  <Avatar
                    src={event.guestImage || ''}
                    alt={event.guestName || 'Guest'}
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-(--text-1)">{event.guestName}</p>
                    <p className="text-sm text-(--text-2)">Guest / Student</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Availability-specific details */}
          {isAvailability && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-(--bg-3) rounded-lg">
                <Avatar
                  src={event.mentorImage || ''}
                  alt={event.mentorName || 'Mentor'}
                  size="md"
                />
                <div>
                  <p className="font-medium text-(--text-1)">{event.mentorName}</p>
                  <p className="text-sm text-(--text-2)">Mentor</p>
                </div>
              </div>

              <div className={`
                p-4 rounded-lg border-2
                ${event.isBooked
                  ? 'border-gray-400 bg-gray-400/10'
                  : 'border-blue-500 bg-blue-500/10'
                }
              `}>
                <p className={`font-semibold ${event.isBooked ? 'text-gray-600' : 'text-blue-600'}`}>
                  {event.isBooked ? 'This slot is booked' : 'This slot is available for booking'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-(--border-1)">
          <Button
            secondary
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>

          {/* Show action buttons based on event type and status */}
          {isSession && event.status === 'scheduled' && isMentor && (
            <Button
              primary
              className="flex-1"
            >
              Join Session
            </Button>
          )}

          {isAvailability && !event.isBooked && !isMentor && (
            <Button
              primary
              className="flex-1"
            >
              Book This Slot
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
