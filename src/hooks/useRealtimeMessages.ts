'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { ChatMessage, RealtimeMessage, MessageStatus } from '@/types/chat'

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
  const supabase = createClient()

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

    console.log('🔍 [Realtime] Inicializando para conversación:', conversationId)

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
          // SIN FILTRO para testing - recibirá TODOS los mensajes
        },
        (payload) => {
          console.log('🎉 [Realtime] Nuevo mensaje recibido (SIN FILTRO):', payload)
          const newMessage = payload.new as ChatMessage
          
          // Filtrar manualmente en el cliente
          if (newMessage.conversation_id !== conversationId) {
            console.log('⚠️ [Realtime] Mensaje de otra conversación, ignorado')
            return
          }

          setMessages((prev) => {
            // Evitar duplicados - verificar por ID real o temporal
            const isDuplicate = prev.some((m) => {
              // Mismo ID real
              if (m.id === newMessage.id) return true
              // Si es un mensaje temporal con el mismo contenido y sender (race condition)
              if (m.id.startsWith('temp-') && 
                  m.sender_id === newMessage.sender_id &&
                  m.content === newMessage.content &&
                  Math.abs(new Date(m.created_at).getTime() - new Date(newMessage.created_at).getTime()) < 5000) {
                return true
              }
              return false
            })
            
            if (isDuplicate) {
              console.log('⚠️ [Realtime] Mensaje duplicado ignorado:', newMessage.id)
              return prev
            }
            
            console.log('✅ [Realtime] Mensaje agregado a la UI')
            // Filtrar cualquier temporal antiguo antes de agregar el nuevo
            const withoutOldTemp = prev.filter(m => 
              !m.id.startsWith('temp-') || 
              m.sender_id !== newMessage.sender_id ||
              m.content !== newMessage.content
            )
            return [...withoutOldTemp, newMessage]
          })

          // Marcar como entregado automáticamente si no soy el remitente
          if (newMessage.sender_id !== currentUserId && currentUserId) {
            markAsDelivered(newMessage.id)
          }

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
        console.log('📡 [Realtime] Estado de suscripción:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ [Realtime] Suscripción exitosa')
          setIsSubscribed(true)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ [Realtime] Error en canal - verifica políticas RLS')
          setIsSubscribed(false)
        } else if (status === 'TIMED_OUT') {
          console.error('❌ [Realtime] Timeout - verifica conexión')
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
  }, [conversationId, enabled, currentUserId])

  // Marcar mensaje como entregado
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

  // Marcar mensajes como leídos
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

  // Función para enviar mensaje usando API (no Supabase directo por RLS)
  const sendMessage = useCallback(
    async (content: string, senderId: string) => {
      if (!conversationId || !content.trim()) return null

      console.log('📤 [Send] Enviando mensaje...', { conversationId, senderId })

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
      console.log('⏳ [Send] Mensaje temporal agregado a UI')

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
          const errorData = await response.json()
          console.error('❌ [Send] Error en API:', errorData)
          throw new Error('Failed to send message')
        }

        const data = await response.json()
        console.log('✅ [Send] Mensaje guardado en BD:', data.id)

        // Reemplazar mensaje temporal con el real y evitar duplicados
        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m.id !== tempId)
          const exists = withoutTemp.some((m) => m.id === data.id)
          if (exists) {
            console.log('⚠️ [Send] Mensaje real ya existe, no duplicar')
            return withoutTemp
          }
          return [...withoutTemp, data]
        })

        console.log('🔔 [Send] Esperando evento Realtime...')

        return data as ChatMessage
      } catch (error) {
        console.error('❌ [Send] Error enviando mensaje:', error)
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
    markAsRead: markMessagesAsRead,
    getMessageStatus,
    refetch: fetchMessages,
  }
}
