'use client'
import { useTranslations } from 'next-intl'
import { ACTIVITY_TYPES } from '@/data/activity'
import { ActivityFiltersProps } from '../types/activity.types'

export const ActivityFilters = ({ filterType, onFilterChange }: ActivityFiltersProps) => {
    const t = useTranslations('activity')
    
    const getFilterLabel = (value: string) => {
        const labels: { [key: string]: string } = {
            'all': t('filters.all'),
            'message': t('filters.messages'),
            'match': t('filters.matches'),
            'review': t('filters.reviews'),
            'session': t('filters.sessions')
        }
        return labels[value] || value
    }
    
    return (
        <div className="flex gap-2 flex-wrap">
            {ACTIVITY_TYPES.map(({ value, label, icon: Icon }) => {
                const isActive = filterType === value
                return (
                    <button
                        key={value}
                        onClick={() => onFilterChange(value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            filterType === value
                                ? 'bg-(--button-1) text-(--button-1-text)'
                                : 'bg-(--bg-2) text-(--text-2) hover:bg-(--bg-3) border border-(--border-1)'
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{getFilterLabel(value)}</span>
                    </button>
                )
            })}
        </div>
    )
}


