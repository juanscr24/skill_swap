'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { mockConversations, mockMessages } from "@/constants/mockMessages"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { FiSend } from "react-icons/fi"
import { currentUser } from "@/constants/mockUsers"

export const ChatView = () => {
    const t = useTranslations('chat')
    const [selectedChat, setSelectedChat] = useState(mockConversations[0])
    const [message, setMessage] = useState('')

    const chatMessages = mockMessages.filter(
        msg => 
            (msg.sender.id === selectedChat.user.id && msg.receiver.id === currentUser.id) ||
            (msg.sender.id === currentUser.id && msg.receiver.id === selectedChat.user.id)
    )

    return (
        <div className="h-[calc(100vh-4rem)] flex max-md:flex-col">
            {/* Chat List */}
            <div className="w-80 max-md:w-full max-md:h-auto border-r max-md:border-r-0 max-md:border-b border-(--border-1) bg-(--bg-2) overflow-y-auto max-md:max-h-64">
                <div className="p-4 max-sm:p-3 border-b border-(--border-1)">
                    <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-(--text-1)">{t('chats')}</h2>
                </div>
                
                <div className="p-2">
                    {mockConversations.map((conversation) => (
                        <button
                            key={conversation.id}
                            onClick={() => setSelectedChat(conversation)}
                            className={`w-full p-4 max-sm:p-3 rounded-lg mb-2 text-left transition-colors
                                ${selectedChat.id === conversation.id 
                                    ? 'bg-(--button-1) text-(--button-1-text)' 
                                    : 'hover:bg-(--bg-1)'
                                }`}
                        >
                            <div className="flex items-center gap-3 max-sm:gap-2">
                                <Avatar 
                                    src={conversation.user.image} 
                                    alt={conversation.user.name}
                                    size="md"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold truncate max-sm:text-sm">
                                            {conversation.user.name}
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
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-(--bg-1) max-md:h-[calc(100vh-20rem)]">
                {/* Chat Header */}
                <div className="p-4 max-sm:p-3 bg-(--bg-2) border-b border-(--border-1) flex items-center gap-3 max-sm:gap-2">
                    <Avatar 
                        src={selectedChat.user.image} 
                        alt={selectedChat.user.name}
                        size="md"
                    />
                    <div>
                        <h3 className="font-semibold text-(--text-1) max-sm:text-sm">{selectedChat.user.name}</h3>
                        <p className="text-xs max-sm:text-[10px] text-(--text-2)">{t('online')}</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 max-sm:p-3 overflow-y-auto space-y-4 max-sm:space-y-3">
                    {chatMessages.map((msg) => {
                        const isSent = msg.sender.id === currentUser.id
                        
                        return (
                            <div 
                                key={msg.id}
                                className={`flex gap-3 max-sm:gap-2 ${isSent ? 'flex-row-reverse' : ''}`}
                            >
                                <Avatar 
                                    src={msg.sender.image} 
                                    alt={msg.sender.name}
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
                                        {msg.created_at.toLocaleTimeString('es-ES', { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Input */}
                <div className="p-4 max-sm:p-3 bg-(--bg-2) border-t border-(--border-1)">
                    <div className="flex gap-3 max-sm:gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t('typeMessage')}
                            className="flex-1 px-4 max-sm:px-3 py-3 max-sm:py-2 max-sm:text-sm bg-(--bg-1) border border-(--border-1) rounded-lg text-(--text-1) placeholder:text-(--text-2) outline-none focus:border-(--button-1)"
                        />
                        <button className="px-6 max-sm:px-4 py-3 max-sm:py-2 bg-(--button-1) text-(--button-1-text) rounded-lg hover:scale-105 transition-transform">
                            <FiSend className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
