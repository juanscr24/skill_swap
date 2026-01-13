'use client'

import { useState } from 'react'
import { CalendarHeader } from './CalendarHeader'
import { CalendarCell } from './CalendarCell'
import { LoadingSpinner } from '@/shared/components'
import { useCalendar } from '@/features/session/hooks/useCalendar'
import { generateCalendarDays, getDayName } from '@/shared/utils/calendarHelpers'
import { CalendarEvent, CalendarViewMode } from '@/features/calendar/types'

interface SessionsCalendarProps {
  onEventClick?: (event: CalendarEvent) => void
}

/**
 * Main calendar component
 * Displays a monthly view of availability slots and scheduled sessions
 * 
 * Features:
 * - Month navigation
 * - Color-coded events (availability = blue, sessions = status-based)
 * - Click to view event details
 * - Responsive grid layout
 * - Role-based filtering (mentors see availability, students only see sessions)
 */
export const SessionsCalendar = ({ onEventClick }: SessionsCalendarProps) => {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())

  // Calculate date range for current month
  const startDate = new Date(currentYear, currentMonth, 1)
  const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)

  const { events, isLoading, error, isMentor, refetch } = useCalendar(startDate, endDate)

  // Generate calendar grid
  const calendarDays = generateCalendarDays(currentYear, currentMonth, events)

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleToday = () => {
    const now = new Date()
    setCurrentYear(now.getFullYear())
    setCurrentMonth(now.getMonth())
  }

  // Refetch when month changes
  useState(() => {
    const newStartDate = new Date(currentYear, currentMonth, 1)
    const newEndDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)
    refetch(newStartDate, newEndDate)
  })

  const handleEventClick = (event: CalendarEvent) => {
    if (onEventClick) {
      onEventClick(event)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentYear={currentYear}
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span className="text-(--text-2)">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-(--text-2)">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500" />
          <span className="text-(--text-2)">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-500" />
          <span className="text-(--text-2)">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span className="text-(--text-2)">Cancelled</span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-(--bg-2) rounded-lg border border-(--border-1) overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-(--bg-3)">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-semibold text-(--text-2) border-b border-(--border-1)"
            >
              {getDayName(day)}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7">
          {calendarDays.map((dayData, index) => (
            <CalendarCell
              key={`${dayData.date.toISOString()}-${index}`}
              dayData={dayData}
              onEventClick={handleEventClick}
            />
          ))}
        </div>
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="text-center py-8 text-(--text-2)">
          {isMentor
            ? 'No availability or sessions scheduled for this month'
            : 'No sessions scheduled for this month'
          }
        </div>
      )}
    </div>
  )
}
