'use client'

import { useTranslations } from 'next-intl'
import { useSessions } from '@/features/session/hooks/useSessions'
import { Card } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { Button, LoadingSpinner } from '@/shared/components'
import { FiCalendar, FiClock, FiVideo } from 'react-icons/fi'
import { formatRelativeTime, formatLongDate } from '@/shared/utils/date'
import Link from 'next/link'

interface ChatSessionInfoProps {
    otherUserId: string | undefined
}

export const ChatSessionInfo = ({ otherUserId }: ChatSessionInfoProps) => {
    const t = useTranslations('chat')
    const ts = useTranslations('sessions')
    const { sessions, isLoading } = useSessions('upcoming')

    const relevantSessions = sessions.filter(
        (s) =>
            s.users_sessions_host_idTousers?.id === otherUserId ||
            s.users_sessions_guest_idTousers?.id === otherUserId
    )

    if (!otherUserId) return null

    return (
        <div className="w-80 border-l border-(--border-1) bg-(--bg-1) flex flex-col max-lg:hidden">
            <div className="p-6 border-b border-(--border-1)">
                <h3 className="font-semibold text-(--text-1) mb-1">{t('sessionInfo') || 'Session Info'}</h3>
                <p className="text-xs text-(--text-2)">{t('upcomingSessionsWithUser') || 'Upcoming sessions with this user'}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                    <LoadingSpinner size="md" />
                ) : relevantSessions.length === 0 ? (
                    <div className="text-center py-8">
                        <FiCalendar className="w-8 h-8 mx-auto mb-2 text-(--text-2) opacity-50" />
                        <p className="text-sm text-(--text-2)">{t('noUpcomingSessions') || 'No upcoming sessions'}</p>
                        <Link href={`/sessions/schedule?mentor=${otherUserId}`}>
                            <Button primary className="mt-4 text-xs w-full">
                                {t('scheduleNow') || 'Schedule Now'}
                            </Button>
                        </Link>
                    </div>
                ) : (
                    relevantSessions.map((session) => (
                        <Card key={session.id} className="p-3 shadow-sm border-(--border-1) bg-(--bg-2)">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={session.status === 'confirmed' ? 'success' : 'warning'}>
                                    {ts(session.status || 'pending')}
                                </Badge>
                                <span className="text-[10px] text-(--text-2)">
                                    {formatRelativeTime(session.start_at)}
                                </span>
                            </div>
                            <h4 className="font-medium text-sm text-(--text-1) mb-2 line-clamp-1">{session.title}</h4>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-(--text-2)">
                                    <FiCalendar className="w-3 h-3" />
                                    {formatLongDate(session.start_at)}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-(--text-2)">
                                    <FiClock className="w-3 h-3" />
                                    {new Date(session.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            {session.status === 'confirmed' && (
                                <Link href={`/sessions/${session.id}`}>
                                    <Button secondary className="mt-3 w-full py-1.5 text-xs flex items-center justify-center gap-2">
                                        <FiVideo className="w-3 h-3" />
                                        {ts('joinSession')}
                                    </Button>
                                </Link>
                            )}
                        </Card>
                    ))
                )}
            </div>

            {relevantSessions.length > 0 && (
                <div className="p-4 bg-(--bg-2) border-t border-(--border-1)">
                    <Link href={`/sessions/schedule?mentor=${otherUserId}`}>
                        <Button primary className="w-full text-xs">
                            {t('scheduleAnother') || 'Schedule Another'}
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
