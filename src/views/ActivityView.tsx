'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { FiArrowLeft, FiMessageCircle, FiUsers, FiStar, FiCheckCircle, FiCalendar, FiFilter } from 'react-icons/fi'
import { Avatar } from '@/components/ui/Avatar'
import { LoadingSpinner } from '@/components'
import { useAllActivity } from '@/hooks/useAllActivity'
import type { RecentActivity } from '@/types/dashboard'
import { useState } from 'react'

const getActivityIcon = (type: RecentActivity['type']) => {
  switch (type) {
    case 'message':
      return FiMessageCircle
    case 'match':
      return FiUsers
    case 'review':
      return FiStar
    case 'session':
      return FiCheckCircle
    default:
      return FiMessageCircle
  }
}

const getActivityColor = (type: RecentActivity['type']) => {
  switch (type) {
    case 'message':
      return 'text-[#3B82F6] bg-[#3B82F6]/10'
    case 'match':
      return 'text-[#8B5CF6] bg-[#8B5CF6]/10'
    case 'review':
      return 'text-[#F59E0B] bg-[#F59E0B]/10'
    case 'session':
      return 'text-[#10B981] bg-[#10B981]/10'
    default:
      return 'text-(--text-2) bg-(--bg-1)'
  }
}

const formatTimestamp = (date: Date): string => {
  const now = new Date()
  const activityDate = new Date(date)
  const diff = now.getTime() - activityDate.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes}m`
  if (hours < 24) return `Hace ${hours}h`
  if (days < 7) return `Hace ${days}d`
  if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`
  
  return activityDate.toLocaleDateString('es-ES', { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric' 
  })
}

const getActivityTypeLabel = (type: RecentActivity['type']) => {
  switch (type) {
    case 'message':
      return 'Mensaje'
    case 'match':
      return 'Match'
    case 'review':
      return 'Reseña'
    case 'session':
      return 'Sesión'
    default:
      return 'Actividad'
  }
}

export const ActivityView = () => {
  const t = useTranslations('dashboard')
  const { activities, isLoading, error } = useAllActivity()
  const [filterType, setFilterType] = useState<RecentActivity['type'] | 'all'>('all')

  const filteredActivities = filterType === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filterType)

  const activityTypes: Array<{ value: RecentActivity['type'] | 'all', label: string }> = [
    { value: 'all', label: 'Todas' },
    { value: 'message', label: 'Mensajes' },
    { value: 'match', label: 'Matches' },
    { value: 'review', label: 'Reseñas' },
    { value: 'session', label: 'Sesiones' },
  ]

  return (
    <div className="p-8 max-md:p-6 max-sm:p-4">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-(--button-1) hover:underline mb-4 group"
        >
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">{t('backToDashboard')}</span>
        </Link>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-2">
              {t('allActivity')}
            </h1>
            <p className="text-(--text-2)">
              {t('activityDescription')}
            </p>
          </div>

          {/* Stats Badge */}
          <div className="flex items-center gap-2 bg-(--bg-2) border border-(--border-1) rounded-lg px-4 py-2">
            <FiCalendar className="w-5 h-5 text-(--button-1)" />
            <span className="text-sm font-semibold text-(--text-1)">
              {filteredActivities.length} {filteredActivities.length === 1 ? 'actividad' : 'actividades'}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-(--bg-2) border border-(--border-1) rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter className="w-5 h-5 text-(--text-2)" />
          <span className="text-sm font-semibold text-(--text-1)">Filtrar por tipo:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilterType(type.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === type.value
                  ? 'bg-(--button-1) text-(--button-1-text)'
                  : 'bg-(--bg-1) text-(--text-2) hover:bg-(--border-1)'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-(--bg-2) border border-(--border-1) rounded-xl p-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-(--bg-2) border border-(--border-1) rounded-xl p-12 text-center">
          <div className="mb-4 inline-flex p-4 rounded-full bg-(--bg-1)">
            <FiMessageCircle className="w-12 h-12 text-(--text-2)" />
          </div>
          <h3 className="text-lg font-semibold text-(--text-1) mb-2">
            {t('noActivity')}
          </h3>
          <p className="text-(--text-2)">
            {filterType === 'all' 
              ? t('startConnecting')
              : `No hay actividades de tipo "${activityTypes.find(t => t.value === filterType)?.label}"`
            }
          </p>
        </div>
      ) : (
        <div className="bg-(--bg-2) border border-(--border-1) rounded-xl p-6">
          <div className="space-y-3">
            {filteredActivities.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              const colorClasses = getActivityColor(activity.type)

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-(--bg-1) transition-colors border border-transparent hover:border-(--border-1)"
                >
                  {/* Icon */}
                  <div className={`shrink-0 p-3 rounded-lg ${colorClasses}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-(--bg-1) text-(--text-2)">
                            {getActivityTypeLabel(activity.type)}
                          </span>
                          <span className="text-xs text-(--text-2)">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                        <p className="font-semibold text-(--text-1) mb-1">
                          {activity.title}
                        </p>
                        <p className="text-sm text-(--text-2)">
                          {activity.description}
                        </p>
                      </div>

                      {/* User avatar */}
                      {activity.user && (
                        <Avatar
                          src={activity.user.image || ''}
                          alt={activity.user.name || 'User'}
                          size="md"
                        />
                      )}
                    </div>

                    {/* Rating for reviews */}
                    {activity.type === 'review' && activity.metadata?.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < activity.metadata!.rating! 
                                ? 'fill-[#F59E0B] text-[#F59E0B]' 
                                : 'text-(--text-2)'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-(--text-2) ml-1">
                          {activity.metadata.rating}.0
                        </span>
                      </div>
                    )}

                    {/* Status for sessions */}
                    {activity.type === 'session' && activity.metadata?.status && (
                      <div className="mt-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          activity.metadata.status === 'completed' 
                            ? 'bg-[#10B981]/10 text-[#10B981]'
                            : activity.metadata.status === 'cancelled'
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                        }`}>
                          {activity.metadata.status === 'completed' && 'Completada'}
                          {activity.metadata.status === 'cancelled' && 'Cancelada'}
                          {activity.metadata.status === 'pending' && 'Pendiente'}
                          {activity.metadata.status === 'scheduled' && 'Programada'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
