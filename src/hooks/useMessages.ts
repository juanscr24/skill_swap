'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Conversation {
  userId: string
  userName: string | null
  userImage: string | null
  lastMessage: {
    content: string
    createdAt: Date
  }
  unreadCount: number
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: Date
  sender: {
    id: string
    name: string | null
    image: string | null
  }
}

export function useMessages(otherUserId?: string) {
  const { data: session, status } = useSession()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = async () => {
    if (status !== 'authenticated') {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/messages/conversations')

      if (!response.ok) {
        throw new Error('Error al cargar conversaciones')
      }

      const data = await response.json()
      setConversations(data)
    } catch (err: any) {
      console.error('Error fetching conversations:', err)
      setError(err.message || 'Error al cargar conversaciones')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async (userId: string) => {
    if (status !== 'authenticated') {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/messages/${userId}`)

      if (!response.ok) {
        throw new Error('Error al cargar mensajes')
      }

      const data = await response.json()
      setMessages(data)
    } catch (err: any) {
      console.error('Error fetching messages:', err)
      setError(err.message || 'Error al cargar mensajes')
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (receiverId: string, content: string) => {
    try {
      setError(null)

      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId, content }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar mensaje')
      }

      const newMessage = await response.json()
      
      // Agregar el nuevo mensaje a la lista local
      setMessages((prev) => [...prev, newMessage])

      return { success: true, message: newMessage }
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(err.message || 'Error al enviar mensaje')
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    if (otherUserId) {
      fetchMessages(otherUserId)
    } else {
      fetchConversations()
    }
  }, [status, otherUserId])

  return {
    conversations,
    messages,
    isLoading,
    error,
    sendMessage,
    refetchConversations: fetchConversations,
    refetchMessages: otherUserId ? () => fetchMessages(otherUserId) : undefined,
  }
}
