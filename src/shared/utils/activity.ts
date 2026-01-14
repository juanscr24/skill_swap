import { ACTIVITY_COLORS } from '@/data/activity'

export const getActivityColor = (type: string) => ACTIVITY_COLORS[type as keyof typeof ACTIVITY_COLORS] || 'text-(--text-2) bg-(--bg-1)'

export const formatTimestamp = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Ahora'
    if (minutes < 60) return `Hace ${minutes}m`
    if (minutes < 1440) return `Hace ${Math.floor(minutes / 60)}h`
    return new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
}
