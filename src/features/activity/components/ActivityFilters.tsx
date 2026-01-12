'use client'
import { Button } from '@/shared/components/ui'
import { ACTIVITY_TYPES } from '@/data/activity'
import { FiFilter } from 'react-icons/fi'
import { ActivityFiltersProps } from '../types/activity.types'

export const ActivityFilters = ({ filterType, onFilterChange }: ActivityFiltersProps) => (
    <div className="bg-(--bg-2) border border-(--border-1) rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
            <FiFilter className="w-5 h-5 text-(--text-2)" />
            <span className="text-sm font-semibold text-(--text-1)">Filtrar:</span>
        </div>
        <div className="flex flex-wrap gap-2">
            {ACTIVITY_TYPES.map(({ value, label }) => (
                <Button
                    key={value}
                    primary={filterType === value}
                    secondary={filterType !== value}
                    onClick={() => onFilterChange(value)}
                >
                    {label}
                </Button>
            ))}
        </div>
    </div>
)
