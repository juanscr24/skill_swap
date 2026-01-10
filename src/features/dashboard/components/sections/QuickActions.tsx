import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { FiPlus, FiSearch, FiUsers, FiCalendar } from 'react-icons/fi'
import type { QuickAction, DashboardSectionProps } from '@/types/dashboard'

export const QuickActions = ({ className = '' }: DashboardSectionProps) => {
  const t = useTranslations('dashboard')

  const actions: QuickAction[] = [
    {
      id: 'add-skill',
      label: t('addSkill'),
      description: t('addSkillDesc'),
      icon: FiPlus,
      href: '/profile',
      color: 'text-[#3B82F6]',
      bgColor: 'bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20'
    },
    {
      id: 'find-mentor',
      label: t('findMentor'),
      description: t('findMentorDesc'),
      icon: FiSearch,
      href: '/mentors',
      color: 'text-[#10B981]',
      bgColor: 'bg-[#10B981]/10 hover:bg-[#10B981]/20'
    },
    {
      id: 'view-matches',
      label: t('viewMatches'),
      description: t('viewMatchesDesc'),
      icon: FiUsers,
      href: '/matching',
      color: 'text-[#8B5CF6]',
      bgColor: 'bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20'
    },
    {
      id: 'set-availability',
      label: t('setAvailability'),
      description: t('setAvailabilityDesc'),
      icon: FiCalendar,
      href: '/sessions',
      color: 'text-[#F59E0B]',
      bgColor: 'bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20'
    }
  ]

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold text-(--text-1) mb-6">{t('quickActions')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.id}
              href={action.href}
              className={`${action.bgColor} rounded-xl p-6 border border-(--border-1) hover:border-(--button-1) transition-all group`}
            >
              <div className={`${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-(--text-1) mb-2">{action.label}</h3>
              <p className="text-sm text-(--text-2)">{action.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
