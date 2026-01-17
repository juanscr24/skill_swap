/**
 * Formatea la hora de un mensaje.
 * Si es hoy, muestra la hora. Si es ayer o más antiguo, muestra la fecha.
 * @param date - La fecha a formatear
 * @param locale - El locale a usar (por defecto 'es')
 */
export const formatMessageTime = (date: Date | string, locale: string = 'es'): string => {
    const d = new Date(date)
    const now = new Date()
    const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24 && d.getDate() === now.getDate()) {
        return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short' })
}

/**
 * Formatea el tiempo relativo (ej. "hace 5m", "ayer").
 * @param date - La fecha a formatear
 * @param locale - El locale a usar (por defecto 'es')
 */
export const formatRelativeTime = (date: Date | string | null, locale: string = 'es'): string => {
    if (!date) return locale === 'es' ? 'recientemente' : 'recently'

    const d = new Date(date)
    const now = Date.now()
    const diffInMinutes = Math.floor((now - d.getTime()) / (1000 * 60))

    const translations = {
        es: {
            justNow: 'justo ahora',
            ago: 'hace',
            yesterday: 'ayer',
            minute: 'm',
            hour: 'h',
            day: 'd'
        },
        en: {
            justNow: 'just now',
            ago: '',
            yesterday: 'yesterday',
            minute: 'm ago',
            hour: 'h ago',
            day: 'd ago'
        }
    }

    const t = translations[locale as keyof typeof translations] || translations.es

    if (diffInMinutes < 1) return t.justNow
    if (diffInMinutes < 60) return locale === 'es' ? `${t.ago} ${diffInMinutes}${t.minute}` : `${diffInMinutes}${t.minute}`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return locale === 'es' ? `${t.ago} ${diffInHours}${t.hour}` : `${diffInHours}${t.hour}`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return t.yesterday
    if (diffInDays < 7) return locale === 'es' ? `${t.ago} ${diffInDays}${t.day}` : `${diffInDays}${t.day}`

    return d.toLocaleDateString(locale, { day: '2-digit', month: 'short' })
}

/**
 * Formatea una fecha larga (ej. "lunes, 10 de enero").
 * @param date - La fecha a formatear
 * @param locale - El locale a usar (por defecto 'es')
 */
export const formatLongDate = (date: Date | string, locale: string = 'es'): string => {
    return new Date(date).toLocaleDateString(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    })
}

/**
 * Formatea solo la hora (ej. "14:30").
 */
export const formatTime = (date: Date | string): string => {
    return new Date(date).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    })
}
