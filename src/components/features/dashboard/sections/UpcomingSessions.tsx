import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { FiCalendar, FiClock, FiArrowRight, FiSearch } from 'react-icons/fi'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components'
import type { DashboardSectionProps } from '@/types/dashboard'

interface Session {
  id: string
  title: string
  description: string | null
  start_at: Date
  end_at: Date
  status: string | null
  users_sessions_guest_idTousers?: {
    id: string
    name: string | null
    image: string | null
  } | null
  users_sessions_host_idTousers?: {
    id: string
    name: string | null
    image: string | null
  } | null
}

interface UpcomingSessionsProps extends DashboardSectionProps {
  sessions: Session[]
  isLoading: boolean
}

const getStatusVariant = (status: string | null): 'default' | 'success' | 'warning' | 'error' | 'info' => {
  switch (status) {
    case 'scheduled':
      return 'info'
    case 'completed':
      return 'success'
    case 'cancelled':
      return 'error'
    case 'pending':
      return 'warning'
    default:
      return 'default'
  }
}

export const UpcomingSessions = ({ sessions, isLoading, className = '' }: UpcomingSessionsProps) => {
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
        <h2 className="text-2xl font-bold text-(--text-1)">{t('upcomingSessions')}</h2>
        <Link 
          href="/sessions" 
          className="text-(--button-1) hover:underline text-sm font-semibold flex items-center gap-1 group"
        >
          {t('viewAll')}
          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Empty State */}
      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 inline-flex p-4 rounded-full bg-(--bg-1)">
            <FiCalendar className="w-12 h-12 text-(--text-2)" />
          </div>
          <h3 className="text-lg font-semibold text-(--text-1) mb-2">
            {t('noUpcomingSessions')}
          </h3>
          <p className="text-(--text-2) mb-6">{t('scheduleFirstSession')}</p>
          <Link
            href="/mentors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-(--button-1) text-(--button-1-text) rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            <FiSearch className="w-5 h-5" />
            {t('findMentor')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.slice(0, 3).map((session) => {
            const otherUser = session.users_sessions_guest_idTousers || session.users_sessions_host_idTousers
            const sessionDate = new Date(session.start_at)
            const endDate = new Date(session.end_at)
            const duration = Math.round((endDate.getTime() - sessionDate.getTime()) / (1000 * 60))

            return (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className="flex items-center gap-4 p-4 bg-(--bg-1) rounded-lg border border-(--border-1) hover:border-(--button-1) transition-all group"
              >
                <div className="shrink-0 p-3 bg-(--button-1)/10 rounded-lg group-hover:bg-(--button-1)/20 transition-colors">
                  <FiCalendar className="w-6 h-6 text-(--button-1)" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-(--text-1) truncate">
                      {session.title}
                    </h4>
                    <Badge variant={getStatusVariant(session.status)} className="ml-2 shrink-0">
                      {session.status || 'pending'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-(--text-2)">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      {sessionDate.toLocaleDateString('es-ES', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {sessionDate.toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {' • '}
                      {duration}min
                    </span>
                  </div>
                </div>

                {otherUser && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Avatar 
                      src={otherUser.image || ''} 
                      alt={otherUser.name || 'User'} 
                      size="md" 
                    />
                    <span className="text-sm text-(--text-1) font-medium hidden lg:block">
                      {otherUser.name || 'Usuario'}
                    </span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
