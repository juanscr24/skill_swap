'use client'
import { useTranslations } from "next-intl"
import { Card } from "@/components/ui/Card"
import { mockDashboardStats, chartDataHours, mockSessions } from "@/constants"
import { FiBookOpen, FiClock, FiTrendingUp, FiCalendar } from "react-icons/fi"
import Link from "next/link"
import { Avatar } from "@/components/ui/Avatar"

export const DashboardView = () => {
    const t = useTranslations('dashboard')

    const upcomingSessions = mockSessions
        .filter(session => session.status === 'scheduled')
        .sort((a, b) => a.start_at.getTime() - b.start_at.getTime())
        .slice(0, 3)

    const stats = [
        {
            icon: FiBookOpen,
            label: t('classesTaken'),
            value: mockDashboardStats.classesTaken,
            color: 'text-blue-500'
        },
        {
            icon: FiBookOpen,
            label: t('classesGiven'),
            value: mockDashboardStats.classesGiven,
            color: 'text-green-500'
        },
        {
            icon: FiClock,
            label: t('hoursTeaching'),
            value: mockDashboardStats.hoursTeaching,
            color: 'text-purple-500'
        },
        {
            icon: FiTrendingUp,
            label: t('progressLevel'),
            value: `${mockDashboardStats.progressLevel}%`,
            color: 'text-orange-500'
        }
    ]

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-(--text-1) mb-8">{t('dashboard')}</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <Card key={index}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg bg-(--bg-1) ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-(--text-2) text-sm">{stat.label}</p>
                                    <p className="text-2xl font-bold text-(--text-1)">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Hours per Month Chart */}
                <Card>
                    <h3 className="text-xl font-bold text-(--text-1) mb-4">{t('hoursPerMonth')}</h3>
                    <div className="space-y-3">
                        {chartDataHours.map((data, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <span className="text-(--text-2) text-sm w-12">{data.month}</span>
                                <div className="flex-1 bg-(--bg-1) rounded-full h-6 overflow-hidden">
                                    <div 
                                        className="h-full bg-(--button-1) rounded-full flex items-center justify-end pr-2"
                                        style={{ width: `${(data.hours / 25) * 100}%` }}
                                    >
                                        <span className="text-xs font-semibold text-(--button-1-text)">
                                            {data.hours}h
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Skills Distribution */}
                <Card>
                    <h3 className="text-xl font-bold text-(--text-1) mb-4">{t('skillsDistribution')}</h3>
                    <div className="space-y-3">
                        {[
                            { skill: 'React', value: 35, color: 'bg-blue-500' },
                            { skill: 'TypeScript', value: 25, color: 'bg-green-500' },
                            { skill: 'Node.js', value: 20, color: 'bg-purple-500' },
                            { skill: 'Python', value: 15, color: 'bg-orange-500' },
                            { skill: 'Otros', value: 5, color: 'bg-gray-500' }
                        ].map((data, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <span className="text-(--text-2) text-sm w-24">{data.skill}</span>
                                <div className="flex-1 bg-(--bg-1) rounded-full h-6 overflow-hidden">
                                    <div 
                                        className={`h-full ${data.color} rounded-full flex items-center justify-end pr-2`}
                                        style={{ width: `${data.value}%` }}
                                    >
                                        <span className="text-xs font-semibold text-white">
                                            {data.value}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Upcoming Sessions */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-(--text-1)">{t('upcomingSessions')}</h3>
                    <Link href="/sessions" className="text-(--button-1) hover:underline text-sm font-semibold">
                        {t('viewAll')}
                    </Link>
                </div>

                {upcomingSessions.length === 0 ? (
                    <p className="text-(--text-2) text-center py-8">{t('noUpcomingSessions')}</p>
                ) : (
                    <div className="space-y-4">
                        {upcomingSessions.map((session) => (
                            <div 
                                key={session.id}
                                className="flex items-center gap-4 p-4 bg-(--bg-1) rounded-lg"
                            >
                                <div className="p-3 bg-(--button-1) rounded-lg">
                                    <FiCalendar className="w-6 h-6 text-(--button-1-text)" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-(--text-1)">{session.title}</h4>
                                    <p className="text-sm text-(--text-2)">
                                        {session.start_at.toLocaleDateString()} • {session.start_at.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Avatar src={session.guest.image} alt={session.guest.name} size="sm" />
                                    <span className="text-sm text-(--text-1) font-medium">{session.guest.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}
