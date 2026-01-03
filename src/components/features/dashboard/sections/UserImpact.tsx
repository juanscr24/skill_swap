import { useTranslations } from 'next-intl'
import { FiZap, FiUsers, FiStar, FiGlobe } from 'react-icons/fi'
import { LoadingSpinner } from '@/components'
import type { UserImpact as ImpactType, DashboardSectionProps } from '@/types/dashboard'

interface UserImpactProps extends DashboardSectionProps {
  impact: ImpactType | null
  isLoading: boolean
}

interface ImpactMetric {
  icon: typeof FiZap
  label: string
  value: number | string
  color: string
  bgColor: string
}

export const UserImpact = ({ impact, isLoading, className = '' }: UserImpactProps) => {
  const t = useTranslations('dashboard')

  if (isLoading) {
    return (
      <div className={`flex justify-center py-12 ${className}`}>
        <LoadingSpinner />
      </div>
    )
  }

  if (!impact) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-(--text-2)">{t('noImpactData')}</p>
      </div>
    )
  }

  const metrics: ImpactMetric[] = [
    {
      icon: FiZap,
      label: t('skillsOffered'),
      value: impact.skillsOffered,
      color: 'text-[#3B82F6]',
      bgColor: 'bg-[#3B82F6]/10'
    },
    {
      icon: FiUsers,
      label: t('peopleHelped'),
      value: impact.peopleHelped,
      color: 'text-[#10B981]',
      bgColor: 'bg-[#10B981]/10'
    },
    {
      icon: FiStar,
      label: t('averageRating'),
      value: impact.averageRating > 0 ? impact.averageRating.toFixed(1) : '0.0',
      color: 'text-[#F59E0B]',
      bgColor: 'bg-[#F59E0B]/10'
    },
    {
      icon: FiGlobe,
      label: t('activeLanguages'),
      value: impact.activeLanguages,
      color: 'text-[#8B5CF6]',
      bgColor: 'bg-[#8B5CF6]/10'
    }
  ]

  return (
    <div className={`bg-(--bg-2) rounded-xl p-6 border border-(--border-1) ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-(--text-1) mb-2">{t('yourImpact')}</h2>
        <p className="text-(--text-2) text-sm">{t('impactDescription')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-lg bg-(--bg-1) border border-(--border-1)"
            >
              <div className={`${metric.bgColor} p-3 rounded-full mb-3`}>
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <p className="text-2xl font-bold text-(--text-1) mb-1">
                {metric.value}
              </p>
              <p className="text-sm text-(--text-2)">
                {metric.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* Reviews summary */}
      {impact.totalReviews > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-(--bg-1) border border-(--border-1)">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiStar className="w-5 h-5 text-[#F59E0B]" />
              <span className="font-semibold text-(--text-1)">
                {impact.totalReviews} {t('reviews')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(impact.averageRating)
                      ? 'fill-[#F59E0B] text-[#F59E0B]'
                      : 'text-(--text-2)'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
