'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { FiArrowLeft } from 'react-icons/fi'
import { LoadingSpinner } from '@/shared/components'
import { useAllActivity, ActivityFilters, ActivityItem, EmptyActivityState } from '..'

export const ActivityPage = () => {
  const t = useTranslations('dashboard')
  const { activities, isLoading, error } = useAllActivity()
  const [filterType, setFilterType] = useState('all')

  const filteredActivities = filterType === 'all'
    ? activities
    : activities.filter(a => a.type === filterType)

  if (isLoading) return <LoadingSpinner />
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-8 max-md:p-6 max-sm:p-4">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-(--button-1) hover:underline mb-4">
          <FiArrowLeft className="w-4 h-4" />
          <span className="font-semibold">{t('backToDashboard')}</span>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-(--text-1) mb-2">
              {t('allActivity')}
            </h1>
            <p className="text-(--text-2)">{t('activityDescription')}</p>
          </div>
          <div className="bg-(--bg-2) border border-(--border-1) px-4 py-2 rounded-lg">
            <span className="font-semibold text-(--text-1)">
              {filteredActivities.length} actividades
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ActivityFilters
        filterType={filterType}
        onFilterChange={setFilterType}
      />

      {/* Content */}
      {filteredActivities.length === 0 ? (
        <EmptyActivityState filterType={filterType} />
      ) : (
        <div className="bg-(--bg-2) border border-(--border-1) rounded-xl p-6 space-y-3">
          {filteredActivities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}
