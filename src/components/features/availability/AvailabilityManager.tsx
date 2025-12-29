'use client'

import { useState } from 'react'
import { useAvailability } from '@/hooks'
import { Button } from '@/components/ui/Button'
import { FiPlus, FiClock, FiTrash2 } from 'react-icons/fi'

interface AvailabilityManagerProps {
  mentorId?: string
  translations: {
    manageAvailability: string
    manageScheduleSubtitle: string
    addNewAvailability: string
    dayOfWeek: string
    selectDay: string
    startTime: string
    endTime: string
    add: string
    currentAvailabilities: string
    viewFullCalendar: string
    day: string
    schedule: string
    state: string
    actions: string
    recurring: string
    oneTime: string
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
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

  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '',
    endTime: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await addAvailability(
        newSlot.date,
        newSlot.startTime,
        newSlot.endTime
      )
      alert(translations.availabilityAdded)
      setNewSlot({ date: '', startTime: '', endTime: '' })
    } catch (error: any) {
      alert(error.message || translations.errorAddingAvailability)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAvailability(id)
      alert(translations.availabilityDeleted)
    } catch (error: any) {
      alert(error.message || translations.errorDeletingAvailability)
    }
  }

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`
  }

  return (
    <div className="space-y-8 bg-[var(--bg-1)] rounded-2xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--text-1)]">
          {translations.manageAvailability}
        </h1>
        <p className="text-[var(--text-2)]">
          {translations.manageScheduleSubtitle}
        </p>
      </div>

      {/* Add New Availability Section */}
      <div className="bg-[var(--bg-2)] border border-[var(--border-1)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[var(--button-1)] flex items-center justify-center">
            <FiPlus className="text-white text-xl" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-1)]">
            {translations.addNewAvailability}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Day Selector */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--text-2)]">
                {translations.dayOfWeek}
              </label>
              <input
                type="date"
                value={newSlot.date}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, date: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-[var(--bg-1)] border border-[var(--border-1)] rounded-lg text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--button-1)] transition-all"
              />
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--text-2)]">
                {translations.startTime}
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, startTime: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-[var(--bg-1)] border border-[var(--border-1)] rounded-lg text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--button-1)] transition-all"
                  placeholder="--:--"
                />
                <FiClock className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-2)] pointer-events-none" />
              </div>
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--text-2)]">
                {translations.endTime}
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, endTime: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-[var(--bg-1)] border border-[var(--border-1)] rounded-lg text-[var(--text-1)] focus:outline-none focus:ring-2 focus:ring-[var(--button-1)] transition-all"
                  placeholder="--:--"
                />
                <FiClock className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-2)] pointer-events-none" />
              </div>
            </div>

            {/* Add Button */}
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full py-3 bg-[var(--button-1)] hover:opacity-90 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                <FiPlus className="text-xl" />
                {translations.add}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Current Availabilities */}
      <div className="bg-[var(--bg-2)] border border-[var(--border-1)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--text-1)]">
            {translations.currentAvailabilities}
          </h2>
          <button className="text-[var(--button-1)] hover:underline text-sm font-medium">
            {translations.viewFullCalendar}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-[var(--text-2)]">
            Cargando...
          </div>
        ) : !availability || availability.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-2)]">
            Mostrando 0 ranuras de disponibilidad
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-1)]">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                    {translations.day}
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                    {translations.schedule}
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                    {translations.state}
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-2)] uppercase tracking-wider">
                    {translations.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {availability.map((slot) => (
                  <tr
                    key={slot.id}
                    className="border-b border-[var(--border-1)] hover:bg-[var(--bg-1)] transition-colors"
                  >
                    <td className="py-4 px-4 text-[var(--text-1)] font-medium capitalize">
                      {formatDate(slot.date)}
                    </td>
                    <td className="py-4 px-4 text-[var(--text-1)]">
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        {translations.recurring}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleDelete(slot.id)}
                        className="text-[var(--text-2)] hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
