'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useConversations } from '@/features/chat/hooks/useConversations'
import { useRealtimeMessages } from '@/features/chat/hooks/useRealtimeMessages'
import { useUserPresence } from '@/features/chat/hooks/useUserPresence'
import { Avatar } from '@/shared/components/ui/Avatar'
import { LoadingSpinner } from '@/shared/components'
import { MessageStatusIndicator } from '@/features/chat/components/MessageStatusIndicator'
import { PresenceIndicator } from '@/features/chat/components/PresenceIndicator'
import { FiSend, FiSearch, FiVideo, FiInfo } from 'react-icons/fi'

export const ChatPage = () => {
    const t = useTranslations('chat')
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [messageInput, setMessageInput] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Hook de presencia de usuarios
    const { isUserOnline, getLastSeen } = useUserPresence({ enabled: true })

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
        getMessageStatus,
    } = useRealtimeMessages({
        conversationId: selectedConversationId,
        currentUserId: session?.user?.id,
        enabled: !!selectedConversationId,
        onMessage: (newMessage) => {
            // Marcar como leído automáticamente cuando llega un mensaje del otro usuario
            if (newMessage.sender_id !== session?.user?.id && session?.user?.id) {
                // Marcar como leído solo si la conversación está activa
                const unreadMessages = messages.filter(
                    (m) => m.sender_id !== session.user.id && !m.read_at
                )
                if (unreadMessages.length > 0) {
                    markAsRead(unreadMessages.map((m) => m.id))
                }
            }
        },
    })

    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages.length])

    useEffect(() => {
        if (!selectedConversationId || !session?.user?.id) return

        const timeoutId = setTimeout(() => {
            const unreadMessages = messages.filter(
                (m) => m.sender_id !== session.user.id && !m.read_at
            )
            if (unreadMessages.length > 0) {
                markAsRead(unreadMessages.map((m) => m.id))
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [selectedConversationId, messages, session?.user?.id, markAsRead])

    // Obtener la conversación seleccionada
    const selectedConversation = conversations?.find(
        (c) => c.id === selectedConversationId
    )

    // Filtrar conversaciones por búsqueda
    const filteredConversations = useMemo(() => {
        if (!conversations) return []
        if (!searchQuery.trim()) return conversations

        const query = searchQuery.toLowerCase()
        return conversations.filter((conv) => {
            const userName = conv.otherUser?.name?.toLowerCase() || ''
            const userEmail = conv.otherUser?.email?.toLowerCase() || ''
            const lastMessage = conv.lastMessage?.content?.toLowerCase() || ''

            return userName.includes(query) || userEmail.includes(query) || lastMessage.includes(query)
        })
    }, [conversations, searchQuery])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!messageInput.trim() || !session?.user?.id || !selectedConversationId) return

        const content = messageInput
        setMessageInput('')
        inputRef.current?.focus()

        try {
            await sendMessage(content, session.user.id)
        } catch (error) {
            console.error('Error sending message:', error)
            setMessageInput(content)
        }
    }

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

    const formatLastSeen = (date: Date | null) => {
        if (!date) return 'recently'

        const now = Date.now()
        const lastSeen = date.getTime()
        const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60))

        if (diffInMinutes < 1) return 'just now'
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`

        const diffInHours = Math.floor(diffInMinutes / 60)
        if (diffInHours < 24) return `${diffInHours}h ago`

        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays === 1) return 'yesterday'
        if (diffInDays < 7) return `${diffInDays}d ago`

        return date.toLocaleDateString('es', { day: '2-digit', month: 'short' })
    }

    if (conversationsLoading) {
        return <LoadingSpinner fullScreen />
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-(--bg-1) max-md:flex-col">
            <div className={`w-80 max-md:w-full border-r border-(--border-1) bg-(--bg-2) flex flex-col ${selectedConversationId ? 'max-md:hidden' : ''}`}>
                <div className="p-4 border-b border-(--border-1)">
                    <h2 className="text-xl font-bold text-(--text-1) mb-3">
                        Messages
                    </h2>

                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-2)" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 bg-(--bg-1) border border-(--border-1) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--button-1) text-(--text-1) placeholder:text-(--text-2) text-sm"
                        />
                    </div>
                </div>

                <div className="flex border-b border-(--border-1) px-2">
                    <button className="px-4 py-2 text-sm font-medium text-(--text-1) border-b-2 border-(--button-1)">
                        All Chats
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-(--text-2) hover:text-(--text-1)">
                        No leidos
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {!filteredConversations || filteredConversations.length === 0 ? (
                        <div className="p-4 text-center text-(--text-2)">
                            {searchQuery ? 'No conversations found' : t('noConversations')}
                        </div>
                    ) : (
                        filteredConversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                onClick={() => setSelectedConversationId(conversation.id)}
                                className={`w-full p-4 flex items-start gap-3 hover:bg-(--bg-1) transition-colors border-b border-(--border-1) ${selectedConversationId === conversation.id
                                    ? 'bg-(--bg-1)'
                                    : ''
                                    }`}
                            >
                                <div className="relative">
                                    <Avatar
                                        src={conversation.otherUser?.image || undefined}
                                        alt={conversation.otherUser?.name || 'User'}
                                        size="md"
                                    />
                                    {conversation.otherUser?.id && (
                                        <div className="absolute bottom-0 right-0">
                                            <PresenceIndicator
                                                isOnline={isUserOnline(conversation.otherUser.id)}
                                                size="md"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="relative flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-(--text-1) truncate">
                                            {conversation.otherUser?.name || conversation.otherUser?.email}
                                        </h3>
                                        {conversation.lastMessage && (
                                            <span className="text-xs text-(--text-2)">
                                                {formatMessageTime(conversation.lastMessage.created_at)}
                                            </span>
                                        )}
                                    </div>

                                    {conversation.lastMessage && (
                                        <p className="text-sm text-(--text-2) truncate">
                                            {conversation.lastMessage.content}
                                        </p>
                                    )}
                                    {conversation.unreadCount && conversation.unreadCount > 0 ? (
                                        <span
                                            className="absolute right-0 top-6 text-xs font-semibold rounded-full bg-(--button-1) text-(--button-text-1) w-5 h-5 flex items-center justify-center">
                                            {conversation.unreadCount}
                                        </span>

                                    ) : null}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            <div className={`flex-1 flex flex-col bg-(--bg-1) ${!selectedConversationId ? 'max-md:hidden' : ''}`}>
                {!selectedConversationId ? (
                    <div className="flex items-center justify-center h-full text-(--text-2)">
                        {t('selectConversation')}
                    </div>
                ) : (
                    <>
                        <div className="px-6 py-4 border-b border-(--border-1) bg-(--bg-2) flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedConversationId(null)}
                                    className="md:hidden p-2 hover:bg-(--bg-1) rounded-lg"
                                >
                                    ←
                                </button>

                                <div className="relative">
                                    <Avatar
                                        src={selectedConversation?.otherUser?.image || undefined}
                                        alt={selectedConversation?.otherUser?.name || 'User'}
                                        size="md"
                                    />
                                    {selectedConversation?.otherUser?.id && (
                                        <div className="absolute bottom-0 right-0">
                                            <PresenceIndicator
                                                isOnline={isUserOnline(selectedConversation.otherUser.id)}
                                                size="md"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-(--text-1)">
                                        {selectedConversation?.otherUser?.name || selectedConversation?.otherUser?.email}
                                    </h3>
                                    {selectedConversation?.otherUser?.id && (
                                        <p className="text-xs text-(--text-2)">
                                            {isUserOnline(selectedConversation.otherUser.id)
                                                ? 'Online'
                                                : `Last seen ${formatLastSeen(getLastSeen(selectedConversation.otherUser.id))}`}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-(--bg-1) rounded-lg text-(--text-2) hover:text-(--text-1)">
                                    <FiVideo className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-(--bg-1) rounded-lg text-(--text-2) hover:text-(--text-1)">
                                    <FiInfo className="w-5 h-5" />
                                </button>
                                <button className="px-4 py-2 bg-(--button-1) text-(--button-1-text) rounded-lg font-medium hover:opacity-90 max-sm:hidden">
                                    Schedule Session
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-(--bg-1)">
                            {messages.length > 0 && (
                                <div className="flex items-center justify-center my-4">
                                    <span className="px-3 py-1 bg-(--bg-2) text-(--text-2) text-xs rounded-full">
                                        Today, Oct 24
                                    </span>
                                </div>
                            )}

                            {messages.length === 0 ? (
                                <div className="text-center text-(--text-2) mt-8">
                                    {t('noMessages')}
                                </div>
                            ) : (
                                messages.map((message) => {
                                    const isOwn = message.sender_id === session?.user?.id

                                    return (
                                        <div
                                            key={message.id}
                                            className="flex flex-col gap-1"
                                        >
                                            {!isOwn && (
                                                <div className="flex items-start gap-2">
                                                    <Avatar
                                                        src={selectedConversation?.otherUser?.image || undefined}
                                                        alt={selectedConversation?.otherUser?.name || 'User'}
                                                        size="sm"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="bg-(--bg-2) text-(--text-1) rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] inline-block">
                                                            <p className="wrap-break-word">{message.content}</p>
                                                        </div>
                                                        <span className="text-xs text-(--text-2) ml-2 mt-1 inline-block">
                                                            {formatMessageTime(message.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {isOwn && (
                                                <div className="flex justify-end">
                                                    <div className="flex flex-col items-end max-w-[80%]">
                                                        <div className="bg-(--button-1) text-(--button-1-text) rounded-2xl rounded-br-sm px-4 py-3">
                                                            <p className="wrap-break-word">{message.content}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 mr-2 mt-1">
                                                            <span className="text-xs text-(--text-2)">
                                                                {formatMessageTime(message.created_at)}
                                                            </span>
                                                            <MessageStatusIndicator
                                                                status={getMessageStatus(message)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form
                            onSubmit={handleSendMessage}
                            className="p-4 border-t border-(--border-1) bg-(--bg-2)"
                        >
                            <div className="flex gap-3 items-center">
                                <button
                                    type="button"
                                    className="p-2 hover:bg-(--bg-1) rounded-lg text-(--text-2)"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-3 bg-(--bg-1) border border-(--border-1) rounded-xl focus:outline-none focus:ring-2 focus:ring-(--button-1) text-(--text-1) placeholder:text-(--text-2)"
                                    disabled={!isSubscribed}
                                />

                                <button
                                    type="button"
                                    className="p-2 hover:bg-(--bg-1) rounded-lg text-(--text-2)"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </button>

                                <button
                                    type="submit"
                                    disabled={!messageInput.trim() || !isSubscribed}
                                    className="p-3 bg-(--button-1) text-(--button-1-text) rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
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
