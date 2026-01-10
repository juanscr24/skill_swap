'use client'

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Button } from '@/shared/components/ui'
import { getMonthName } from '@/shared/utils/calendarHelpers'

interface CalendarHeaderProps {
  currentYear: number
  currentMonth: number
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

/**
 * Calendar header with navigation controls
 * Shows current month/year and navigation buttons
 */
export const CalendarHeader = ({
  currentYear,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday
}: CalendarHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-(--text-1)">
          {getMonthName(currentMonth)} {currentYear}
        </h2>
        <p className="text-sm text-(--text-2) mt-1">
          View your availability and scheduled sessions
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          secondary
          onClick={onToday}
          className="px-4 py-2 text-sm"
        >
          Today
        </Button>
        
        <div className="flex items-center gap-1 border border-(--border-1) rounded-lg">
          <button
            onClick={onPrevMonth}
            className="p-2 hover:bg-(--bg-3) transition-colors rounded-l-lg"
            aria-label="Previous month"
          >
            <FiChevronLeft className="w-5 h-5 text-(--text-1)" />
          </button>
          
          <div className="w-px h-6 bg-(--border-1)" />
          
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-(--bg-3) transition-colors rounded-r-lg"
            aria-label="Next month"
          >
            <FiChevronRight className="w-5 h-5 text-(--text-1)" />
          </button>
        </div>
      </div>
    </div>
  )
}
