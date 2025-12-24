'use client'
import { useTranslations } from "next-intl"
import { Card } from "@/components/ui/Card"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { useSessions } from "@/hooks/useSessions"
import { FiBookOpen, FiClock, FiTrendingUp, FiCalendar, FiLoader } from "react-icons/fi"
import Link from "next/link"
import { Avatar } from "@/components/ui/Avatar"

export const DashboardView = () => {
    const t = useTranslations('dashboard')
    const { stats, isLoading: isLoadingStats } = useDashboardStats()
    const { sessions, isLoading: isLoadingSessions } = useSessions('upcoming')

    const statsConfig = stats ? [
        {
            icon: FiBookOpen,
            label: t('classesTaken'),
            value: stats.classesTaken,
            color: 'text-blue-500'
        },
        {
            icon: FiBookOpen,
            label: t('classesGiven'),
            value: stats.classesGiven,
            color: 'text-green-500'
        },
        {
            icon: FiClock,
            label: t('hoursTeaching'),
            value: stats.totalHours,
            color: 'text-purple-500'
        },
        {
            icon: FiTrendingUp,
            label: t('progressLevel'),
            value: `${stats.totalCompleted}`,
            color: 'text-orange-500'
        }
    ] : []

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4">
            <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-8 max-md:mb-6 max-sm:mb-4">
                {t('dashboard')}
            </h1>

            {/* Loading state */}
            {(isLoadingStats || isLoadingSessions) && (
                <div className="flex items-center justify-center py-12">
                    <FiLoader className="w-8 h-8 animate-spin text-(--button-1)" />
                </div>
            )}

            {/* Stats Grid */}
            {!isLoadingStats && statsConfig.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-md:gap-4 max-sm:gap-3 mb-8 max-md:mb-6 max-sm:mb-4">
                    {statsConfig.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <Card key={index}>
                                <div className="flex items-center gap-4 max-sm:gap-3">
                                    <div className={`p-3 max-sm:p-2 rounded-lg bg-(--bg-1) ${stat.color}`}>
                                        <Icon className="w-6 h-6 max-sm:w-5 max-sm:h-5" />
                                    </div>
                                    <div>
                                        <p className="text-(--text-2) text-sm max-sm:text-xs">{stat.label}</p>
                                        <p className="text-2xl max-md:text-xl max-sm:text-lg font-bold text-(--text-1)">
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Upcoming Sessions */}
            {!isLoadingSessions && (
                <Card className="mb-6">
                    <div className="flex items-center justify-between mb-4 max-sm:mb-3">
                        <h3 className="text-xl max-md:text-lg max-sm:text-base font-bold text-(--text-1)">
                            {t('upcomingSessions')}
                        </h3>
                        <Link href="/sessions" className="text-(--button-1) hover:underline text-sm max-sm:text-xs font-semibold">
                            {t('viewAll')}
                        </Link>
                    </div>

                    {sessions.length === 0 ? (
                        <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">
                            {t('noUpcomingSessions')}
                        </p>
                    ) : (
                        <div className="space-y-4 max-sm:space-y-3">
                            {sessions.map((session) => {
                                const otherUser = session.users_sessions_guest_idTousers || session.users_sessions_host_idTousers
                                const sessionDate = new Date(session.start_at)
                                
                                return (
                                    <div 
                                        key={session.id}
                                        className="flex items-center gap-4 max-sm:gap-3 p-4 max-sm:p-3 bg-(--bg-1) rounded-lg max-md:flex-col max-md:items-start"
                                    >
                                        <div className="p-3 max-sm:p-2 bg-(--button-1) rounded-lg">
                                            <FiCalendar className="w-6 h-6 max-sm:w-5 max-sm:h-5 text-(--button-1-text)" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-(--text-1) max-sm:text-sm">
                                                {session.title}
                                            </h4>
                                            <p className="text-sm max-sm:text-xs text-(--text-2)">
                                                {sessionDate.toLocaleDateString('es-ES')} • {sessionDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        {otherUser && (
                                            <div className="flex items-center gap-2 max-md:w-full">
                                                <Avatar 
                                                    src={otherUser.image || ''} 
                                                    alt={otherUser.name || 'User'} 
                                                    size="sm" 
                                                />
                                                <span className="text-sm max-sm:text-xs text-(--text-1) font-medium">
                                                    {otherUser.name || 'Usuario'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </Card>
            )}
        </div>
    )
}
