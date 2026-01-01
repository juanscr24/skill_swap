import { useTranslations } from "next-intl"
import type { MentorStatsProps } from '@/types'

export const MentorStats = ({
    totalSessions,
    totalHours,
    totalReviews,
    averageRating,
}: MentorStatsProps) => {
    const t = useTranslations('profile')

    const stats = [
        { label: 'Sesiones', value: totalSessions.toString() },
        { label: 'Asistencia', value: '100%' },
        { label: 'Resp. prom.', value: `${totalHours.toFixed(0)}h` },
        { label: 'recetas', value: totalReviews.toString() },
    ]

    return (
        <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1)">
            <h3 className="text-xl font-bold text-(--text-1) mb-4">Estadísticas</h3>
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-(--bg-1) rounded-xl p-4 text-center border border-(--border-1)"
                    >
                        <p className="text-2xl font-bold text-(--text-1) mb-1">{stat.value}</p>
                        <p className="text-sm text-(--text-2)">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
