import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { FiMessageCircle, FiUsers, FiStar, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import { Avatar } from '@/components/ui/Avatar'
import { LoadingSpinner } from '@/components'
import type { RecentActivity as ActivityType, DashboardSectionProps } from '@/types/dashboard'

interface RecentActivityProps extends DashboardSectionProps {
  activities: ActivityType[]
  isLoading: boolean
}

const getActivityIcon = (type: ActivityType['type']) => {
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

const getActivityColor = (type: ActivityType['type']) => {
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
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes}m`
  if (hours < 24) return `Hace ${hours}h`
  if (days < 7) return `Hace ${days}d`
  return new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
}

export const RecentActivity = ({ activities, isLoading, className = '' }: RecentActivityProps) => {
  const t = useTranslations('dashboard')

  if (isLoading) {
    return (
      <div className={`flex justify-center py-12 ${className}`}>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className={`bg-(--bg-2) rounded-xl p-6 border border-(--border-1) ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-(--text-1)">{t('recentActivity')}</h2>
        <Link 
          href="/activity" 
          className="text-(--button-1) hover:underline text-sm font-semibold flex items-center gap-1 group"
        >
          {t('viewAll')}
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Empty State */}
      {activities.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 inline-flex p-4 rounded-full bg-(--bg-1)">
            <FiMessageCircle className="w-12 h-12 text-(--text-2)" />
          </div>
          <h3 className="text-lg font-semibold text-(--text-1) mb-2">
            {t('noRecentActivity')}
          </h3>
          <p className="text-(--text-2)">{t('startConnecting')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 5).map((activity) => {
            const Icon = getActivityIcon(activity.type)
            const colorClasses = getActivityColor(activity.type)

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-(--bg-1) transition-colors"
              >
                <div className={`shrink-0 p-2 rounded-lg ${colorClasses}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-(--text-1) text-sm">
                      {activity.title}
                    </p>
                    <span className="text-xs text-(--text-2) shrink-0">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-(--text-2) line-clamp-1">
                    {activity.description}
                  </p>

                  {/* Rating for reviews */}
                  {activity.type === 'review' && activity.metadata?.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-3 h-3 ${
                            i < activity.metadata!.rating! 
                              ? 'fill-[#F59E0B] text-[#F59E0B]' 
                              : 'text-(--text-2)'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* User avatar for activities with user */}
                {activity.user && (
                  <Avatar
                    src={activity.user.image || ''}
                    alt={activity.user.name || 'User'}
                    size="sm"
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
