'use client'
import { useEffect, useCallback, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChatMessage, MessageStatus } from '../types'
import { useApiQuery, useApiMutation } from '@/shared/hooks'
import { useQueryClient } from '@tanstack/react-query'

interface UseRealtimeMessagesOptions {
  conversationId: string | null
  currentUserId?: string
  onMessage?: (message: ChatMessage) => void
  enabled?: boolean
}

export const useRealtimeMessages = ({
  conversationId,
  currentUserId,
  onMessage,
  enabled = true,
}: UseRealtimeMessagesOptions) => {
  const queryClient = useQueryClient()
  const supabase = useMemo(() => createClient(), [])
  const onMessageRef = useRef(onMessage)

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  // Query para obtener mensajes iniciales
  const messagesQuery = useApiQuery<ChatMessage[]>(
    ['messages', conversationId],
    conversationId ? `/api/conversations/${conversationId}/messages` : null,
    {
      requireAuth: true,
      enabled: !!conversationId && enabled,
      staleTime: 1000 * 60, // 1 minuto
    }
  )

  const messages = messagesQuery.data || []

  // Obtener el estado de un mensaje
  const getMessageStatus = useCallback(
    (message: ChatMessage): MessageStatus => {
      if (message.sender_id !== currentUserId) {
        return 'sent'
      }
      if (message.read_at) return 'read'
      if (message.delivered_at) return 'delivered'
      return 'sent'
    },
    [currentUserId]
  )

  const markAsDelivered = useCallback(async (messageId: string) => {
    try {
      await fetch('/api/messages/delivered', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId }),
      })
    } catch (error) {
      console.error('Error marking as delivered:', error)
    }
  }, [])

  const [isSubscribed, setIsSubscribed] = useState(false)

  // Suscripción Realtime
  useEffect(() => {
    if (!enabled || !conversationId) {
      setIsSubscribed(false)
      return
    }

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage

          queryClient.setQueryData(['messages', conversationId], (prev: ChatMessage[] = []) => {
            const isDuplicate = prev.some((m) => {
              if (m.id === newMessage.id) return true
              // Lógica de detección de duplicados para mensajes optimistas
              if (m.id.startsWith('temp-') &&
                m.sender_id === newMessage.sender_id &&
                m.content === newMessage.content &&
                Math.abs(new Date(m.created_at).getTime() - new Date(newMessage.created_at).getTime()) < 5000) {
                return true
              }
              return false
            })

            if (isDuplicate) {
              // Si es un duplicado del real, reemplazamos el temporal
              return prev.map(m => {
                if (m.id.startsWith('temp-') && m.content === newMessage.content && m.sender_id === newMessage.sender_id) {
                  return newMessage
                }
                return m
              })
            }

            return [...prev, newMessage]
          })

          if (newMessage.sender_id !== currentUserId && currentUserId) {
            markAsDelivered(newMessage.id)
          }

          if (onMessageRef.current) onMessageRef.current(newMessage)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const updatedMessage = payload.new as ChatMessage
          queryClient.setQueryData(['messages', conversationId], (prev: ChatMessage[] = []) =>
            prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const deletedMessage = payload.old as ChatMessage
          queryClient.setQueryData(['messages', conversationId], (prev: ChatMessage[] = []) =>
            prev.filter((m) => m.id !== deletedMessage.id)
          )
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsSubscribed(true)
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsSubscribed(false)
        }
      })

    return () => {
      supabase.removeChannel(channel)
      setIsSubscribed(false)
    }
  }, [conversationId, enabled, currentUserId, markAsDelivered, supabase, queryClient])

  // Mutación para enviar mensaje
  const sendMessageMutation = useApiMutation<ChatMessage, { content: string }, { previousMessages?: ChatMessage[], tempId: string }>({
    mutationFn: async ({ content }) => {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          content: content.trim(),
        }),
      })
      if (!response.ok) throw new Error('Failed to send message')
      return response.json()
    },
    onMutate: async ({ content }) => {
      await queryClient.cancelQueries({ queryKey: ['messages', conversationId] })
      const previousMessages = queryClient.getQueryData<ChatMessage[]>(['messages', conversationId])

      const tempId = `temp-${Date.now()}`
      const optimisticMessage: ChatMessage = {
        id: tempId,
        conversation_id: conversationId!,
        sender_id: currentUserId!,
        content: content.trim(),
        created_at: new Date().toISOString(),
      }

      queryClient.setQueryData(['messages', conversationId], (prev: ChatMessage[] = []) => [
        ...prev,
        optimisticMessage,
      ])

      return { previousMessages, tempId }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', conversationId], context.previousMessages)
      }
    },
    onSuccess: (data, _variables, context) => {
      queryClient.setQueryData(['messages', conversationId], (prev: ChatMessage[] = []) => {
        const withoutTemp = prev.filter((m) => m.id !== context?.tempId)
        const exists = withoutTemp.some((m) => m.id === data.id)
        if (exists) return withoutTemp
        return [...withoutTemp, data]
      })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })

  // Mutación para marcar como leído
  const markReadMutation = useApiMutation<void, string[]>({
    mutationFn: async (messageIds) => {
      if (messageIds.length === 0) return
      const response = await fetch('/api/messages/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIds }),
      })
      if (!response.ok) throw new Error('Failed to mark as read')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }
  })

  return {
    messages,
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    error: messagesQuery.error,
    isSubscribed,
    sendMessage: (content: string, _senderId: string) => sendMessageMutation.mutateAsync({ content }),
    markAsRead: (messageIds: string[]) => markReadMutation.mutateAsync(messageIds),
    getMessageStatus,
    refetch: messagesQuery.refetch,
    isSending: sendMessageMutation.isPending,
  }
}
