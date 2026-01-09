'use client'
import { useTranslations } from 'next-intl'
import { FiMessageCircle } from 'react-icons/fi'
import { ACTIVITY_TYPES } from '@/data/activity'
import { EmptyActivityStateProps } from '../types/activity'

export const EmptyActivityState = ({ filterType }: EmptyActivityStateProps) => {
  const t = useTranslations('dashboard')

  const getEmptyMessage = () => {
    if (filterType === 'all') {
      return t('noActivity')
    }

    const typeLabel = ACTIVITY_TYPES.find(t => t.value === filterType)?.label || filterType
    return `No hay actividades de tipo "${typeLabel}"`
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
        {filterType === 'all' ? t('startConnecting') : 'Ajusta los filtros o espera nuevas notificaciones'}
      </p>
    </div>
  )
}
