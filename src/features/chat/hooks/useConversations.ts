'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ConversationWithDetails } from '@/types/chat'

// Hook para obtener conversaciones con auto-refetch en tiempo real
export const useConversations = () => {
  const queryClient = useQueryClient()
  const supabase = createClient()

  const query = useQuery<ConversationWithDetails[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await fetch('/api/conversations')
      if (!response.ok) throw new Error('Error al obtener conversaciones')
      return response.json()
    },
    staleTime: 0, // Siempre considerar datos stale para refetch
    gcTime: 10 * 60 * 1000, // 10 minutos antes de liberar memoria
    refetchOnWindowFocus: true, // Refetch al volver a la pestaña
  })

  // Suscribirse a cambios en mensajes para actualizar conversaciones
  useEffect(() => {
    const channel = supabase
      .channel('conversations_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          // Refrescar conversaciones cuando hay nuevo mensaje
          queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
        },
        () => {
          // Refrescar conversaciones cuando cambia la presencia
          queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, queryClient])

  return query
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
