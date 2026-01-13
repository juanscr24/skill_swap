'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Card, Avatar, Button } from '@/shared/components/ui'
import { LoadingSpinner } from '@/shared/components'
import { BookSessionModal } from './availability/BookSessionModal'
import { FiCalendar, FiClock } from 'react-icons/fi'
import type { MentorsAvailabilityCalendarProps, MentorAvailabilityData } from '../types/session.types'

export const MentorsAvailabilityCalendar = ({
  mentorAvailabilities,
  isLoading
}: MentorsAvailabilityCalendarProps) => {
  const t = useTranslations('sessions')
  const [selectedMentor, setSelectedMentor] = useState<MentorAvailabilityData | null>(null)
  const [showBookModal, setShowBookModal] = useState(false)

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`
  }

  const handleBookSession = (mentor: MentorAvailabilityData) => {
    setSelectedMentor(mentor)
    setShowBookModal(true)
  }

  const handleCloseModal = () => {
    setShowBookModal(false)
    setSelectedMentor(null)
  }

  const handleSuccess = () => {
    // Optionally refetch or update the list
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (mentorAvailabilities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <FiCalendar className="w-16 h-16 text-(--text-3) mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-(--text-1) mb-2">
          {t('noMentorAvailability')}
        </h3>
        <p className="text-(--text-2)">
          {t('noMentorAvailabilityDescription')}
        </p>
      </div>
    )
  }

  // Group availability by date
  const groupedByDate: Record<string, Array<{
    mentor: MentorAvailabilityData
    slots: typeof mentorAvailabilities[0]['availability']
  }>> = {}

  mentorAvailabilities.forEach((mentor) => {
    mentor.availability.forEach((slot) => {
      const dateKey = new Date(slot.date).toISOString().split('T')[0]
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = []
      }

      const existingMentor = groupedByDate[dateKey].find(
        (item) => item.mentor.mentorId === mentor.mentorId
      )

      if (existingMentor) {
        existingMentor.slots.push(slot)
      } else {
        groupedByDate[dateKey].push({
          mentor,
          slots: [slot]
        })
      }
    })
  })

  const sortedDates = Object.keys(groupedByDate).sort()

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-(--text-1)">
            {t('mentorsAvailability')}
          </h2>
          <p className="text-(--text-2)">
            {mentorAvailabilities.length} {t('mentorsAvailable')}
          </p>
        </div>

        {/* Calendar View */}
        <div className="space-y-6">
          {sortedDates.map((dateKey) => {
            const date = new Date(dateKey)
            const mentorsForDate = groupedByDate[dateKey]

            return (
              <Card key={dateKey}>
                <div className="mb-4 pb-4 border-b border-(--border-1)">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-(--button-1) w-5 h-5" />
                    <h3 className="text-lg font-semibold text-(--text-1) capitalize">
                      {formatDate(date)}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {mentorsForDate.map(({ mentor, slots }) => (
                    <div
                      key={mentor.mentorId}
                      className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-lg bg-(--bg-1) hover:bg-(--bg-3) transition-colors"
                    >
                      {/* Mentor Info */}
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar
                          src={mentor.mentorImage || ''}
                          alt={mentor.mentorName}
                          size="md"
                        />
                        <div>
                          <p className="font-semibold text-(--text-1)">
                            {mentor.mentorName}
                          </p>
                          {mentor.mentorBio && (
                            <p className="text-sm text-(--text-2) line-clamp-1">
                              {mentor.mentorBio}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Available Slots */}
                      <div className="flex flex-wrap items-center gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => handleBookSession(mentor)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-(--border-1) hover:border-(--button-1) hover:bg-(--button-1)/10 transition-all text-sm"
                          >
                            <FiClock className="w-4 h-4 text-(--button-1)" />
                            <span className="text-(--text-1) font-medium">
                              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Book Button */}
                      <Button
                        primary
                        onClick={() => handleBookSession(mentor)}
                        className="px-4 py-2 whitespace-nowrap"
                      >
                        {t('bookSession')}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Book Session Modal */}
      {showBookModal && selectedMentor && (
        <BookSessionModal
          mentorId={selectedMentor.mentorId}
          mentorName={selectedMentor.mentorName}
          availability={selectedMentor.availability.map((slot) => ({
            id: slot.id,
            mentor_id: selectedMentor.mentorId,
            date: typeof slot.date === 'string' ? new Date(slot.date) : slot.date,
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_booked: slot.is_booked,
            created_at: new Date()
          }))}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}
