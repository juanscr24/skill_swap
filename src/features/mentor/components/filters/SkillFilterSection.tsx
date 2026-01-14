'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { FiCode, FiSearch } from 'react-icons/fi'
import { FilterCheckbox } from '@/shared/components/ui/FilterCheckbox'
import { FilterOption } from '../../types'
import { FilterAccordion } from './FilterAccordion'

interface SkillFilterSectionProps {
    isOpen: boolean
    onToggle: () => void
    selectedSkills: string[]
    onToggleSkill: (skillId: string) => void
    skillOptions: FilterOption[]
}

export const SkillFilterSection = ({
    isOpen,
    onToggle,
    selectedSkills,
    onToggleSkill,
    skillOptions
}: SkillFilterSectionProps) => {
    const t = useTranslations('mentors')
    const [skillSearch, setSkillSearch] = useState('')

    const filteredSkillOptions = skillOptions.filter(skill =>
        skill.label.toLowerCase().includes(skillSearch.toLowerCase())
    )

    return (
        <FilterAccordion
            title={t('skills')}
            icon={<FiCode className="w-5 h-5" />}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            <div className="space-y-3">
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
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {filteredSkillOptions.length > 0 ? (
                        filteredSkillOptions.map((skill) => (
                            <FilterCheckbox
                                key={skill.value}
                                label={skill.label}
                                checked={selectedSkills.includes(skill.value)}
                                onChange={() => onToggleSkill(skill.value)}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-(--text-2) text-center py-2">
                            {t('noSkillsFound')}
                        </p>
                    )}
                </div>
            </div>
        </FilterAccordion>
    )
}
