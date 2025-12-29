'use client'

import { useState } from 'react'
import { useAvailability } from '@/hooks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface AvailabilityManagerProps {
  mentorId: string
  translations: {
    manageAvailability: string
    addAvailability: string
    date: string
    startTime: string
    endTime: string
    deleteAvailability: string
    availabilityAdded: string
    availabilityDeleted: string
    errorAddingAvailability: string
    errorDeletingAvailability: string
  }
}

export const AvailabilityManager = ({
  mentorId,
  translations,
}: AvailabilityManagerProps) => {
  const { availability, isLoading, addAvailability, deleteAvailability } =
    useAvailability(mentorId)

  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleAddAvailability = async () => {
    if (!date || !startTime || !endTime) return

    try {
      await addAvailability(new Date(date), startTime, endTime)
      setMessage({ type: 'success', text: translations.availabilityAdded })
      setDate('')
      setStartTime('')
      setEndTime('')
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || translations.errorAddingAvailability,
      })
    }
  }

  const handleDeleteAvailability = async (id: string) => {
    try {
      await deleteAvailability(id)
      setMessage({ type: 'success', text: translations.availabilityDeleted })
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || translations.errorDeletingAvailability,
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-(--text-1)">
        {translations.manageAvailability}
      </h2>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add Availability Form */}
      <div className="bg-(--bg-2) border border-(--border-1) rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-(--text-1)">
          {translations.addAvailability}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="date"
            label={translations.date}
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />

          <Input
            type="time"
            label={translations.startTime}
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            step="600"
          />

          <Input
            type="time"
            label={translations.endTime}
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            step="600"
          />
        </div>

        <Button
          primary
          onClick={handleAddAvailability}
          disabled={!date || !startTime || !endTime || isLoading}
        >
          {translations.addAvailability}
        </Button>
      </div>

      {/* Availability List */}
      <div className="space-y-3">
        {availability.length === 0 ? (
          <p className="text-(--text-2) text-center py-8">
            No hay disponibilidad agregada
          </p>
        ) : (
          availability.map((slot) => (
            <div
              key={slot.id}
              className="bg-(--bg-2) border border-(--border-1) rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-(--text-1)">
                  {formatDate(slot.date.toString())}
                </p>
                <p className="text-(--text-2)">
                  {slot.start_time} - {slot.end_time}
                </p>
                {slot.is_booked && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                    Reservado
                  </span>
                )}
              </div>

              {!slot.is_booked && (
                <Button
                  secondary
                  onClick={() => handleDeleteAvailability(slot.id)}
                  disabled={isLoading}
                >
                  {translations.deleteAvailability}
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
