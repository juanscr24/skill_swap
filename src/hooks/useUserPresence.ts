'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { UserPresence } from '@/types/chat'

interface UseUserPresenceOptions {
  userId?: string // ID del usuario a monitorear (si no se pasa, monitorea todos)
  enabled?: boolean
}

/**
 * Hook para manejar presencia de usuarios en tiempo real
 * - Actualiza automáticamente el estado online del usuario actual
 * - Monitorea la presencia de otros usuarios
 * - Detecta cuando los usuarios están online/offline
 */
export const useUserPresence = ({ userId, enabled = true }: UseUserPresenceOptions = {}) => {
  const { data: session } = useSession()
  const [presenceMap, setPresenceMap] = useState<Record<string, UserPresence>>({})
  const [isOnline, setIsOnline] = useState(true)
  const supabase = createClient()

  // Actualizar presencia del usuario actual
  const updateMyPresence = useCallback(
    async (online: boolean) => {
      if (!session?.user?.id || !enabled) return

      try {
        const response = await fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isOnline: online }),
        })

        if (response.ok) {
          setIsOnline(online)
        }
      } catch (error) {
        console.error('Error updating presence:', error)
      }
    },
    [session?.user?.id, enabled]
  )

  // Obtener presencia de un usuario específico
  const getUserPresence = useCallback(
    (targetUserId: string): UserPresence | undefined => {
      return presenceMap[targetUserId]
    },
    [presenceMap]
  )

  // Verificar si un usuario está online
  const isUserOnline = useCallback(
    (targetUserId: string): boolean => {
      const presence = presenceMap[targetUserId]
      if (!presence) return false

      // Considerar offline si no hay actualizaciones en los últimos 2 minutos
      const lastUpdate = new Date(presence.updated_at).getTime()
      const now = Date.now()
      const twoMinutes = 2 * 60 * 1000

      return presence.is_online && now - lastUpdate < twoMinutes
    },
    [presenceMap]
  )

  // Obtener el último "visto" de un usuario
  const getLastSeen = useCallback(
    (targetUserId: string): Date | null => {
      const presence = presenceMap[targetUserId]
      return presence ? new Date(presence.last_seen) : null
    },
    [presenceMap]
  )

  useEffect(() => {
    if (!enabled) return

    let channel: RealtimeChannel
    let heartbeatInterval: NodeJS.Timeout

    const init = async () => {
      // Marcar como online al montar
      if (session?.user?.id) {
        await updateMyPresence(true)

        // Heartbeat cada 30 segundos para mantener presencia activa
        heartbeatInterval = setInterval(() => {
          updateMyPresence(true)
        }, 30000)
      }

      // Suscribirse a cambios de presencia
      const filter = userId ? `user_id=eq.${userId}` : undefined

      channel = supabase
        .channel('user_presence_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_presence',
            filter,
          },
          (payload) => {
            const presence = payload.new as UserPresence

            if (payload.eventType === 'DELETE') {
              setPresenceMap((prev) => {
                const newMap = { ...prev }
                delete newMap[presence.user_id]
                return newMap
              })
            } else {
              setPresenceMap((prev) => ({
                ...prev,
                [presence.user_id]: presence,
              }))
            }
          }
        )
        .subscribe()

      // Fetch inicial de presencias si estamos monitoreando un usuario específico
      if (userId) {
        try {
          const response = await fetch(`/api/presence/${userId}`)
          if (response.ok) {
            const presence: UserPresence = await response.json()
            setPresenceMap({ [userId]: presence })
          }
        } catch (error) {
          console.error('Error fetching initial presence:', error)
        }
      }
    }

    init()

    // Manejar visibilidad de la página
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Usuario cambió de pestaña - mantener online pero sin heartbeat activo
        clearInterval(heartbeatInterval)
      } else {
        // Usuario volvió - reactivar heartbeat
        updateMyPresence(true)
        heartbeatInterval = setInterval(() => {
          updateMyPresence(true)
        }, 30000)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      clearInterval(heartbeatInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      // Marcar como offline al desmontar
      if (session?.user?.id) {
        updateMyPresence(false)
      }

      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [enabled, userId, session?.user?.id, updateMyPresence, supabase])

  // Manejar cierre de ventana/navegador
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session?.user?.id) {
        // Usar sendBeacon para garantizar que se envíe incluso al cerrar
        const blob = new Blob([JSON.stringify({ isOnline: false })], {
          type: 'application/json',
        })
        navigator.sendBeacon('/api/presence', blob)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [session?.user?.id])

  return {
    isOnline,
    presenceMap,
    getUserPresence,
    isUserOnline,
    getLastSeen,
    updateMyPresence,
  }
}
