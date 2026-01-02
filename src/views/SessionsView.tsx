'use client'
import { useTranslations } from "next-intl"
import { useSessions } from "@/hooks"
import { useProfile } from "@/hooks/useProfile"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Tabs } from "@/components/ui/Tabs"
import { Button, LoadingSpinner } from "@/components"
import Link from "next/link"
import { FiCalendar, FiClock } from "react-icons/fi"
import { useSession } from "next-auth/react"
import { ManageAvailability } from "@/components/features/sessions/ManageAvailability"

interface SessionData {
    id: string
    title: string
    description: string | null
    start_at: Date
    end_at: Date
    status: string | null
    users_sessions_host_idTousers: {
        id: string
        name: string | null
        image: string | null
    } | null
    users_sessions_guest_idTousers: {
        id: string
        name: string | null
        image: string | null
    } | null
}

export const SessionsView = () => {
    const t = useTranslations('sessions')
    const { data: session } = useSession()
    const { sessions, isLoading, cancelSession, updateSessionStatus } = useSessions('all')
    const { profile } = useProfile()

    // Un usuario es mentor si tiene skills para enseñar o si su role es MENTOR/ADMIN
    const isMentor = (profile?.skills && profile.skills.length > 0) || profile?.role === 'MENTOR' || profile?.role === 'ADMIN'

    const pendingSessions = sessions.filter(
        (s) => s.status === 'pending'
    )

    const upcomingSessions = sessions.filter(
        (s) => s.status === 'scheduled'
    )

    const pastSessions = sessions.filter(
        (s) => s.status === 'completed'
    )

    const SessionCard = ({ sessionData }: { sessionData: SessionData }) => {
        const currentUserId = session?.user?.id
        const isHost = sessionData.users_sessions_host_idTousers?.id === currentUserId
        const isGuest = sessionData.users_sessions_guest_idTousers?.id === currentUserId
        const otherUser = isHost ? sessionData.users_sessions_guest_idTousers : sessionData.users_sessions_host_idTousers

        const statusVariant = {
            pending: 'warning',
            scheduled: 'warning',
            completed: 'success',
            cancelled: 'error',
            rejected: 'error'
        } as const

        const handleCancel = async () => {
            if (!confirm('¿Estás seguro de cancelar esta sesión?')) return

            const result = await cancelSession(sessionData.id)
            if (!result.success) {
                alert(t('errorCancelling'))
            }
        }

        const handleApprove = async () => {
            const result = await updateSessionStatus(sessionData.id, 'scheduled')
            if (!result.success) {
                alert('Error al aprobar la sesión')
            }
        }

        const handleReject = async () => {
            if (!confirm('¿Estás seguro de rechazar esta sesión?')) return

            const result = await updateSessionStatus(sessionData.id, 'rejected')
            if (!result.success) {
                alert('Error al rechazar la sesión')
            }
        }

        const handleComplete = async () => {
            const result = await updateSessionStatus(sessionData.id, 'completed')
            if (!result.success) {
                alert('Error al marcar como completada')
            }
        }

        const startAt = new Date(sessionData.start_at)

        return (
            <Card hover>
                <div className="flex flex-col md:flex-row items-start gap-4 max-sm:gap-3">
                    <div className="p-3 max-sm:p-2 bg-(--button-1) rounded-lg">
                        <FiCalendar className="w-6 h-6 max-sm:w-5 max-sm:h-5 text-(--button-1-text)" />
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-2">
                            <div>
                                <h3 className="text-lg max-md:text-base max-sm:text-sm font-bold text-(--text-1)">{sessionData.title}</h3>
                                <p className="text-sm max-sm:text-xs text-(--text-2)">{sessionData.description}</p>
                            </div>
                            <Badge variant={statusVariant[sessionData.status as keyof typeof statusVariant] || 'warning'}>
                                {t(sessionData.status || 'scheduled')}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 max-sm:gap-2 text-sm max-sm:text-xs text-(--text-2) mb-3 max-sm:mb-2">
                            <div className="flex items-center gap-2 max-sm:gap-1">
                                <FiCalendar className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                                <span>{startAt.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 max-sm:gap-1">
                                <FiClock className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                                <span>
                                    {startAt.toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Avatar src={otherUser?.image || ''} alt={otherUser?.name || 'User'} size="sm" />
                                <div>
                                    <p className="text-sm max-sm:text-xs font-medium text-(--text-1)">{otherUser?.name || 'Unknown'}</p>
                                    <p className="text-xs max-sm:text-[10px] text-(--text-2)">
                                        {isHost ? t('guest') : t('host')}
                                    </p>
                                </div>
                            </div>

                            {/* Botones según el estado y rol */}
                            {sessionData.status === 'pending' && isHost && (
                                <div className="flex gap-2 max-sm:gap-1 flex-wrap">
                                    <Button primary onClick={handleApprove} className="px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs">
                                        Aceptar
                                    </Button>
                                    <Button secondary onClick={handleReject} className="px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs">
                                        Rechazar
                                    </Button>
                                </div>
                            )}

                            {sessionData.status === 'pending' && isGuest && (
                                <div className="flex gap-2 max-sm:gap-1 flex-wrap">
                                    <span className="text-sm max-sm:text-xs text-(--text-2) italic">
                                        Esperando aprobación del mentor
                                    </span>
                                    <Button secondary onClick={handleCancel} className="px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs">
                                        {t('cancel')}
                                    </Button>
                                </div>
                            )}

                            {sessionData.status === 'scheduled' && (
                                <div className="flex gap-2 max-sm:gap-1 flex-wrap">
                                    <Button primary onClick={handleComplete} className="px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs">
                                        {t('markAsCompleted')}
                                    </Button>
                                    <Button secondary onClick={handleCancel} className="px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs">
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
            id: 'availability',
            label: t('manageAvailability'),
            content: (
                <div>
                    {profile ? (
                        <ManageAvailability profile={profile} isMentor={isMentor} />
                    ) : (
                        <LoadingSpinner />
                    )}
                </div>
            )
        },
        {
            id: 'pending',
            label: (t('pendingSessions')),
            content: (
                <div className="space-y-4 max-sm:space-y-3">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : pendingSessions.length === 0 ? (
                        <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">{t('noPendingRequests')}</p>
                    ) : (
                        pendingSessions.map((sessionData) => (
                            <SessionCard key={sessionData.id} sessionData={sessionData} />
                        ))
                    )}
                </div>
            )
        },
        {
            id: 'upcoming',
            label: t('upcomingSessions'),
            content: (
                <div className="space-y-4 max-sm:space-y-3">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : upcomingSessions.length === 0 ? (
                        <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">{t('noSessions')}</p>
                    ) : (
                        upcomingSessions.map((sessionData) => (
                            <SessionCard key={sessionData.id} sessionData={sessionData} />
                        ))
                    )}
                </div>
            )
        },
        {
            id: 'past',
            label: t('pastSessions'),
            content: (
                <div className="space-y-4 max-sm:space-y-3">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : pastSessions.length === 0 ? (
                        <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">{t('noSessions')}</p>
                    ) : (
                        pastSessions.map((sessionData) => (
                            <SessionCard key={sessionData.id} sessionData={sessionData} />
                        ))
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 max-md:mb-6 max-sm:mb-4 gap-4">
                <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1)">{t('sessions')}</h1>
                <Link href="/sessions/schedule">
                    <Button primary className="px-6 max-sm:px-4 py-3 max-sm:py-2 max-sm:text-sm">
                        {t('scheduleSessions')}
                    </Button>
                </Link>
            </div>

            <Tabs tabs={tabs} defaultTab="pending" />
        </div>
    )
}
