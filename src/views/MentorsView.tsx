/**
 * 🎯 VISTA: Catálogo de Mentores
 * 
 * Arquitectura:
 * - Usa useMentorFilters para la lógica de filtros
 * - Usa useMentors para fetch de datos
 * - Componentes UI separados y reutilizables
 * - Sin lógica de negocio en el componente
 */

'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { FiFilter } from 'react-icons/fi'
import { useMentors } from '@/hooks/useMentors'
import { useMentorFilters } from '@/hooks/useMentorFilters'
import { useMentorFilterOptions } from '@/hooks/useMentorFilterOptions'
import { Card } from '@/shared/components/ui/Card'
import { MentorCard } from '@/shared/components/ui/MentorCard'
import { MoreMentorsCard } from '@/shared/components/ui/MoreMentorsCard'
import { SearchBar } from '@/shared/components/ui/SearchBar'
import { Button } from '@/shared/components/ui/Button'
import { LoadingSpinner } from '@/shared/components'
import { FilterChip } from '@/shared/components/ui/FilterChip'
import { MentorFiltersPanel } from '@/components/features/mentors/MentorFiltersPanel'
import type { FilterOption } from '@/types/filters'

export const MentorsView = () => {
  const t = useTranslations('mentors')
  const [search, setSearch] = useState('')

  // Hook de filtros (lógica centralizada)
  const {
    filters,
    activeChips,
    isFiltersPanelOpen,
    hasActiveFilters,
    updateFilter,
    clearFilters,
    removeChip,
    toggleFiltersPanel,
    applyFilters,
    queryParams,
  } = useMentorFilters()

  // Fetch de mentores con filtros aplicados
  const { mentors, isLoading, error } = useMentors(queryParams)

  // Fetch de opciones reales de filtros (solo skills/languages/cities de tus mentors)
  const { options: filterOptions, isLoading: isLoadingOptions } = useMentorFilterOptions()

  // Mapear skills a opciones de filtro
  const skillOptions: FilterOption[] = useMemo(() => {
    return filterOptions.skills.map((skill) => ({
      value: skill.name,
      label: skill.name,
    }))
  }, [filterOptions.skills])

  // Mapear languages a opciones de filtro
  const languageOptions: FilterOption[] = useMemo(() => {
    return filterOptions.languages.map((lang) => ({
      value: lang.name,
      label: lang.name,
    }))
  }, [filterOptions.languages])

  // Mapear ciudades a opciones de filtro
  const cityOptions: FilterOption[] = useMemo(() => {
    return filterOptions.cities.map((city) => ({
      value: city,
      label: city,
    }))
  }, [filterOptions.cities])

  // Filtrar mentores por búsqueda local (nombre)
  const filteredMentors = useMemo(() => {
    if (!search) return mentors
    return mentors.filter((mentor) =>
      mentor.name?.toLowerCase().includes(search.toLowerCase())
    )
  }, [mentors, search])

  // Mapear chips activos con nombres reales
  const mappedActiveChips = useMemo(() => {
    return activeChips.map((chip) => {
      let displayLabel = chip.label

      // Mapear IDs de skills a nombres
      if (chip.type === 'skills') {
        const skill = filterOptions.skills.find((s) => s.name === chip.value)
        displayLabel = skill?.name || chip.label
      }

      // Mapear IDs de languages a nombres
      if (chip.type === 'languages') {
        const lang = filterOptions.languages.find((l) => l.name === chip.value)
        displayLabel = lang?.name || chip.label
      }

      return {
        ...chip,
        label: displayLabel,
      }
    })
  }, [activeChips, filterOptions.skills, filterOptions.languages])

  return (
    <div className="p-8 max-md:p-6 max-sm:p-4">
      {/* Header */}
      <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-8 max-md:mb-6 max-sm:mb-4">
        {t('mentors')}
      </h1>

      {/* Search & Filter Controls */}
      <Card className="mb-6">
        <div className="flex gap-4 max-sm:flex-col">
          {/* Search Bar */}
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={t('search')}
            />
          </div>

          {/* Filter Button */}
          <Button
            onClick={toggleFiltersPanel}
            primary={hasActiveFilters}
            secondary={!hasActiveFilters}
            className="flex items-center gap-2 max-sm:w-full max-sm:justify-center"
          >
            <FiFilter className="w-5 h-5" />
            <span>{t('filters')}</span>
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                {activeChips.length}
              </span>
            )}
          </Button>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-(--border-1)">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-(--text-2) font-medium">
                Filtros activos:
              </span>
              {mappedActiveChips.map((chip) => (
                <FilterChip
                  key={chip.key}
                  label={chip.label}
                  onRemove={() => removeChip(chip.key)}
                />
              ))}
              <button
                onClick={clearFilters}
                className="text-sm text-(--text-2) hover:text-(--text-1) underline ml-2"
              >
                {t('clearFilters')}
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Error state */}
      {error && (
        <Card className="p-6 text-center">
          <p className="text-red-500">{error.message}</p>
        </Card>
      )}

      {/* Results */}
      {!isLoading && !error && (
        <>
          {/* Results Count */}
          {filteredMentors.length > 0 && (
            <p className="text-(--text-2) mb-4 max-sm:mb-3 max-sm:text-sm">
              {filteredMentors.length} {t('results')}
            </p>
          )}

          {/* Mentors Grid */}
          <div className="grid grid-cols-5 max-2xl:grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6 max-md:gap-4 max-sm:gap-3">
            {filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                id={mentor.id}
                name={mentor.name || 'Sin nombre'}
                image={mentor.image}
                city={mentor.city}
                bio={mentor.bio}
                averageRating={mentor.averageRating}
                totalReviews={mentor.totalReviews}
                skills={mentor.skills}
                isAvailable={true}
              />
            ))}
            {/* More Mentors Coming Soon Card - Always shown */}
            <MoreMentorsCard />
          </div>
        </>
      )}

      {/* Filters Panel (Drawer) */}
      <MentorFiltersPanel
        isOpen={isFiltersPanelOpen}
        filters={filters}
        onClose={toggleFiltersPanel}
        onApply={applyFilters}
        onClear={clearFilters}
        onUpdateFilter={updateFilter}
        skillOptions={skillOptions}
        languageOptions={languageOptions}
        cityOptions={cityOptions}
      />
    </div>
  )
}
