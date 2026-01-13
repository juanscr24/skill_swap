'use client'
import { useTranslations } from 'next-intl'
import { FiTrash2 } from 'react-icons/fi'
import { MentorAvailability } from '@/shared/types/models.types'

interface AvailabilityListProps {
    availability: MentorAvailability[]
    isLoading: boolean
    onDelete: (id: string) => Promise<void>
}

export const AvailabilityList = ({
    availability,
    isLoading,
    onDelete,
}: AvailabilityListProps) => {
    const t = useTranslations('sessions')

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
        })
    }

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':')
        const hour = parseInt(hours)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
        return `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`
    }

    return (
        <div className="bg-(--bg-2) border border-(--border-1) rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-(--text-1)">
                    {t('currentAvailabilities')}
                </h2>
                <button className="text-(--button-1) hover:underline text-sm font-medium">
                    {t('viewFullCalendar')}
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-(--text-2)">{t('loading')}</div>
            ) : !availability || availability.length === 0 ? (
                <div className="text-center py-12 text-(--text-2)">
                    {t('noAvailabilitySlots')}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-(--border-1)">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-(--text-2) uppercase tracking-wider">
                                    {t('day')}
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-(--text-2) uppercase tracking-wider">
                                    {t('schedule')}
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-(--text-2) uppercase tracking-wider">
                                    {t('state')}
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-(--text-2) uppercase tracking-wider">
                                    {t('actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {availability.map((slot) => (
                                <tr
                                    key={slot.id}
                                    className="border-b border-(--border-1) hover:bg-(--bg-1) transition-colors"
                                >
                                    <td className="py-4 px-4 text-(--text-1) font-medium capitalize">
                                        {formatDate(slot.date)}
                                    </td>
                                    <td className="py-4 px-4 text-(--text-1)">
                                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-500">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            {t('recurring')}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <button
                                            onClick={() => onDelete(slot.id)}
                                            className="text-(--text-2) hover:text-red-500 transition-colors"
                                        >
                                            <FiTrash2 className="text-xl" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
