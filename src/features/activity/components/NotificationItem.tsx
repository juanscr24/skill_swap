'use client'
import Link from 'next/link'
import { getActivityColor, formatTimestamp } from '@/shared/utils/activity'
import { ACTIVITY_TYPES } from '@/data/activity'
import { FiMessageCircle } from 'react-icons/fi'
import { RecentActivity } from '../types/activity.types'
import { Avatar, Button } from '@/shared/components'

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
            className={`block p-4 hover:bg-(--bg-1) transition-colors cursor-pointer relative ${activity.isRead === false ? 'bg-(--bg-2)' : 'bg-transparent opacity-70'
                }`}
            onClick={onClick}
        >
            {/* Indicador de nuevo */}
            {activity.isRead === false && (
                <div className="absolute top-4 left-2 w-2 h-2 rounded-full bg-(--button-1) animate-pulse"></div>
            )}

            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`shrink-0 p-2 rounded-lg ${colorClasses}`}>
                    <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <p className={`font-semibold text-sm line-clamp-1 ${activity.isRead === false ? 'text-(--text-1)' : 'text-(--text-2)'
                            }`}>
                            {activity.title}
                        </p>
                        {
                            activity.user && (
                                <div className="flex items-center gap-2">
                                    <Avatar size='sm' src={activity.user?.image || ''} />
                                </div>
                            )
                        }
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
