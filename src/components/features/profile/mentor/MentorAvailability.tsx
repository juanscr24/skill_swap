'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { FiCalendar, FiClock } from 'react-icons/fi'
import { useAvailability } from '@/hooks'
import { Button } from '@/components/ui/Button'
import { BookSessionModal } from '@/components/features/availability'
import type { MentorAvailabilityProps } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export const MentorAvailability = ({
  mentorId,
  mentorName,
  availability: legacyAvailability,
}: MentorAvailabilityProps) => {
  const t = useTranslations('sessions')
  const { availability, isLoading } = useAvailability(mentorId)
  const [showBookingModal, setShowBookingModal] = useState(false)

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const getNextSlots = () => {
    return availability.filter((slot) => !slot.is_booked).slice(0, 5)
  }

  const nextSlots = getNextSlots()

  return (
    <>
      <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1)">\n        <div className="flex items-center gap-2 mb-4">
          <FiCalendar className="text-(--button-1)" size={20} />
          <h2 className="text-lg font-bold text-(--text-1)">
            {t('nextAvailability')}
          </h2>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : nextSlots.length === 0 ? (
          <div className="text-center py-8 text-(--text-2)">
            <p className="text-sm">{t('noAvailableSlots')}</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {nextSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 bg-(--bg-1) rounded-lg border border-(--border-1)"
                >
                  <div>
                    <p className="text-(--text-1) font-medium text-sm">
                      {formatDate(slot.date)}
                    </p>
                    <p className="text-(--text-2) text-xs flex items-center gap-1 mt-1">
                      <FiClock size={12} />
                      {slot.start_time} - {slot.end_time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              primary
              onClick={() => setShowBookingModal(true)}
              className="w-full"
            >
              {t('bookSession')}
            </Button>
          </>
        )}
      </div>

      {showBookingModal && (
        <BookSessionModal
          mentorId={mentorId}
          mentorName={mentorName || 'Mentor'}
          availability={availability.filter((slot) => !slot.is_booked)}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            alert(t('sessionRequested'))
          }}
        />
      )}
    </>
  )
}

