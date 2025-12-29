import { useState, useEffect } from 'react'

interface Language {
  id: string
  name: string
  level?: string | null
  created_at: string
}

export const useLanguages = () => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLanguages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/languages')
      
      if (!response.ok) {
        throw new Error('Failed to fetch languages')
      }

      const data = await response.json()
      setLanguages(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading languages')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLanguages()
  }, [])

  const addLanguage = async (data: { name: string; level: string }) => {
    try {
      const response = await fetch('/api/languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to add language')
      }

      const newLanguage = await response.json()
      setLanguages((prev) => [newLanguage, ...prev])
      
      return { success: true }
    } catch (err) {
      console.error('Error adding language:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Error adding language' }
    }
  }

  const deleteLanguage = async (languageId: string) => {
    try {
      const response = await fetch(`/api/languages?id=${languageId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete language')
      }

      setLanguages((prev) => prev.filter((lang) => lang.id !== languageId))
      
      return { success: true }
    } catch (err) {
      console.error('Error deleting language:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Error deleting language' }
    }
  }

  return {
    languages,
    isLoading,
    error,
    addLanguage,
    deleteLanguage,
    refetch: fetchLanguages
  }
}
