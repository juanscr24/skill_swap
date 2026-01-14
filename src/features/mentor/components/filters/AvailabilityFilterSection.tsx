'use client'

import { useTranslations } from 'next-intl'
import { FiClock } from 'react-icons/fi'
import { FilterCheckbox } from '@/shared/components/ui/FilterCheckbox'
import { FilterAccordion } from './FilterAccordion'
import { AvailabilityFilter } from '../../types'

interface AvailabilityFilterSectionProps {
    isOpen: boolean
    onToggle: () => void
    availability: AvailabilityFilter | null
    onUpdateAvailability: (value: AvailabilityFilter | null) => void
}

export const AvailabilityFilterSection = ({
    isOpen,
    onToggle,
    availability,
    onUpdateAvailability
}: AvailabilityFilterSectionProps) => {
    const t = useTranslations('mentors')

    return (
        <FilterAccordion
            title={t('availability')}
            icon={<FiClock className="w-5 h-5" />}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            <div className="space-y-3">
                {/* Toggle Ahora online */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-(--text-1)">{t('nowOnline')}</span>
                    <button
                        onClick={() => onUpdateAvailability(availability === 'available' ? null : 'available')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${availability === 'available' ? 'bg-(--button-1)' : 'bg-(--bg-3)'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${availability === 'available' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>

                {/* Checkboxes adicionales */}
                <FilterCheckbox
                    label={t('weekends')}
                    checked={false}
                    onChange={() => { }}
                />
                <FilterCheckbox
                    label={t('weekdays')}
                    checked={false}
                    onChange={() => { }}
                />
            </div>
        </FilterAccordion>
    )
}
