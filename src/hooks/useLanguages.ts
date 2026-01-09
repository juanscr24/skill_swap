'use client'

import { useApiQuery, useApiMutation, apiMutationHelpers } from '@/shared/hooks'

interface Language {
  id: string
  name: string
  level?: string | null
  created_at: string
}

interface AddLanguageData {
  name: string
  level: string
}

/**
 * Hook refactorizado para manejar idiomas del usuario
 * Usa React Query para caching y sincronización automática
 */
export const useLanguages = () => {
  // Query para obtener idiomas
  const languagesQuery = useApiQuery<Language[]>('languages', '/api/languages', {
    requireAuth: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  // Mutation para agregar idioma
  const addLanguageMutation = useApiMutation<Language, AddLanguageData>({
    ...apiMutationHelpers.post<Language, AddLanguageData>('/api/languages'),
    invalidateKeys: ['languages', 'profile'],
    optimistic: {
      queryKey: 'languages',
      updateFn: (old: Language[] = [], newLang: AddLanguageData) => [
        { id: 'temp-' + Date.now(), ...newLang, created_at: new Date().toISOString() },
        ...old,
      ],
    },
  })

  // Mutation para eliminar idioma
  const deleteLanguageMutation = useApiMutation<void, string>({
    ...apiMutationHelpers.delete<void>((id) => `/api/languages?id=${id}`),
    invalidateKeys: ['languages', 'profile'],
    optimistic: {
      queryKey: 'languages',
      updateFn: (old: Language[] = [], langId: string) => old.filter((lang) => lang.id !== langId),
    },
  })

  return {
    languages: languagesQuery.data ?? [],
    isLoading: languagesQuery.isLoading,
    error: languagesQuery.error,
    addLanguage: addLanguageMutation.mutateAsync,
    deleteLanguage: deleteLanguageMutation.mutateAsync,
    refetch: languagesQuery.refetch,
  }
}
