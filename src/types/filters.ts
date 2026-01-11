/**
 * 🧩 TIPOS CENTRALIZADOS PARA EL SISTEMA DE FILTROS DE MENTORES
 * 
 * Arquitectura:
 * - Tipos inmutables y fuertemente tipados
 * - Sin any
 * - Tipos reutilizables en toda la aplicación
 */

/**
 * Estado completo de los filtros de mentores
 */
export interface MentorFilters {
  skills: string[]           // Multi-select: IDs de skills
  languages: string[]        // Multi-select: IDs de idiomas
  minRating: number | null   // Single-select: Rating mínimo (1-5)
  availability: AvailabilityFilter | null  // Single-select: Disponibilidad
  city: string | null        // Single-select: Ciudad
}

/**
 * Opciones de disponibilidad
 */
export type AvailabilityFilter = 'available' | 'all'

/**
 * Estado inicial de filtros (todos vacíos)
 */
export const INITIAL_MENTOR_FILTERS: MentorFilters = {
  skills: [],
  languages: [],
  minRating: null,
  availability: null,
  city: null,
}

/**
 * Tipo para las opciones de un filtro multi-select
 */
export interface FilterOption {
  value: string
  label: string
}

/**
 * Tipo para las opciones de rating
 */
export interface RatingOption {
  value: number
  label: string
}

/**
 * Chip de filtro activo (para mostrar en UI)
 */
export interface ActiveFilterChip {
  key: string           // Identificador único del filtro
  type: keyof MentorFilters  // Tipo de filtro
  label: string         // Texto a mostrar en el chip
  value: string | number     // Valor del filtro
}

/**
 * Parámetros de query para la API
 */
export interface MentorQueryParams {
  skills?: string       // Separado por comas: "React,Python"
  languages?: string    // Separado por comas: "English,Spanish"
  minRating?: number
  availability?: AvailabilityFilter
  city?: string
}

/**
 * Props del hook useMentorFilters
 */
export interface UseMentorFiltersReturn {
  // Estado
  filters: MentorFilters
  activeChips: ActiveFilterChip[]
  activeFiltersCount: number
  isFiltersPanelOpen: boolean
  hasActiveFilters: boolean

  // Acciones
  setFilters: (filters: MentorFilters) => void
  updateFilter: <K extends keyof MentorFilters>(
    key: K,
    value: MentorFilters[K]
  ) => void
  toggleSkill: (skillId: string) => void
  toggleLanguage: (langId: string) => void
  clearFilters: () => void
  removeChip: (chipKey: string) => void
  toggleFiltersPanel: () => void
  applyFilters: () => void

  // Query params para API
  queryParams: MentorQueryParams
}
