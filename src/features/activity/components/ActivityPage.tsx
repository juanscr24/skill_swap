'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { FiArrowLeft } from 'react-icons/fi'
import { LoadingSpinner, Button } from '@/shared/components'
import { useAllActivity, ActivityFilters, ActivityItem, EmptyActivityState } from '..'

export const ActivityPage = () => {
  const t = useTranslations('activity')
  const { activities, isLoading, error } = useAllActivity()
  const [filterType, setFilterType] = useState('all')

  const filteredActivities = filterType === 'all'
    ? activities
    : activities.filter(a => a.type === filterType)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-(--text-1) mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>
            {t('retry')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-(--bg-1) p-6 max-md:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-(--button-1) hover:underline mb-4 font-medium"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>{t('backToDashboard')}</span>
          </Link>

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl max-md:text-2xl font-bold text-(--text-1)">
              {t('title')}
            </h1>
            <div className="bg-(--button-1) text-(--button-1-text) px-4 py-1.5 rounded-lg font-semibold text-sm">
              {filteredActivities.length} {t('registered')}
            </div>
          </div>
          
          <p className="text-(--text-2)">
            {t('subtitle')}
          </p>
        </div>

        {/* Filters */}
        <ActivityFilters
          filterType={filterType}
          onFilterChange={setFilterType}
        />

        {/* Content */}
        <div className="mt-6">
          {filteredActivities.length === 0 ? (
            <EmptyActivityState filterType={filterType} />
          ) : (
            <div className="space-y-8">
              {/* Group by date */}
              {groupActivitiesByDate(filteredActivities, t).map(({ date, activities: dateActivities }) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-(--button-1)"></div>
                    <h2 className="text-sm font-semibold text-(--text-2) uppercase tracking-wide">
                      {date}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {dateActivities.map(activity => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredActivities.length > 10 && (
          <div className="mt-6 text-center">
            <Button
              className="px-6 py-2 border border-(--border-1) bg-transparent text-(--text-1) hover:bg-(--bg-2)"
            >
              {t('loadMore')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to group activities by date
function groupActivitiesByDate(activities: any[], t: any) {
  const groups: { [key: string]: any[] } = {}
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  activities.forEach(activity => {
    const activityDate = new Date(activity.timestamp)
    let dateKey: string

    if (isSameDay(activityDate, today)) {
      dateKey = t('dates.today')
    } else if (isSameDay(activityDate, yesterday)) {
      dateKey = t('dates.yesterday')
    } else {
      dateKey = activityDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: activityDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      }).toUpperCase()
    }

    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(activity)
  })

  return Object.entries(groups).map(([date, activities]) => ({
    date,
    activities
  }))
}

function isSameDay(date1: Date, date2: Date) {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
}

