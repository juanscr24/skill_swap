'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { ChatMessage, RealtimeMessage } from '@/types/chat'

interface UseRealtimeMessagesOptions {
  conversationId: string | null
  onMessage?: (message: ChatMessage) => void
  enabled?: boolean
}

export const useRealtimeMessages = ({
  conversationId,
  onMessage,
  enabled = true,
}: UseRealtimeMessagesOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const supabase = createClient()

  // Fetch inicial de mensajes usando API (no Supabase directo por RLS)
  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      return
    }

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    }
  }, [conversationId])

  useEffect(() => {
    if (!enabled || !conversationId) {
      setIsSubscribed(false)
      setMessages([])
      return
    }

    // Fetch inicial
    fetchMessages()

    let channel: RealtimeChannel

    // Suscribirse a cambios en tiempo real en la tabla messages
    channel = supabase
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
          
          setMessages((prev) => {
            // Evitar duplicados
            const exists = prev.some((m) => m.id === newMessage.id)
            if (exists) return prev
            return [...prev, newMessage]
          })

          // Callback opcional
          if (onMessage) onMessage(newMessage)
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
          
          setMessages((prev) =>
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
          
          setMessages((prev) => prev.filter((m) => m.id !== deletedMessage.id))
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsSubscribed(true)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to channel')
          setIsSubscribed(false)
        }
      })

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
        setIsSubscribed(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, enabled])

  // Función para enviar mensaje usando API (no Supabase directo por RLS)
  const sendMessage = useCallback(
    async (content: string, senderId: string) => {
      if (!conversationId || !content.trim()) return null

      // Crear mensaje temporal para UI optimista
      const tempId = `temp-${Date.now()}`
      const optimisticMessage: ChatMessage = {
        id: tempId,
        conversation_id: conversationId,
        sender_id: senderId,
        content: content.trim(),
        created_at: new Date().toISOString(),
      }

      // Añadir mensaje temporalmente a la UI
      setMessages((prev) => [...prev, optimisticMessage])

      try {
        const response = await fetch('/api/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            content: content.trim(),
          }),
        })

        if (!response.ok) throw new Error('Failed to send message')

        const data = await response.json()

        // Reemplazar mensaje temporal con el real
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data : m))
        )

        return data as ChatMessage
      } catch (error) {
        console.error('Error sending message:', error)
        // Remover mensaje temporal si falla
        setMessages((prev) => prev.filter((m) => m.id !== tempId))
        throw error
      }
    },
    [conversationId]
  )

  // Función para marcar conversación como leída usando API
  const markAsRead = useCallback(
    async (userId: string) => {
      if (!conversationId) return

      try {
        const response = await fetch(`/api/conversations/${conversationId}/read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })
        if (!response.ok) throw new Error('Failed to mark as read')
      } catch (error) {
        console.error('Error marking as read:', error)
      }
    },
    [conversationId]
  )

  return {
    messages,
    isSubscribed,
    sendMessage,
    markAsRead,
    refetch: fetchMessages,
  }
}
