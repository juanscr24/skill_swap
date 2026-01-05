import { useTranslations } from 'next-intl'
import { FiBookOpen, FiClock, FiTrendingUp, FiAward } from 'react-icons/fi'
import { StatCard } from './StatCard'
import type { DashboardStats, StatCardConfig, DashboardSectionProps } from '@/types/dashboard'
import { LoadingSpinner } from '@/components'

interface StatsOverviewProps extends DashboardSectionProps {
  stats: DashboardStats | null
  isLoading: boolean
}

export const StatsOverview = ({ stats, isLoading, className = '' }: StatsOverviewProps) => {
  const t = useTranslations('dashboard')

  if (isLoading) {
    return (
      <div className={`flex justify-center py-12 ${className}`}>
        <LoadingSpinner />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-(--text-2)">{t('noStatsAvailable')}</p>
      </div>
    )
  }

  const statsConfig: StatCardConfig[] = [
    {
      icon: FiBookOpen,
      label: t('classesTaken'),
      value: stats.classesTaken,
      color: 'text-[#3B82F6]',
      change: stats.weeklyChange?.classesTaken,
      trend: stats.weeklyChange?.classesTaken && stats.weeklyChange.classesTaken > 0 ? 'up' : 
             stats.weeklyChange?.classesTaken && stats.weeklyChange.classesTaken < 0 ? 'down' : 'neutral'
    },
    {
      icon: FiAward,
      label: t('classesGiven'),
      value: stats.classesGiven,
      color: 'text-[#10B981]',
      change: stats.weeklyChange?.classesGiven,
      trend: stats.weeklyChange?.classesGiven && stats.weeklyChange.classesGiven > 0 ? 'up' : 
             stats.weeklyChange?.classesGiven && stats.weeklyChange.classesGiven < 0 ? 'down' : 'neutral'
    },
    {
      icon: FiClock,
      label: t('hoursTeaching'),
      value: `${stats.totalHours}h`,
      color: 'text-[#8B5CF6]',
      change: stats.weeklyChange?.totalHours,
      trend: stats.weeklyChange?.totalHours && stats.weeklyChange.totalHours > 0 ? 'up' : 
             stats.weeklyChange?.totalHours && stats.weeklyChange.totalHours < 0 ? 'down' : 'neutral'
    },
    {
      icon: FiTrendingUp,
      label: t('totalCompleted'),
      value: stats.totalCompleted,
      color: 'text-[#F59E0B]',
      trend: 'neutral'
    }
  ]

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold text-(--text-1) mb-6">{t('overview')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((config, index) => (
          <StatCard key={index} config={config} />
        ))}
      </div>
    </div>
  )
}
