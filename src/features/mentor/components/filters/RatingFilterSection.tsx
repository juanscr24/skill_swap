'use client'

import { useTranslations } from 'next-intl'
import { FiStar } from 'react-icons/fi'
import type { RatingOption } from '@/types/filters'
import { FilterAccordion } from './FilterAccordion'

interface RatingFilterSectionProps {
    isOpen: boolean
    onToggle: () => void
    minRating: number | null
    onUpdateRating: (rating: number | null) => void
}

export const RatingFilterSection = ({
    isOpen,
    onToggle,
    minRating,
    onUpdateRating,
}: RatingFilterSectionProps) => {
    const t = useTranslations('mentors')

    const ratingOptions: RatingOption[] = [
        { value: 5, label: t('rating5Stars') },
        { value: 4, label: t('rating4Plus') },
        { value: 3, label: t('rating3Plus') },
        { value: 2, label: t('rating2Plus') },
        { value: 1, label: t('rating1Plus') },
    ]

    return (
        <FilterAccordion
            title={t('rating')}
            icon={<FiStar className="w-5 h-5" />}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            <div className="space-y-2">
                {ratingOptions.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <input
                            type="radio"
                            name="rating"
                            checked={minRating === option.value}
                            onChange={() => onUpdateRating(option.value)}
                            className="w-4 h-4 text-(--button-1) focus:ring-2 focus:ring-(--button-1) cursor-pointer"
                        />
                        <div className="flex items-center gap-1.5">
                            <FiStar className={`w-4 h-4 ${minRating === option.value ? 'text-(--button-1) fill-(--button-1)' : 'text-(--text-2)'}`} />
                            <span className="text-sm text-(--text-1) group-hover:text-(--button-1) transition-colors">
                                {option.label}
                            </span>
                        </div>
                    </label>
                ))}
                <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="radio"
                        name="rating"
                        checked={minRating === null}
                        onChange={() => onUpdateRating(null)}
                        className="w-4 h-4 text-(--button-1) focus:ring-2 focus:ring-(--button-1) cursor-pointer"
                    />
                    <span className="text-sm text-(--text-1) group-hover:text-(--button-1) transition-colors">
                        {t('allRatings')}
                    </span>
                </label>
            </div>
        </FilterAccordion>
    )
}
