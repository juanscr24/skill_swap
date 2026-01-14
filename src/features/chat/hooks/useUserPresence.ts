'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { UserPresence } from '../types'

interface UseUserPresenceOptions {
  userId?: string
  enabled?: boolean
}

export const useUserPresence = ({ userId, enabled = true }: UseUserPresenceOptions = {}) => {
  const { data: session } = useSession()
  const [presenceMap, setPresenceMap] = useState<Record<string, UserPresence>>({})
  const [isOnline, setIsOnline] = useState(true)
  const supabase = createClient()

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

  const getUserPresence = useCallback(
    (targetUserId: string): UserPresence | undefined => {
      return presenceMap[targetUserId]
    },
    [presenceMap]
  )

  const isUserOnline = useCallback(
    (targetUserId: string): boolean => {
      const presence = presenceMap[targetUserId]
      if (!presence) return false

      const lastUpdate = new Date(presence.updated_at).getTime()
      const now = Date.now()
      const twoMinutes = 2 * 60 * 1000

      return presence.is_online && now - lastUpdate < twoMinutes
    },
    [presenceMap]
  )

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
      if (session?.user?.id) {
        await updateMyPresence(true)

        heartbeatInterval = setInterval(() => {
          updateMyPresence(true)
        }, 30000)
      }

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

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(heartbeatInterval)
      } else {
        updateMyPresence(true)
        heartbeatInterval = setInterval(() => {
          updateMyPresence(true)
        }, 30000)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(heartbeatInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      if (session?.user?.id) {
        updateMyPresence(false)
      }

      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [enabled, userId, session?.user?.id, updateMyPresence, supabase])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session?.user?.id) {
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
