'use client'

import { useAvailability } from '@/features/mentor/hooks/useAvailability'
import { useTranslations } from 'next-intl'
import { AvailabilityManagerProps } from '../../types'
import { AvailabilityForm } from './AvailabilityForm'
import { AvailabilityList } from './AvailabilityList'

export const AvailabilityManager = ({ mentorId }: AvailabilityManagerProps) => {
  const t = useTranslations('sessions')
  const { availability, isLoading, addAvailability, deleteAvailability } =
    useAvailability(mentorId)

  const handleSubmit = async (date: string, startTime: string, endTime: string) => {
    try {
      await addAvailability(date, startTime, endTime)
      alert(t('availabilityAdded'))
    } catch (error: any) {
      alert(error.message || t('errorAddingAvailability'))
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAvailability(id)
      alert(t('availabilityDeleted'))
    } catch (error: any) {
      alert(error.message || t('errorDeletingAvailability'))
    }
  }

  return (
    <div className="space-y-8 bg-(--bg-1) rounded-2xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-(--text-1)">
          {t('manageAvailability')}
        </h1>
        <p className="text-(--text-2)">
          {t('manageScheduleSubtitle')}
        </p>
      </div>

      {/* Add New Availability Section */}
      <AvailabilityForm onSubmit={handleSubmit} />

      {/* Current Availabilities */}
      <AvailabilityList
        availability={availability}
        isLoading={isLoading}
        onDelete={handleDelete}
      />
    </div>
  )
}
