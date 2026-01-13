'use client'
import { Avatar } from '@/shared/components/ui/Avatar'
import { getActivityColor, formatTimestamp } from '@/shared/utils/activity'
import { ACTIVITY_TYPES } from '@/data/activity'
import { FiMessageCircle } from 'react-icons/fi'
import { RecentActivity } from '../types/activity.types'

interface NotificationItemProps {
    activity: RecentActivity
    onClick?: () => void
}

export const NotificationItem = ({ activity, onClick }: NotificationItemProps) => {
    const Icon = ACTIVITY_TYPES.find(t => t.value === activity.type)?.icon || FiMessageCircle
    const colorClasses = getActivityColor(activity.type)
    
    // Determinar si la notificación es nueva (menos de 1 hora)
    const isNew = new Date().getTime() - new Date(activity.timestamp).getTime() < 3600000

    return (
        <div
            className="p-4 hover:bg-(--bg-1) transition-colors cursor-pointer relative"
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
                            <Avatar
                                src={activity.user.image || '/default-avatar.png'}
                                alt={activity.user.name || 'Usuario'}
                                size="sm"
                            />
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
            {activity.type === 'message' && (
                <div className="mt-3 flex gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-(--button-1) text-(--button-1-text) rounded text-sm font-medium hover:opacity-90 transition-opacity">
                        Responder
                    </button>
                    <button className="px-3 py-1.5 bg-(--bg-1) text-(--text-2) rounded text-sm font-medium hover:bg-(--bg-3) transition-colors">
                        Ignorar
                    </button>
                </div>
            )}

            {activity.type === 'session' && activity.metadata?.status === 'pending' && (
                <div className="mt-3 flex gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-(--button-1) text-(--button-1-text) rounded text-sm font-medium hover:opacity-90 transition-opacity">
                        Unirse
                    </button>
                </div>
            )}
        </div>
    )
}
