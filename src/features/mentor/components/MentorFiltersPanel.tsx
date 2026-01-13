'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { FaCity } from 'react-icons/fa'
import { Button } from '@/shared/components/ui/Button'
import { SkillFilterSection } from './filters/SkillFilterSection'
import { LanguageFilterSection } from './filters/LanguageFilterSection'
import { RatingFilterSection } from './filters/RatingFilterSection'
import { AvailabilityFilterSection } from './filters/AvailabilityFilterSection'
import { MentorFilters, FilterOption } from '../types'

interface MentorFiltersPanelProps {
    isOpen: boolean
    filters: MentorFilters
    onClose: () => void
    onApply: () => void
    onClear: () => void
    onUpdateFilter: <K extends keyof MentorFilters>(
        key: K,
        value: MentorFilters[K]
    ) => void
    onToggleSkill: (skillId: string) => void
    onToggleLanguage: (langId: string) => void
    activeFiltersCount: number

    // Opciones dinámicas
    skillOptions: FilterOption[]
    languageOptions: FilterOption[]
    cityOptions: FilterOption[]
}

export const MentorFiltersPanel = ({
    isOpen,
    filters,
    onClose,
    onApply,
    onClear,
    onUpdateFilter,
    onToggleSkill,
    onToggleLanguage,
    activeFiltersCount,
    skillOptions,
    languageOptions,
    cityOptions,
}: MentorFiltersPanelProps) => {
    const t = useTranslations('mentors')

    // Estado para controlar qué secciones están expandidas
    const [expandedSections, setExpandedSections] = useState({
        skills: true,
        languages: false,
        rating: false,
        availability: true,
    })

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Panel lateral */}
            <div
                className={`fixed right-0 bottom-0 h-[calc(100vh-4rem)] max-md:h-[calc(100vh-3.5rem)] w-full max-w-sm max-sm:max-w-md bg-(--bg-1) z-50 transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-(--border-1)">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-(--bg-2) rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-(--text-1)" />
                            </button>
                            <h2 className="text-xl font-bold text-(--text-1)">
                                {t('filters')}
                            </h2>
                        </div>
                        <button
                            onClick={onClear}
                            className="text-sm text-(--button-1) hover:underline"
                        >
                            {t('clearFilters')}
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <SkillFilterSection
                            isOpen={expandedSections.skills}
                            onToggle={() => toggleSection('skills')}
                            selectedSkills={filters.skills}
                            onToggleSkill={onToggleSkill}
                            skillOptions={skillOptions}
                        />

                        <LanguageFilterSection
                            isOpen={expandedSections.languages}
                            onToggle={() => toggleSection('languages')}
                            selectedLanguages={filters.languages}
                            onToggleLanguage={onToggleLanguage}
                            languageOptions={languageOptions}
                        />

                        <RatingFilterSection
                            isOpen={expandedSections.rating}
                            onToggle={() => toggleSection('rating')}
                            minRating={filters.minRating}
                            onUpdateRating={(rating) => onUpdateFilter('minRating', rating)}
                        />

                        <AvailabilityFilterSection
                            isOpen={expandedSections.availability}
                            onToggle={() => toggleSection('availability')}
                            availability={filters.availability}
                            onUpdateAvailability={(value) => onUpdateFilter('availability', value)}
                        />

                        {/* City Filter - Si hay ciudades */}
                        {cityOptions.length > 0 && (
                            <div className="bg-(--bg-2) rounded-lg border border-(--border-1) p-4">
                                <div className='flex items-center mb-3 gap-2'>
                                    <FaCity className='w-5 h-5 text-(--button-1)' />
                                    <h3 className="font-semibold text-(--text-1)">{t('city')}</h3>
                                </div>
                                <select
                                    value={filters.city || ''}
                                    onChange={(e) => onUpdateFilter('city', e.target.value || null)}
                                    className="w-full px-4 py-2 bg-(--bg-1) border border-(--border-1) rounded-lg text-(--text-1) text-sm focus:outline-none focus:ring-2 focus:ring-(--button-1)"
                                >
                                    <option value="">{t('allCitiesOption')}</option>
                                    {cityOptions.map((city) => (
                                        <option key={city.value} value={city.value}>
                                            {city.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Footer - Botón de aplicar */}
                    <div className="p-4 border-t border-(--border-1)">
                        <Button
                            onClick={onApply}
                            primary
                            className="w-full"
                        >
                            {t('applyFilters')} ({activeFiltersCount})
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

