'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  MentorFilters,
  INITIAL_MENTOR_FILTERS,
  ActiveFilterChip,
  MentorQueryParams,
  UseMentorFiltersReturn
} from '../types'

const initialFilters: MentorFilters = {
  skills: [],
  languages: [],
  minRating: null,
  availability: null,
  city: null,
}

/**
 * Hook para gestionar el estado y lógica de filtros de mentores
 */
export function useMentorFilters(): UseMentorFiltersReturn {
  // Estado local (draft) - se actualiza mientras el usuario edita
  const [draftFilters, setDraftFilters] = useState<MentorFilters>(initialFilters)

  // Estado aplicado - solo se actualiza al hacer click en "Aplicar"
  const [appliedFilters, setAppliedFilters] = useState<MentorFilters>(initialFilters)

  // Estado del panel de filtros
  const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false)

  /**
   * Verificar si hay filtros activos
   */
  const hasActiveFilters = useMemo(() => {
    return (
      appliedFilters.skills.length > 0 ||
      appliedFilters.languages.length > 0 ||
      appliedFilters.minRating !== null ||
      appliedFilters.availability !== null ||
      appliedFilters.city !== null
    )
  }, [appliedFilters])

  /**
   * Generar chips de filtros activos para mostrar en UI
   */
  const activeChips = useMemo((): ActiveFilterChip[] => {
    const chips: ActiveFilterChip[] = []

    // Skills chips
    appliedFilters.skills.forEach((skillId) => {
      chips.push({
        key: `skill-${skillId}`,
        type: 'skills',
        label: skillId, // El componente debe mapear a nombre real
        value: skillId,
      })
    })

    // Languages chips
    appliedFilters.languages.forEach((langId) => {
      chips.push({
        key: `language-${langId}`,
        type: 'languages',
        label: langId, // El componente debe mapear a nombre real
        value: langId,
      })
    })

    // Rating chip
    if (appliedFilters.minRating !== null) {
      chips.push({
        key: 'rating',
        type: 'minRating',
        label: `${appliedFilters.minRating}+ ⭐`,
        value: appliedFilters.minRating,
      })
    }

    // Availability chip
    if (appliedFilters.availability) {
      chips.push({
        key: 'availability',
        type: 'availability',
        label: appliedFilters.availability === 'available' ? 'Disponible' : 'Todos',
        value: appliedFilters.availability,
      })
    }

    // City chip
    if (appliedFilters.city) {
      chips.push({
        key: 'city',
        type: 'city',
        label: appliedFilters.city,
        value: appliedFilters.city,
      })
    }

    return chips
  }, [appliedFilters])

  /**
   * Generar query params para la API
   */
  const queryParams = useMemo((): MentorQueryParams => {
    const params: MentorQueryParams = {}

    if (appliedFilters.skills.length > 0) {
      params.skills = appliedFilters.skills.join(',')
    }

    if (appliedFilters.languages.length > 0) {
      params.languages = appliedFilters.languages.join(',')
    }

    if (appliedFilters.minRating !== null) {
      params.minRating = appliedFilters.minRating
    }

    if (appliedFilters.availability) {
      params.availability = appliedFilters.availability
    }

    if (appliedFilters.city) {
      params.city = appliedFilters.city
    }

    return params
  }, [appliedFilters])

  /**
   * Actualizar filtros draft (mientras el usuario edita)
   */
  const setFilters = useCallback((filters: MentorFilters) => {
    setDraftFilters(filters)
  }, [])

  /**
   * Actualizar un filtro específico
   */
  const updateFilter = useCallback(
    <K extends keyof MentorFilters>(key: K, value: MentorFilters[K]) => {
      setDraftFilters((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    []
  )

  /**
   * Aplicar filtros (confirmar cambios)
   */
  const applyFilters = useCallback(() => {
    setAppliedFilters(draftFilters)
    setIsFiltersPanelOpen(false)
  }, [draftFilters])

  /**
   * Limpiar todos los filtros
   */
  const clearFilters = useCallback(() => {
    setDraftFilters(initialFilters)
    setAppliedFilters(initialFilters)
  }, [])

  /**
   * Remover un chip específico
   */
  const removeChip = useCallback((chipKey: string) => {
    setAppliedFilters((prev) => {
      const newFilters = { ...prev }

      // Parsear el tipo de filtro del chipKey
      if (chipKey.startsWith('skill-')) {
        const skillId = chipKey.replace('skill-', '')
        newFilters.skills = prev.skills.filter((id) => id !== skillId)
      } else if (chipKey.startsWith('language-')) {
        const langId = chipKey.replace('language-', '')
        newFilters.languages = prev.languages.filter((id) => id !== langId)
      } else if (chipKey === 'rating') {
        newFilters.minRating = null
      } else if (chipKey === 'availability') {
        newFilters.availability = null
      } else if (chipKey === 'city') {
        newFilters.city = null
      }

      return newFilters
    })

    // Sincronizar draft con applied después de remover
    setDraftFilters((prev) => {
      const newFilters = { ...prev }

      if (chipKey.startsWith('skill-')) {
        const skillId = chipKey.replace('skill-', '')
        newFilters.skills = prev.skills.filter((id) => id !== skillId)
      } else if (chipKey.startsWith('language-')) {
        const langId = chipKey.replace('language-', '')
        newFilters.languages = prev.languages.filter((id) => id !== langId)
      } else if (chipKey === 'rating') {
        newFilters.minRating = null
      } else if (chipKey === 'availability') {
        newFilters.availability = null
      } else if (chipKey === 'city') {
        newFilters.city = null
      }

      return newFilters
    })
  }, [])

  /**
   * Toggle panel de filtros
   */
  const toggleFiltersPanel = useCallback(() => {
    setIsFiltersPanelOpen((prev) => !prev)
    // Sincronizar draft con applied al abrir
    if (!isFiltersPanelOpen) {
      setDraftFilters(appliedFilters)
    }
  }, [isFiltersPanelOpen, appliedFilters])

  /**
   * Contar filtros activos (draft)
   */
  const activeFiltersCount = useMemo(() => {
    return (
      draftFilters.skills.length +
      draftFilters.languages.length +
      (draftFilters.minRating ? 1 : 0) +
      (draftFilters.availability === 'available' ? 1 : 0) +
      (draftFilters.city ? 1 : 0)
    )
  }, [draftFilters])

  /**
   * Toggle skill helper
   */
  const toggleSkill = useCallback((skillId: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((id) => id !== skillId)
        : [...prev.skills, skillId],
    }))
  }, [])

  /**
   * Toggle language helper
   */
  const toggleLanguage = useCallback((langId: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      languages: prev.languages.includes(langId)
        ? prev.languages.filter((id) => id !== langId)
        : [...prev.languages, langId],
    }))
  }, [])

  return {
    filters: draftFilters,
    activeChips,
    activeFiltersCount,
    isFiltersPanelOpen,
    hasActiveFilters,
    setFilters,
    updateFilter,
    toggleSkill,
    toggleLanguage,
    clearFilters,
    removeChip,
    toggleFiltersPanel,
    applyFilters,
    queryParams,
  }
}
