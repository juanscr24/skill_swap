'use client'

import { useTranslations } from 'next-intl'
import { FiGlobe } from 'react-icons/fi'
import { FilterCheckbox } from '@/shared/components/ui/FilterCheckbox'
import type { FilterOption } from '@/types/filters'
import { FilterAccordion } from './FilterAccordion'

interface LanguageFilterSectionProps {
    isOpen: boolean
    onToggle: () => void
    selectedLanguages: string[]
    onToggleLanguage: (langId: string) => void
    languageOptions: FilterOption[]
}

export const LanguageFilterSection = ({
    isOpen,
    onToggle,
    selectedLanguages,
    onToggleLanguage,
    languageOptions
}: LanguageFilterSectionProps) => {
    const t = useTranslations('mentors')

    return (
        <FilterAccordion
            title={t('languages')}
            icon={<FiGlobe className="w-5 h-5" />}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {languageOptions.length > 0 ? (
                    languageOptions.map((lang) => (
                        <FilterCheckbox
                            key={lang.value}
                            label={lang.label}
                            checked={selectedLanguages.includes(lang.value)}
                            onChange={() => onToggleLanguage(lang.value)}
                        />
                    ))
                ) : (
                    <p className="text-sm text-(--text-2) text-center py-2">
                        {t('noLanguagesFound')}
                    </p>
                )}
            </div>
        </FilterAccordion>
    )
}
