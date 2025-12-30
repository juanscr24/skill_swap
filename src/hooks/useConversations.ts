'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ConversationWithDetails } from '@/types/chat'

// Hook para obtener conversaciones
export const useConversations = () => {
  return useQuery<ConversationWithDetails[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await fetch('/api/conversations')
      if (!response.ok) throw new Error('Error al obtener conversaciones')
      return response.json()
    },
    refetchInterval: 10000, // Refetch cada 10 segundos para actualizar la lista
  })
}

// Hook para crear o obtener conversación con otro usuario
export const useCreateConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (otherUserId: string) => {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherUserId }),
      })
      if (!response.ok) throw new Error('Error al crear conversación')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

// Hook para obtener una conversación específica
export const useConversation = (conversationId: string | null) => {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null
      const response = await fetch(`/api/conversations/${conversationId}`)
      if (!response.ok) throw new Error('Error al obtener conversación')
      return response.json()
    },
    enabled: !!conversationId,
  })
}

// Hook para eliminar conversación
export const useDeleteConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Error al eliminar conversación')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
