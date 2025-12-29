'use client'

import { MentorAvailability } from '@/types/models'

interface AvailabilityDisplayProps {
  availability: MentorAvailability[]
  title: string
  emptyMessage: string
}

export const AvailabilityDisplay = ({
  availability,
  title,
  emptyMessage,
}: AvailabilityDisplayProps) => {
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const groupByDate = (slots: MentorAvailability[]) => {
    return slots.reduce((acc, slot) => {
      const dateKey = new Date(slot.date).toDateString()
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(slot)
      return acc
    }, {} as Record<string, MentorAvailability[]>)
  }

  const groupedAvailability = groupByDate(availability)

  if (availability.length === 0) {
    return (
      <div className="text-center py-8 text-(--text-2)">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-(--text-1)">{title}</h3>

      <div className="grid grid-cols-1 gap-4">
        {Object.entries(groupedAvailability).map(([dateKey, slots]) => (
          <div
            key={dateKey}
            className="bg-(--bg-2) border border-(--border-1) rounded-lg p-4"
          >
            <p className="font-semibold text-(--text-1) mb-3">
              {formatDate(slots[0].date)}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`px-3 py-2 rounded-lg text-sm text-center ${
                    slot.is_booked
                      ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 line-through'
                      : 'bg-(--button-1)/10 text-(--button-1) border border-(--button-1)/20'
                  }`}
                >
                  {slot.start_time} - {slot.end_time}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
