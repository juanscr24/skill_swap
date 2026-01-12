import { ACTIVITY_TYPES } from '@/data/activity'
import { Avatar } from '@/shared/components/ui/Avatar'
import { getActivityColor, formatTimestamp } from '@/shared/utils/activity'
import { FiMessageCircle } from 'react-icons/fi'
import { ActivityItemProps } from '../types/activity.types'


export const ActivityItem = ({ activity }: ActivityItemProps) => {
    const Icon = ACTIVITY_TYPES.find(t => t.value === activity.type)?.icon || FiMessageCircle
    const colorClasses = getActivityColor(activity.type)

    return (
        <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-(--bg-1) transition-all border border-(--border-1)">
            <div className={`shrink-0 p-3 rounded-lg ${colorClasses}`}>
                <Icon className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-(--bg-1) text-(--text-2)">
                                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                            </span>
                            <span className="text-xs text-(--text-2)">
                                {formatTimestamp(activity.timestamp)}
                            </span>
                        </div>
                        <p className="font-semibold text-(--text-1) mb-1 line-clamp-1">
                            {activity.title}
                        </p>
                        <p className="text-sm text-(--text-2) line-clamp-2">
                            {activity.description}
                        </p>
                    </div>
                    {activity.user && (
                        <Avatar
                            src={activity.user.image || '/default-avatar.png'}
                            alt={activity.user.name || 'Usuario'}
                            size="md"
                        />
                    )}
                </div>
                {/* Metadata específico */}
                {activity.type === 'review' && activity.metadata?.rating && (
                    <div className="flex items-center gap-1">
                        {/* Stars rating */}
                    </div>
                )}
            </div>
        </div>
    )
}
