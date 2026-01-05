/**
 * 🎨 COMPONENTE: MentorFiltersPanel
 * 
 * Panel lateral (drawer) que contiene todos los filtros
 * Se abre al hacer click en "Filtrar"
 * 
 * Arquitectura:
 * - Componente controlado (recibe filters y callbacks)
 * - Solo renderiza UI, no gestiona estado
 * - Usa componentes reutilizables
 */

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { FiChevronDown, FiChevronUp, FiCode, FiGlobe, FiStar, FiClock, FiSearch } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import { FilterCheckbox } from '@/components/ui/FilterCheckbox'
import type { MentorFilters, FilterOption, RatingOption } from '@/types/filters'
import { FaCity } from 'react-icons/fa'
import { X } from 'lucide-react'

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
    skillOptions,
    languageOptions,
    cityOptions,
}: MentorFiltersPanelProps) => {
    const t = useTranslations('mentors')

    const RATING_OPTIONS: RatingOption[] = [
        { value: 5, label: t('rating5Stars') },
        { value: 4, label: t('rating4Plus') },
        { value: 3, label: t('rating3Plus') },
        { value: 2, label: t('rating2Plus') },
        { value: 1, label: t('rating1Plus') },
    ]

    // Estado para controlar qué secciones están expandidas
    const [expandedSections, setExpandedSections] = useState({
        skills: true,
        languages: false,
        rating: false,
        availability: true,
    })

    // Estado para búsqueda de habilidades
    const [skillSearch, setSkillSearch] = useState('')

    // Handlers para multi-select
    const toggleSkill = (skillId: string) => {
        const newSkills = filters.skills.includes(skillId)
            ? filters.skills.filter((id) => id !== skillId)
            : [...filters.skills, skillId]
        onUpdateFilter('skills', newSkills)
    }

    const toggleLanguage = (langId: string) => {
        const newLanguages = filters.languages.includes(langId)
            ? filters.languages.filter((id) => id !== langId)
            : [...filters.languages, langId]
        onUpdateFilter('languages', newLanguages)
    }

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    // Filtrar habilidades por búsqueda
    const filteredSkillOptions = skillOptions.filter(skill =>
        skill.label.toLowerCase().includes(skillSearch.toLowerCase())
    )

    // Contar filtros activos
    const activeFiltersCount =
        filters.skills.length +
        filters.languages.length +
        (filters.minRating ? 1 : 0) +
        (filters.availability === 'available' ? 1 : 0) +
        (filters.city ? 1 : 0)

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
                className={`fixed right-0 bottom-0 h-[calc(100vh-4rem)] max-md:h-[calc(100vh-3.5rem)] max-md: w-full max-w-sm max-sm:max-w-md bg-(--bg-1) z-50 transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-(--border-1)">
                        <h2 className="text-xl font-bold text-(--text-1) flex items-center gap-2">
                            <X onClick={onClose} />
                            {t('filters')}
                        </h2>
                        <button
                            onClick={onClear}
                            className="text-sm text-(--button-1) hover:underline"
                        >
                            {t('clearFilters')}
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {/* Skills Accordion */}
                        <div className="bg-(--bg-2) rounded-lg border border-(--border-1) overflow-hidden">
                            <button
                                onClick={() => toggleSection('skills')}
                                className="w-full flex items-center justify-between p-4 hover:bg-(--bg-1) transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <FiCode className="w-5 h-5 text-(--button-1)" />
                                    <span className="font-semibold text-(--text-1)">{t('skills')}</span>
                                </div>
                                {expandedSections.skills ? (
                                    <FiChevronUp className="w-5 h-5 text-(--text-2)" />
                                ) : (
                                    <FiChevronDown className="w-5 h-5 text-(--text-2)" />
                                )}
                            </button>

                            {expandedSections.skills && (
                                <div className="p-4 pt-0 space-y-3">
                                    {/* Barra de búsqueda */}
                                    <div className="relative">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-2)" />
                                        <input
                                            type="text"
                                            placeholder={t('searchSkills')}
                                            value={skillSearch}
                                            onChange={(e) => setSkillSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-(--bg-1) border border-(--border-1) rounded-lg text-(--text-1) text-sm focus:outline-none focus:ring-2 focus:ring-(--button-1) placeholder:text-(--text-2)"
                                        />
                                    </div>

                                    {/* Lista de checkboxes */}
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {filteredSkillOptions.length > 0 ? (
                                            filteredSkillOptions.map((skill) => (
                                                <FilterCheckbox
                                                    key={skill.value}
                                                    label={skill.label}
                                                    checked={filters.skills.includes(skill.value)}
                                                    onChange={() => toggleSkill(skill.value)}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-sm text-(--text-2) text-center py-2">
                                                {t('noSkillsFound')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Languages Accordion */}
                        <div className="bg-(--bg-2) rounded-lg border border-(--border-1) overflow-hidden">
                            <button
                                onClick={() => toggleSection('languages')}
                                className="w-full flex items-center justify-between p-4 hover:bg-(--bg-1) transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <FiGlobe className="w-5 h-5 text-(--button-1)" />
                                    <span className="font-semibold text-(--text-1)">{t('languages')}</span>
                                </div>
                                {expandedSections.languages ? (
                                    <FiChevronUp className="w-5 h-5 text-(--text-2)" />
                                ) : (
                                    <FiChevronDown className="w-5 h-5 text-(--text-2)" />
                                )}
                            </button>

                            {expandedSections.languages && (
                                <div className="p-4 pt-0 space-y-2 max-h-48 overflow-y-auto">
                                    {languageOptions.length > 0 ? (
                                        languageOptions.map((lang) => (
                                            <FilterCheckbox
                                                key={lang.value}
                                                label={lang.label}
                                                checked={filters.languages.includes(lang.value)}
                                                onChange={() => toggleLanguage(lang.value)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-sm text-(--text-2) text-center py-2">
                                            {t('noLanguagesFound')}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Rating Accordion */}
                        <div className="bg-(--bg-2) rounded-lg border border-(--border-1) overflow-hidden">
                            <button
                                onClick={() => toggleSection('rating')}
                                className="w-full flex items-center justify-between p-4 hover:bg-(--bg-1) transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <FiStar className="w-5 h-5 text-(--button-1)" />
                                    <span className="font-semibold text-(--text-1)">{t('rating')}</span>
                                </div>
                                {expandedSections.rating ? (
                                    <FiChevronUp className="w-5 h-5 text-(--text-2)" />
                                ) : (
                                    <FiChevronDown className="w-5 h-5 text-(--text-2)" />
                                )}
                            </button>

                            {expandedSections.rating && (
                                <div className="p-4 pt-0 space-y-2">
                                    {RATING_OPTIONS.map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <input
                                                type="radio"
                                                name="rating"
                                                checked={filters.minRating === option.value}
                                                onChange={() => onUpdateFilter('minRating', option.value)}
                                                className="w-4 h-4 text-(--button-1) focus:ring-2 focus:ring-(--button-1) cursor-pointer"
                                            />
                                            <div className="flex items-center gap-1.5">
                                                <FiStar className="w-4 h-4 text-(--button-1) fill-(--button-1)" />
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
                                            checked={filters.minRating === null}
                                            onChange={() => onUpdateFilter('minRating', null)}
                                            className="w-4 h-4 text-(--button-1) focus:ring-2 focus:ring-(--button-1) cursor-pointer"
                                        />
                                        <span className="text-sm text-(--text-1) group-hover:text-(--button-1) transition-colors">
                                            {t('allRatings')}
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Availability Accordion */}
                        <div className="bg-(--bg-2) rounded-lg border border-(--border-1) overflow-hidden">
                            <button
                                onClick={() => toggleSection('availability')}
                                className="w-full flex items-center justify-between p-4 hover:bg-(--bg-1) transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <FiClock className="w-5 h-5 text-(--button-1)" />
                                    <span className="font-semibold text-(--text-1)">{t('availability')}</span>
                                </div>
                                {expandedSections.availability ? (
                                    <FiChevronUp className="w-5 h-5 text-(--text-2)" />
                                ) : (
                                    <FiChevronDown className="w-5 h-5 text-(--text-2)" />
                                )}
                            </button>

                            {expandedSections.availability && (
                                <div className="p-4 pt-0 space-y-3">
                                    {/* Toggle Ahora online */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-(--text-1)">{t('nowOnline')}</span>
                                        <button
                                            onClick={() => onUpdateFilter('availability', filters.availability === 'available' ? null : 'available')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${filters.availability === 'available' ? 'bg-(--button-1)' : 'bg-(--bg-3)'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filters.availability === 'available' ? 'translate-x-6' : 'translate-x-1'
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
                            )}
                        </div>

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
