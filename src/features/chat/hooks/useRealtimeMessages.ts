'use client'

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { ChatMessage, MessageStatus } from '@/types/chat'

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
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const supabase = useMemo(() => createClient(), [])
  const onMessageRef = useRef(onMessage)
  
  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  // Obtener el estado de un mensaje
  const getMessageStatus = useCallback(
    (message: ChatMessage): MessageStatus => {
      // Si no es mi mensaje, no mostrar estado
      if (message.sender_id !== currentUserId) {
        return 'sent'
      }

      if (message.read_at) return 'read'
      if (message.delivered_at) return 'delivered'
      return 'sent'
    },
    [currentUserId]
  )

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

  useEffect(() => {
    if (!enabled || !conversationId) {
      setIsSubscribed(false)
      setMessages([])
      return
    }

    fetchMessages()

    let channel: RealtimeChannel

    channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage
          
          if (newMessage.conversation_id !== conversationId) {
            return
          }

          setMessages((prev) => {
            const isDuplicate = prev.some((m) => {
              if (m.id === newMessage.id) return true
              if (m.id.startsWith('temp-') && 
                  m.sender_id === newMessage.sender_id &&
                  m.content === newMessage.content &&
                  Math.abs(new Date(m.created_at).getTime() - new Date(newMessage.created_at).getTime()) < 5000) {
                return true
              }
              return false
            })
            
            if (isDuplicate) return prev
            
            const withoutOldTemp = prev.filter(m => 
              !m.id.startsWith('temp-') || 
              m.sender_id !== newMessage.sender_id ||
              m.content !== newMessage.content
            )
            return [...withoutOldTemp, newMessage]
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
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsSubscribed(false)
        }
      })

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
        setIsSubscribed(false)
      }
    }
  }, [conversationId, enabled, currentUserId, fetchMessages, markAsDelivered, supabase])

  const markMessagesAsRead = useCallback(
    async (messageIds: string[]) => {
      if (!conversationId || messageIds.length === 0) return

      try {
        await fetch('/api/messages/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageIds }),
        })
      } catch (error) {
        console.error('Error marking messages as read:', error)
      }
    },
    [conversationId]
  )

  const sendMessage = useCallback(
    async (content: string, senderId: string) => {
      if (!conversationId || !content.trim()) return null

      const tempId = `temp-${Date.now()}`
      const optimisticMessage: ChatMessage = {
        id: tempId,
        conversation_id: conversationId,
        sender_id: senderId,
        content: content.trim(),
        created_at: new Date().toISOString(),
      }

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

        if (!response.ok) {
          throw new Error('Failed to send message')
        }

        const data = await response.json()

        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m.id !== tempId)
          const exists = withoutTemp.some((m) => m.id === data.id)
          if (exists) return withoutTemp
          return [...withoutTemp, data]
        })

        return data as ChatMessage
      } catch (error) {
        console.error('Error sending message:', error)
        setMessages((prev) => prev.filter((m) => m.id !== tempId))
        throw error
      }
    },
    [conversationId]
  )

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
    markAsRead: markMessagesAsRead,
    getMessageStatus,
    refetch: fetchMessages,
  }
}
