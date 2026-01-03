// Dashboard Types - Tipado estricto para el dashboard

import { IconType } from 'react-icons'

/**
 * Estadísticas generales del dashboard
 */
export interface DashboardStats {
  classesGiven: number
  classesTaken: number
  totalHours: number
  totalCompleted: number
  weeklyChange?: {
    classesGiven: number
    classesTaken: number
    totalHours: number
  }
}

/**
 * Configuración de una tarjeta de estadística
 */
export interface StatCardConfig {
  icon: IconType
  label: string
  value: number | string
  color: string
  change?: number // Variación respecto a la semana anterior
  trend?: 'up' | 'down' | 'neutral'
}

/**
 * Sesión próxima
 */
export interface UpcomingSession {
  id: string
  title: string
  description: string | null
  start_at: Date
  end_at: Date
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'rejected'
  otherUser: {
    id: string
    name: string | null
    image: string | null
  } | null
}

/**
 * Actividad reciente del usuario
 */
export interface RecentActivity {
  id: string
  type: 'message' | 'match' | 'review' | 'session'
  title: string
  description: string
  timestamp: Date
  user?: {
    id: string
    name: string | null
    image: string | null
  }
  metadata?: {
    rating?: number
    status?: string
  }
}

/**
 * Impacto del usuario en la plataforma
 */
export interface UserImpact {
  skillsOffered: number
  peopleHelped: number
  averageRating: number
  activeLanguages: number
  totalReviews: number
}

/**
 * Acción rápida en el dashboard
 */
export interface QuickAction {
  id: string
  label: string
  description: string
  icon: IconType
  href: string
  color: string
  bgColor: string
}

/**
 * Props para secciones del dashboard
 */
export interface DashboardSectionProps {
  className?: string
}
