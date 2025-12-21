'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useMessages } from "@/hooks"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { FiSend } from "react-icons/fi"
import { useSession } from "next-auth/react"

export const ChatView = () => {
    const t = useTranslations('chat')
    const { data: session } = useSession()
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>()
    const [message, setMessage] = useState('')

    // Obtener conversaciones
    const { conversations, isLoading: conversationsLoading } = useMessages()
    
    // Obtener mensajes del chat seleccionado
    const { messages, sendMessage: sendMessageApi, isLoading: messagesLoading } = useMessages(selectedUserId)

    const selectedConversation = conversations.find(c => c.userId === selectedUserId)

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedUserId) return

        const result = await sendMessageApi(selectedUserId, message)
        if (result.success) {
            setMessage('')
        }
    }

    const currentUserId = session?.user?.id

    return (
        <div className="h-[calc(100vh-4rem)] flex max-md:flex-col">
            {/* Chat List */}
            <div className="w-80 max-md:w-full max-md:h-auto border-r max-md:border-r-0 max-md:border-b border-(--border-1) bg-(--bg-2) overflow-y-auto max-md:max-h-64">
                <div className="p-4 max-sm:p-3 border-b border-(--border-1)">
                    <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-(--text-1)">{t('chats')}</h2>
                </div>
                
                <div className="p-2">
                    {conversationsLoading ? (
                        <p className="text-(--text-2) text-center py-4 max-sm:text-sm">{t('loading')}</p>
                    ) : conversations.length === 0 ? (
                        <p className="text-(--text-2) text-center py-4 max-sm:text-sm">{t('noConversations')}</p>
                    ) : (
                        conversations.map((conversation) => (
                            <button
                                key={conversation.userId}
                                onClick={() => setSelectedUserId(conversation.userId)}
                                className={`w-full p-4 max-sm:p-3 rounded-lg mb-2 text-left transition-colors
                                    ${selectedUserId === conversation.userId 
                                        ? 'bg-(--button-1) text-(--button-1-text)' 
                                        : 'hover:bg-(--bg-1)'
                                    }`}
                            >
                                <div className="flex items-center gap-3 max-sm:gap-2">
                                    <Avatar 
                                        src={conversation.userImage || ''} 
                                        alt={conversation.userName || 'User'}
                                        size="md"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold truncate max-sm:text-sm">
                                                {conversation.userName || 'Unknown User'}
                                            </h3>
                                            {conversation.unreadCount > 0 && (
                                                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 max-sm:w-4 max-sm:h-4 flex items-center justify-center">
                                                    {conversation.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm max-sm:text-xs truncate opacity-80">
                                            {conversation.lastMessage.content}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            {selectedUserId && selectedConversation ? (
                <div className="flex-1 flex flex-col bg-(--bg-1) max-md:h-[calc(100vh-20rem)]">
                    {/* Chat Header */}
                    <div className="p-4 max-sm:p-3 bg-(--bg-2) border-b border-(--border-1) flex items-center gap-3 max-sm:gap-2">
                        <Avatar 
                            src={selectedConversation.userImage || ''} 
                            alt={selectedConversation.userName || 'User'}
                            size="md"
                        />
                        <div>
                            <h3 className="font-semibold text-(--text-1) max-sm:text-sm">{selectedConversation.userName}</h3>
                            <p className="text-xs max-sm:text-[10px] text-(--text-2)">{t('online')}</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 max-sm:p-3 overflow-y-auto space-y-4 max-sm:space-y-3">
                        {messagesLoading ? (
                            <p className="text-(--text-2) text-center py-4 max-sm:text-sm">{t('loading')}</p>
                        ) : messages.length === 0 ? (
                            <p className="text-(--text-2) text-center py-4 max-sm:text-sm">{t('noMessages')}</p>
                        ) : (
                            messages.map((msg) => {
                                const isSent = msg.senderId === currentUserId
                                const messageDate = new Date(msg.createdAt)
                                
                                return (
                                    <div 
                                        key={msg.id}
                                        className={`flex gap-3 max-sm:gap-2 ${isSent ? 'flex-row-reverse' : ''}`}
                                    >
                                        <Avatar 
                                            src={msg.sender.image || ''} 
                                            alt={msg.sender.name || 'User'}
                                            size="sm"
                                        />
                                        <div className={`max-w-md max-sm:max-w-[70%] ${isSent ? 'items-end' : ''}`}>
                                            <div className={`p-3 max-sm:p-2 rounded-lg ${
                                                isSent 
                                                    ? 'bg-(--button-1) text-(--button-1-text)' 
                                                    : 'bg-(--bg-2) text-(--text-1)'
                                            }`}>
                                                <p className="max-sm:text-sm">{msg.content}</p>
                                            </div>
                                            <p className="text-xs max-sm:text-[10px] text-(--text-2) mt-1 px-1">
                                                {messageDate.toLocaleTimeString('es-ES', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 max-sm:p-3 bg-(--bg-2) border-t border-(--border-1)">
                        <div className="flex gap-3 max-sm:gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={t('typeMessage')}
                                className="flex-1 px-4 max-sm:px-3 py-3 max-sm:py-2 max-sm:text-sm bg-(--bg-1) border border-(--border-1) rounded-lg text-(--text-1) placeholder:text-(--text-2) outline-none focus:border-(--button-1)"
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="px-6 max-sm:px-4 py-3 max-sm:py-2 bg-(--button-1) text-(--button-1-text) rounded-lg hover:scale-105 transition-transform"
                            >
                                <FiSend className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-(--bg-1) max-md:h-[calc(100vh-20rem)]">
                    <p className="text-(--text-2) max-sm:text-sm">{t('selectConversation')}</p>
                </div>
            )}
        </div>
    )
}
