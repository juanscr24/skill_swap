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

  // Fetch inicial de mensajes
  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      return
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    }
  }, [conversationId, supabase])

  useEffect(() => {
    if (!enabled || !conversationId) {
      setIsSubscribed(false)
      return
    }

    fetchMessages()

    let channel: RealtimeChannel

    const setupSubscription = async () => {
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
            onMessage?.(newMessage)
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
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
        setIsSubscribed(false)
      }
    }
  }, [conversationId, enabled, fetchMessages, onMessage, supabase])

  // Función para enviar mensaje usando Supabase directamente
  const sendMessage = useCallback(
    async (content: string, senderId: string) => {
      if (!conversationId || !content.trim()) return null

      try {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: senderId,
            content: content.trim(),
          })
          .select()
          .single()

        if (error) throw error

        return data as ChatMessage
      } catch (error) {
        console.error('Error sending message:', error)
        throw error
      }
    },
    [conversationId, supabase]
  )

  // Función para marcar conversación como leída
  const markAsRead = useCallback(
    async (userId: string) => {
      if (!conversationId) return

      try {
        const { error } = await supabase
          .from('conversation_participants')
          .update({ last_read_at: new Date().toISOString() })
          .eq('conversation_id', conversationId)
          .eq('user_id', userId)

        if (error) throw error
      } catch (error) {
        console.error('Error marking as read:', error)
      }
    },
    [conversationId, supabase]
  )

  return {
    messages,
    isSubscribed,
    sendMessage,
    markAsRead,
    refetch: fetchMessages,
  }
}
