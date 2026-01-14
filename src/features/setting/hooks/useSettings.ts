'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Settings {
  notifications: {
    email: boolean
    push: boolean
    news: boolean
    security: boolean
    mentors: boolean
    messages: boolean
  }
  privacy: {
    visibility: string
    messagesPrivacy: string
  }
}

export function useSettings() {
  const { data: session, status } = useSession()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/settings')

      if (!response.ok) {
        throw new Error('Error al cargar la configuración')
      }

      const data = await response.json()
      setSettings(data)
    } catch (err: any) {
      console.error('Error fetching settings:', err)
      setError(err.message || 'Error al cargar la configuración')
    } finally {
      setIsLoading(false)
    }
  }

  const updateSettings = async (updatedSettings: Partial<Settings>) => {
    try {
      setError(null)

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSettings)
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la configuración')
      }

      // Refrescar configuración
      await fetchSettings()
      return { success: true }
    } catch (err: any) {
      console.error('Error updating settings:', err)
      setError(err.message || 'Error al actualizar la configuración')
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [status])

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    refetch: fetchSettings
  }
}
