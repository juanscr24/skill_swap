import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ACTIVITY_TYPES } from '@/data/activity'
import { getActivityColor } from '@/shared/utils/activity'
import { FiMessageCircle, FiEye, FiMoreVertical } from 'react-icons/fi'
import { ActivityItemProps } from '../types/activity.types'
import { Avatar } from '@/shared/components'

export const ActivityItem = ({ activity }: ActivityItemProps) => {
    const t = useTranslations('activity')
    const Icon = ACTIVITY_TYPES.find(t => t.value === activity.type)?.icon || FiMessageCircle
    const colorClasses = getActivityColor(activity.type)

    // Obtener el tipo en formato legible
    const getTypeLabel = (type: string) => {
        const labels: { [key: string]: string } = {
            'message': t('types.message'),
            'session': t('types.session'),
            'match': t('types.match'),
            'review': t('types.review')
        }
        return labels[type] || type.toUpperCase()
    }

    // Determinar la ruta según el tipo de actividad
    const getActivityLink = () => {
        switch (activity.type) {
            case 'message':
                return '/chats'
            case 'match':
                return '/matching'
            case 'review':
                return '/reviews'
            case 'session':
                return '/sessions'
            default:
                return '#'
        }
    }

    // Determinar acciones según el tipo
    const renderActions = () => {
        if (activity.type === 'message') {
            return (
                <div className="flex gap-2">
                    <Link
                        href="/chats"
                        className="p-2 rounded-lg bg-(--bg-1) hover:bg-(--bg-3) text-(--text-1) transition-colors"
                    >
                        <FiMessageCircle className="w-5 h-5" />
                    </Link>
                    <button className="p-2 rounded-lg bg-(--bg-1) hover:bg-(--bg-3) text-(--text-1) transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )
        }

        if (activity.type === 'session') {
            return (
                <Link
                    href="/sessions"
                    className="px-4 py-2 rounded-lg bg-(--button-1) text-(--button-1-text) font-medium hover:opacity-90 transition-opacity inline-block"
                >
                    {t('actions.join')}
                </Link>
            )
        }

        if (activity.type === 'match') {
            return (
                <Link
                    href="/matching"
                    className="p-2 rounded-lg bg-(--bg-1) hover:bg-(--bg-3) text-(--text-1) transition-colors inline-block"
                >
                    <FiEye className="w-5 h-5" />
                </Link>
            )
        }

        if (activity.type === 'review') {
            return (
                <Link
                    href="/reviews"
                    className="px-4 py-2 rounded-lg bg-(--bg-1) hover:bg-(--bg-3) text-(--text-1) font-medium transition-colors inline-block"
                >
                    {t('actions.viewReview')}
                </Link>
            )
        }

        return null
    }

    return (
        <div className="bg-(--bg-2) border border-(--border-1) rounded-xl p-5 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`shrink-0 p-3 rounded-xl ${colorClasses}`}>
                    <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-(--bg-3) text-(--button-1) uppercase tracking-wider">
                                    {getTypeLabel(activity.type)}
                                </span>
                            </div>
                            <h3 className="font-bold text-(--text-1) mb-1.5 text-base leading-snug">
                                {activity.title}
                            </h3>
                            <p className="text-sm text-(--text-2) leading-relaxed">
                                {activity.description}
                            </p>

                            {/* Rating for reviews */}
                            {activity.type === 'review' && activity.metadata?.rating && (
                                <div className="flex items-center gap-0.5 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-base ${i < activity.metadata!.rating!
                                                ? 'text-yellow-400'
                                                : 'text-(--text-3)'
                                                }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Avatar */}
                        {activity.user && (
                            <div className="flex items-center gap-2">
                                <Avatar size='md' src={activity.user?.image || ''} />
                                <button className="p-1 hover:bg-(--bg-1) rounded transition-colors">
                                    <FiMoreVertical className="w-5 h-5 text-(--text-2)" />
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Actions */}
                    <div className="mt-3 flex items-center justify-end">
                        {renderActions()}
                    </div>
                </div>
            </div>
        </div>
    )
}

