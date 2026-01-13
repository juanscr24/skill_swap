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
        <div className="flex flex-col h-full w-full">
            <div className="flex-1 overflow-y-auto space-y-4">
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <LoadingSpinner size="md" />
                    </div>
                ) : relevantSessions.length === 0 ? (
                    <div className="text-center py-12 px-4 flex flex-col items-center">
                        <div className="w-16 h-16 bg-(--bg-1) rounded-full flex items-center justify-center mb-4">
                            <FiCalendar className="w-8 h-8 text-(--text-2) opacity-50" />
                        </div>
                        <h4 className="text-(--text-1) font-medium mb-1">{t('noUpcomingSessions')}</h4>
                        <p className="text-sm text-(--text-2) mb-6 max-w-xs">{t('upcomingSessionsWithUser')}</p>

                        <Link href={`/sessions/schedule?mentor=${otherUserId}`} className="w-full max-w-xs">
                            <Button primary className="w-full justify-center">
                                {t('scheduleNow')}
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {relevantSessions.map((session) => (
                            <Card key={session.id} className="p-4 shadow-sm border border-(--border-1) bg-(--bg-1) hover:border-(--primary-500) transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <Badge variant={session.status === 'confirmed' ? 'success' : 'warning'}>
                                        {ts(session.status || 'pending')}
                                    </Badge>
                                    <span className="text-xs text-(--text-2) bg-(--bg-2) px-2 py-1 rounded-full">
                                        {formatRelativeTime(session.start_at)}
                                    </span>
                                </div>
                                <h4 className="font-semibold text-(--text-1) mb-3 line-clamp-2">{session.title}</h4>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2.5 text-sm text-(--text-2)">
                                        <div className="w-8 h-8 rounded-lg bg-(--bg-2) flex items-center justify-center text-(--primary-500)">
                                            <FiCalendar className="w-4 h-4" />
                                        </div>
                                        <span>{formatLongDate(session.start_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm text-(--text-2)">
                                        <div className="w-8 h-8 rounded-lg bg-(--bg-2) flex items-center justify-center text-(--secondary-500)">
                                            <FiClock className="w-4 h-4" />
                                        </div>
                                        <span>{new Date(session.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                {session.status === 'confirmed' && (
                                    <Link href={`/sessions/${session.id}`} className="block">
                                        <Button secondary className="w-full py-2 flex items-center justify-center gap-2">
                                            <FiVideo className="w-4 h-4" />
                                            {ts('joinSession')}
                                        </Button>
                                    </Link>
                                )}
                            </Card>
                        ))}
                    </>
                )}
            </div>

            {relevantSessions.length > 0 && (
                <div className="mt-6 pt-4 border-t border-(--border-1)">
                    <Link href={`/sessions/schedule?mentor=${otherUserId}`} className="block">
                        <Button primary className="w-full justify-center py-2.5 text-sm font-medium">
                            {t('scheduleAnother')}
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
