/**
 * Formatea la hora de un mensaje.
 * Si es hoy, muestra la hora. Si es ayer o más antiguo, muestra la fecha.
 */
export const formatMessageTime = (date: Date | string): string => {
    const d = new Date(date)
    const now = new Date()
    const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24 && d.getDate() === now.getDate()) {
        return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString('es', { day: '2-digit', month: 'short' })
}

/**
 * Formatea el tiempo relativo (ej. "hace 5m", "ayer").
 */
export const formatRelativeTime = (date: Date | string | null): string => {
    if (!date) return 'recientemente'

    const d = new Date(date)
    const now = Date.now()
    const diffInMinutes = Math.floor((now - d.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'justo ahora'
    if (diffInMinutes < 60) return `hace ${diffInMinutes}m`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `hace ${diffInHours}h`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'ayer'
    if (diffInDays < 7) return `hace ${diffInDays}d`

    return d.toLocaleDateString('es', { day: '2-digit', month: 'short' })
}

/**
 * Formatea una fecha larga (ej. "lunes, 10 de enero").
 */
export const formatLongDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('es-ES', {
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
