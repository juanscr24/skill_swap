'use client'

import { useApiQuery, useApiMutation } from '@/shared/hooks'
import { Conversation, Message, SendMessageData } from '../types'

export function useMessages(otherUserId?: string) {
  // Query para conversaciones (cuando no hay otherUserId)
  const conversationsQuery = useApiQuery<Conversation[]>(
    'conversations',
    !otherUserId ? '/api/messages/conversations' : null,
    {
      requireAuth: true,
      staleTime: 1000 * 60, // 1 minuto
      enabled: !otherUserId,
    }
  )

  // Query para mensajes específicos (cuando hay otherUserId)
  const messagesQuery = useApiQuery<Message[]>(
    ['messages', otherUserId],
    otherUserId ? `/api/messages/${otherUserId}` : null,
    {
      requireAuth: true,
      staleTime: 1000 * 30, // 30 segundos
      refetchInterval: 1000 * 10, // Refetch cada 10 segundos
      enabled: !!otherUserId,
    }
  )

  // Mutation para enviar mensaje
  const sendMutation = useApiMutation<Message, SendMessageData>({
    mutationFn: async (data) => {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Error al enviar mensaje')
      return response.json()
    },
    invalidateKeys: [['messages', otherUserId], 'conversations'],
    optimistic: otherUserId
      ? {
        queryKey: ['messages', otherUserId],
        updateFn: (old: Message[] = [], newMsg: SendMessageData) => {
          const tempMessage: Message = {
            id: 'temp-' + Date.now(),
            senderId: '',
            receiverId: newMsg.receiverId,
            content: newMsg.content,
            read: false,
            createdAt: new Date(),
            sender: { id: '', name: null, image: null },
          }
          return [...old, tempMessage]
        },
      }
      : undefined,
  })

  return {
    conversations: conversationsQuery.data ?? [],
    messages: messagesQuery.data ?? [],
    isLoading: otherUserId ? messagesQuery.isLoading : conversationsQuery.isLoading,
    error: otherUserId ? messagesQuery.error : conversationsQuery.error,
    sendMessage: sendMutation.mutateAsync,
    refetch: otherUserId ? messagesQuery.refetch : conversationsQuery.refetch,
  }
}
