'use client'
import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useConversations } from '@/features/chat/hooks/useConversations'
import { useRealtimeMessages } from '@/features/chat/hooks/useRealtimeMessages'
import { useUserPresence } from '@/features/chat/hooks/useUserPresence'
import { LoadingSpinner, ErrorBoundary } from '@/shared/components'
import { ConversationList } from './ConversationList'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { ChatSessionInfo } from './ChatSessionInfo'

export const ChatPage = () => {
    const t = useTranslations('chat')
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

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
                const unreadMessages = messages.filter(
                    (m) => m.sender_id !== session.user.id && !m.read_at
                )
                if (unreadMessages.length > 0) {
                    markAsRead(unreadMessages.map((m) => m.id))
                }
            }
        },
    })

    // Marcar como leído al cargar o cambiar de conversación
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

    const handleSendMessage = async (content: string) => {
        if (!session?.user?.id) return
        await sendMessage(content, session.user.id)
    }

    if (conversationsLoading) {
        return <LoadingSpinner fullScreen />
    }

    return (
        <ErrorBoundary>
            <div className="flex h-[calc(100vh-4rem)] bg-(--bg-1) max-md:flex-col">
                <ConversationList
                    conversations={filteredConversations}
                    selectedId={selectedConversationId}
                    onSelect={setSelectedConversationId}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    isUserOnline={isUserOnline}
                />

                <div className={`flex-1 flex flex-col bg-(--bg-1) ${!selectedConversationId ? 'max-md:hidden' : ''}`}>
                    {!selectedConversationId ? (
                        <div className="flex items-center justify-center h-full text-(--text-2)">
                            {t('selectConversation')}
                        </div>
                    ) : (
                        <>
                            <ChatHeader
                                conversation={selectedConversation}
                                isOnline={selectedConversation?.otherUser?.id ? isUserOnline(selectedConversation.otherUser.id) : false}
                                lastSeen={selectedConversation?.otherUser?.id ? getLastSeen(selectedConversation.otherUser.id) : null}
                                onBack={() => setSelectedConversationId(null)}
                            />

                            <div className="flex-1 flex overflow-hidden">
                                <div className="flex-1 flex flex-col min-w-0">
                                    <MessageList
                                        messages={messages}
                                        currentUserId={session?.user?.id}
                                        otherUser={selectedConversation?.otherUser}
                                        getMessageStatus={getMessageStatus}
                                        emptyText={t('noMessages')}
                                    />

                                    <MessageInput
                                        onSendMessage={handleSendMessage}
                                        isSubscribed={isSubscribed}
                                    />
                                </div>

                                <ChatSessionInfo
                                    otherUserId={selectedConversation?.otherUser?.id}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    )
}
