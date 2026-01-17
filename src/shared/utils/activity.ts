import { ACTIVITY_COLORS } from '@/data/activity'

export const getActivityColor = (type: string) => ACTIVITY_COLORS[type as keyof typeof ACTIVITY_COLORS] || 'text-(--text-2) bg-(--bg-1)'

/**
 * Formatea el timestamp de una actividad de forma relativa
 * @param date - La fecha a formatear
 * @param locale - El locale a usar (por defecto 'es')
 */
export const formatTimestamp = (date: Date, locale: string = 'es'): string => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)

    const translations = {
        es: {
            now: 'Ahora',
            ago: 'Hace',
            minute: 'm',
            hour: 'h'
        },
        en: {
            now: 'Now',
            ago: '',
            minute: 'm ago',
            hour: 'h ago'
        }
    }

    const t = translations[locale as keyof typeof translations] || translations.es

    if (minutes < 1) return t.now
    if (minutes < 60) return locale === 'es' ? `${t.ago} ${minutes}${t.minute}` : `${minutes}${t.minute}`
    if (minutes < 1440) return locale === 'es' ? `${t.ago} ${Math.floor(minutes / 60)}${t.hour}` : `${Math.floor(minutes / 60)}${t.hour}`
    return new Date(date).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}
