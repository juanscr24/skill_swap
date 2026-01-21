'use client'
import { useTranslations } from 'next-intl'
import { FiMessageCircle } from 'react-icons/fi'
import { ACTIVITY_TYPES } from '@/data/activity'
import { EmptyActivityStateProps } from '../types/activity.types'

export const EmptyActivityState = ({ filterType }: EmptyActivityStateProps) => {
  const t = useTranslations('activity')
  const tDashboard = useTranslations('dashboard')

  const getEmptyMessage = () => {
    if (filterType === 'all') {
      return tDashboard('noActivity')
    }

    const filterLabels: { [key: string]: string } = {
      'message': t('filters.messages'),
      'match': t('filters.matches'),
      'review': t('filters.reviews'),
      'session': t('filters.sessions')
    }
    const typeLabel = filterLabels[filterType] || filterType
    return `${t('emptyState.title')} "${typeLabel}"`
  }

  return (
    <div className="bg-(--bg-2) border border-(--border-1) rounded-xl p-12 text-center">
      <div className="mb-6 inline-flex p-4 rounded-full bg-(--bg-1)">
        <FiMessageCircle className="w-12 h-12 text-(--text-2)" />
      </div>
      <h3 className="text-xl font-semibold text-(--text-1) mb-3">
        {getEmptyMessage()}
      </h3>
      <p className="text-(--text-2) max-w-md mx-auto">
        {filterType === 'all' ? tDashboard('startConnecting') : t('emptyState.description')}
      </p>
    </div>
  )
}
