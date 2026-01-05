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

import { useTranslations } from 'next-intl'
import { FiX, FiStar } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import { FilterCheckbox } from '@/components/ui/FilterCheckbox'
import type { MentorFilters, FilterOption, RatingOption } from '@/types/filters'

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

const RATING_OPTIONS: RatingOption[] = [
  { value: 5, label: '5 estrellas' },
  { value: 4, label: '4+ estrellas' },
  { value: 3, label: '3+ estrellas' },
  { value: 2, label: '2+ estrellas' },
  { value: 1, label: '1+ estrella' },
]

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

  if (!isOpen) return null

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

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel lateral */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-(--bg-2) shadow-2xl z-50 animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-(--border-1)">
            <h2 className="text-2xl font-bold text-(--text-1)">
              {t('filters')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-(--bg-1) rounded-lg transition-colors"
              aria-label="Cerrar filtros"
            >
              <FiX className="w-6 h-6 text-(--text-2)" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Skills Filter */}
            <div>
              <h3 className="text-lg font-semibold text-(--text-1) mb-4">
                Habilidades
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {skillOptions.map((skill) => (
                  <FilterCheckbox
                    key={skill.value}
                    label={skill.label}
                    checked={filters.skills.includes(skill.value)}
                    onChange={() => toggleSkill(skill.value)}
                  />
                ))}
              </div>
            </div>

            {/* Languages Filter */}
            <div>
              <h3 className="text-lg font-semibold text-(--text-1) mb-4">
                Idiomas
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {languageOptions.map((lang) => (
                  <FilterCheckbox
                    key={lang.value}
                    label={lang.label}
                    checked={filters.languages.includes(lang.value)}
                    onChange={() => toggleLanguage(lang.value)}
                  />
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="text-lg font-semibold text-(--text-1) mb-4">
                Calificación mínima
              </h3>
              <div className="space-y-2">
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
                {/* Opción "Todas" */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === null}
                    onChange={() => onUpdateFilter('minRating', null)}
                    className="w-4 h-4 text-(--button-1) focus:ring-2 focus:ring-(--button-1) cursor-pointer"
                  />
                  <span className="text-sm text-(--text-1) group-hover:text-(--button-1) transition-colors">
                    Todas las calificaciones
                  </span>
                </label>
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <h3 className="text-lg font-semibold text-(--text-1) mb-4">
                Disponibilidad
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="availability"
                    checked={filters.availability === 'available'}
                    onChange={() => onUpdateFilter('availability', 'available')}
                    className="w-4 h-4 text-(--button-1) focus:ring-2 focus:ring-(--button-1) cursor-pointer"
                  />
                  <span className="text-sm text-(--text-1) group-hover:text-(--button-1) transition-colors">
                    Solo disponibles
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="availability"
                    checked={filters.availability === null}
                    onChange={() => onUpdateFilter('availability', null)}
                    className="w-4 h-4 text-(--button-1) focus:ring-2 focus:ring-(--button-1) cursor-pointer"
                  />
                  <span className="text-sm text-(--text-1) group-hover:text-(--button-1) transition-colors">
                    Todos
                  </span>
                </label>
              </div>
            </div>

            {/* City Filter */}
            {cityOptions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-(--text-1) mb-4">
                  Ciudad
                </h3>
                <select
                  value={filters.city || ''}
                  onChange={(e) => onUpdateFilter('city', e.target.value || null)}
                  className="w-full px-4 py-2 bg-(--bg-1) border border-(--border-1) rounded-lg text-(--text-1) focus:outline-none focus:ring-2 focus:ring-(--button-1)"
                >
                  <option value="">Todas las ciudades</option>
                  {cityOptions.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Footer - Botones de acción */}
          <div className="p-6 border-t border-(--border-1) space-y-3">
            <Button
              onClick={onApply}
              className="w-full"
            >
              Aplicar filtros
            </Button>
            <button
              onClick={onClear}
              className="w-full py-2.5 text-(--text-2) hover:text-(--text-1) font-medium transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
