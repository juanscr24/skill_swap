'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useConversations } from '@/hooks/useConversations'
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { FiSend, FiCheck } from 'react-icons/fi'

export const ChatView = () => {
  const t = useTranslations('chat')
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Obtener lista de conversaciones usando Prisma (a través de API)
  const { data: conversations, isLoading: conversationsLoading } = useConversations()

  // Seleccionar conversación desde URL si existe
  useEffect(() => {
    const conversationFromUrl = searchParams.get('conversation')
    if (conversationFromUrl) {
      setSelectedConversationId(conversationFromUrl)
    }
  }, [searchParams])

  // Obtener mensajes en tiempo real usando Supabase Realtime
  const {
    messages,
    isSubscribed,
    sendMessage,
    markAsRead,
  } = useRealtimeMessages({
    conversationId: selectedConversationId,
    enabled: !!selectedConversationId,
    onMessage: (newMessage) => {
      // Marcar como leído automáticamente cuando llega un mensaje del otro usuario
      if (newMessage.sender_id !== session?.user?.id && session?.user?.id) {
        markAsRead(session.user.id)
      }
    },
  })

  // Scroll automático al final cuando cambian los mensajes
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length]) // Solo cuando cambia la cantidad, no todo el array

  // Marcar como leído cuando se selecciona una conversación (con debounce)
  useEffect(() => {
    if (!selectedConversationId || !session?.user?.id) return

    const timeoutId = setTimeout(() => {
      markAsRead(session.user.id)
    }, 500) // Esperar 500ms antes de marcar como leído

    return () => clearTimeout(timeoutId)
  }, [selectedConversationId, session?.user?.id, markAsRead])

  // Obtener la conversación seleccionada
  const selectedConversation = conversations?.find(
    (c) => c.id === selectedConversationId
  )

  // Manejar envío de mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!messageInput.trim() || !session?.user?.id || !selectedConversationId) return

    const content = messageInput
    setMessageInput('') // Limpiar input inmediatamente para mejor UX
    inputRef.current?.focus()

    try {
      await sendMessage(content, session.user.id)
    } catch (error) {
      console.error('Error sending message:', error)
      setMessageInput(content) // Restaurar mensaje si falla
      // Aquí podrías mostrar un toast de error
    }
  }

  // Formatear fecha de mensaje
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('es', { day: '2-digit', month: 'short' })
    }
  }

  if (conversationsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      {/* Lista de conversaciones */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t('conversations')}
          </h2>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-5rem)]">
          {!conversations || conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {t('noConversations')}
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversationId(conversation.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-900 ${
                  selectedConversationId === conversation.id
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : ''
                }`}
              >
                <Avatar
                  src={conversation.otherUser?.image || undefined}
                  alt={conversation.otherUser?.name || 'User'}
                  size="md"
                />
                
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {conversation.otherUser?.name || conversation.otherUser?.email}
                    </h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatMessageTime(conversation.lastMessage.created_at)}
                      </span>
                    )}
                  </div>
                  
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conversation.lastMessage.sender_id === session?.user?.id && '✓ '}
                      {conversation.lastMessage.content}
                    </p>
                  )}
                  
                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-white bg-primary-500 rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Panel de chat */}
      <div className="flex-1 flex flex-col">
        {!selectedConversationId ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            {t('selectConversation')}
          </div>
        ) : (
          <>
            {/* Header del chat */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center gap-3">
              <Avatar
                src={selectedConversation?.otherUser?.image || undefined}
                alt={selectedConversation?.otherUser?.name || 'User'}
                size="md"
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedConversation?.otherUser?.name || selectedConversation?.otherUser?.email}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isSubscribed ? (
                    <span className="text-green-500">● {t('online')}</span>
                  ) : (
                    <span className="text-gray-400">○ {t('connecting')}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                  {t('noMessages')}
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.sender_id === session?.user?.id
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isOwn
                            ? 'bg-primary-500 text-white rounded-br-sm'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        <div
                          className={`flex items-center gap-1 justify-end mt-1 text-xs ${
                            isOwn ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          <span>{formatMessageTime(message.created_at)}</span>
                          {isOwn && <FiCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={t('typeMessage')}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
                  disabled={!isSubscribed}
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || !isSubscribed}
                  className="px-6 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
