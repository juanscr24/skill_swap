'use client'
import { useTranslations } from "next-intl"
import { mockSessions } from "@/constants/mockSessions"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Tabs } from "@/components/ui/Tabs"
import { Button } from "@/components"
import Link from "next/link"
import { FiCalendar, FiClock } from "react-icons/fi"
import { currentUser } from "@/constants/mockUsers"

export const SessionsView = () => {
    const t = useTranslations('sessions')

    const upcomingSessions = mockSessions.filter(
        session => 
            session.status === 'scheduled' &&
            (session.host.id === currentUser.id || session.guest.id === currentUser.id)
    )

    const pastSessions = mockSessions.filter(
        session => 
            session.status === 'completed' &&
            (session.host.id === currentUser.id || session.guest.id === currentUser.id)
    )

    const SessionCard = ({ session }: { session: typeof mockSessions[0] }) => {
        const isHost = session.host.id === currentUser.id
        const otherUser = isHost ? session.guest : session.host

        const statusVariant = {
            scheduled: 'warning',
            completed: 'success',
            cancelled: 'error'
        } as const

        return (
            <Card hover>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-(--button-1) rounded-lg">
                        <FiCalendar className="w-6 h-6 text-(--button-1-text)" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-(--text-1)">{session.title}</h3>
                                <p className="text-sm text-(--text-2)">{session.description}</p>
                            </div>
                            <Badge variant={statusVariant[session.status]}>
                                {t(session.status)}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-(--text-2) mb-3">
                            <div className="flex items-center gap-2">
                                <FiCalendar className="w-4 h-4" />
                                <span>{session.start_at.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiClock className="w-4 h-4" />
                                <span>
                                    {session.start_at.toLocaleTimeString('es-ES', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar src={otherUser.image} alt={otherUser.name} size="sm" />
                                <div>
                                    <p className="text-sm font-medium text-(--text-1)">{otherUser.name}</p>
                                    <p className="text-xs text-(--text-2)">
                                        {isHost ? t('guest') : t('host')}
                                    </p>
                                </div>
                            </div>

                            {session.status === 'scheduled' && (
                                <div className="flex gap-2">
                                    <Button primary className="px-4 py-2">
                                        {t('markAsCompleted')}
                                    </Button>
                                    <Button secondary className="px-4 py-2">
                                        {t('cancel')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    const tabs = [
        {
            id: 'upcoming',
            label: t('upcomingSessions'),
            content: (
                <div className="space-y-4">
                    {upcomingSessions.length === 0 ? (
                        <p className="text-(--text-2) text-center py-8">{t('noSessions')}</p>
                    ) : (
                        upcomingSessions.map((session) => (
                            <SessionCard key={session.id} session={session} />
                        ))
                    )}
                </div>
            )
        },
        {
            id: 'past',
            label: t('pastSessions'),
            content: (
                <div className="space-y-4">
                    {pastSessions.length === 0 ? (
                        <p className="text-(--text-2) text-center py-8">{t('noSessions')}</p>
                    ) : (
                        pastSessions.map((session) => (
                            <SessionCard key={session.id} session={session} />
                        ))
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-(--text-1)">{t('sessions')}</h1>
                <Link href="/sessions/schedule">
                    <Button primary className="px-6 py-3">
                        {t('scheduleSessions')}
                    </Button>
                </Link>
            </div>

            <Tabs tabs={tabs} defaultTab="upcoming" />
        </div>
    )
}
