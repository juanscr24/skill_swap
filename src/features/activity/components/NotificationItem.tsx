'use client'
import Link from 'next/link'
import { getActivityColor, formatTimestamp } from '@/shared/utils/activity'
import { ACTIVITY_TYPES } from '@/data/activity'
import { FiMessageCircle } from 'react-icons/fi'
import { RecentActivity } from '../types/activity.types'
import { Button } from '@/shared/components'

interface NotificationItemProps {
    activity: RecentActivity
    onClick?: () => void
}

export const NotificationItem = ({ activity, onClick }: NotificationItemProps) => {
    const Icon = ACTIVITY_TYPES.find(t => t.value === activity.type)?.icon || FiMessageCircle
    const colorClasses = getActivityColor(activity.type)

    // Determinar si la notificación es nueva (menos de 1 hora)
    const isNew = new Date().getTime() - new Date(activity.timestamp).getTime() < 3600000

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

    return (
        <Link
            href={getActivityLink()}
            className="block p-4 hover:bg-(--bg-1) transition-colors cursor-pointer relative"
            onClick={onClick}
        >
            {/* Indicador de nuevo */}
            {isNew && (
                <div className="absolute top-4 left-2 w-2 h-2 rounded-full bg-(--button-1)"></div>
            )}

            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`shrink-0 p-2 rounded-lg ${colorClasses}`}>
                    <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-(--text-1) text-sm line-clamp-1">
                            {activity.title}
                        </p>
                        {activity.user && (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {activity.user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-(--text-2) line-clamp-2 mb-2">
                        {activity.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs text-(--text-2)">
                        <span className="font-medium">
                            {formatTimestamp(activity.timestamp)}
                        </span>
                        {activity.metadata?.rating && (
                            <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={
                                                i < activity.metadata!.rating!
                                                    ? 'text-yellow-500'
                                                    : 'text-(--text-3)'
                                            }
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Action buttons for specific types */}
            {/* {activity.type === 'message' && (
                <div className="mt-3 flex gap-2">
                    <Button primary>
                        Responder
                    </Button>
                    <Button secondary>
                        Ignorar
                    </Button>
                </div>
            )} */}

            {activity.type === 'session' && activity.metadata?.status === 'pending' && (
                <div className="mt-3 flex gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-(--button-1) text-(--button-1-text) rounded text-sm font-medium hover:opacity-90 transition-opacity">
                        Unirse
                    </button>
                </div>
            )}
        </Link>
    )
}
