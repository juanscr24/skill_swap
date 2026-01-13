import { ACTIVITY_TYPES } from '@/data/activity'
import { Avatar } from '@/shared/components/ui/Avatar'
import { getActivityColor, formatTimestamp } from '@/shared/utils/activity'
import { FiMessageCircle, FiEye, FiMoreVertical } from 'react-icons/fi'
import { ActivityItemProps } from '../types/activity.types'

export const ActivityItem = ({ activity }: ActivityItemProps) => {
    const Icon = ACTIVITY_TYPES.find(t => t.value === activity.type)?.icon || FiMessageCircle
    const colorClasses = getActivityColor(activity.type)

    // Obtener el tipo en formato legible
    const getTypeLabel = (type: string) => {
        const labels: { [key: string]: string } = {
            'message': 'MENSAJE',
            'session': 'SESIÓN',
            'match': 'MATCH',
            'review': 'RESEÑA'
        }
        return labels[type] || type.toUpperCase()
    }

    // Determinar acciones según el tipo
    const renderActions = () => {
        if (activity.type === 'message') {
            return (
                <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-(--bg-1) hover:bg-(--bg-3) text-(--text-1) transition-colors">
                        <FiMessageCircle className="w-5 h-5" />
                    </button>
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
                <button className="px-4 py-2 rounded-lg bg-(--button-1) text-(--button-1-text) font-medium hover:opacity-90 transition-opacity">
                    Unirse
                </button>
            )
        }

        if (activity.type === 'match') {
            return (
                <button className="p-2 rounded-lg bg-(--bg-1) hover:bg-(--bg-3) text-(--text-1) transition-colors">
                    <FiEye className="w-5 h-5" />
                </button>
            )
        }

        if (activity.type === 'review') {
            return (
                <button className="px-4 py-2 rounded-lg bg-(--bg-1) hover:bg-(--bg-3) text-(--text-1) font-medium transition-colors">
                    Ver reseña
                </button>
            )
        }

        return null
    }

    return (
        <div className="bg-(--bg-2) border border-(--border-1) rounded-xl p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`shrink-0 p-3 rounded-xl ${colorClasses}`}>
                    <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold px-2 py-1 rounded bg-(--bg-1) text-(--text-2) uppercase tracking-wide">
                                    {getTypeLabel(activity.type)}
                                </span>
                                <span className="text-xs text-(--text-2)">
                                    {formatTimestamp(activity.timestamp)}
                                </span>
                            </div>
                            <h3 className="font-bold text-(--text-1) mb-1 text-lg">
                                {activity.title}
                            </h3>
                            <p className="text-sm text-(--text-2) leading-relaxed">
                                {activity.description}
                            </p>

                            {/* Rating for reviews */}
                            {activity.type === 'review' && activity.metadata?.rating && (
                                <div className="flex items-center gap-1 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-lg ${
                                                i < activity.metadata!.rating!
                                                    ? 'text-yellow-500'
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
                                <Avatar
                                    src={activity.user.image || '/default-avatar.png'}
                                    alt={activity.user.name || 'Usuario'}
                                    size="lg"
                                />
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

