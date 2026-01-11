'use client'
import { useEffect, useRef } from 'react'
import { Avatar } from '@/shared/components'
import { MessageStatusIndicator } from '@/features/chat/components/MessageStatusIndicator'
import { formatMessageTime } from '@/shared/utils/date'
import { ChatMessage, ConversationWithDetails } from '@/types/chat'

interface MessageListProps {
    messages: ChatMessage[]
    currentUserId: string | undefined
    otherUser: ConversationWithDetails['otherUser'] | undefined
    getMessageStatus: (message: ChatMessage) => 'sending' | 'sent' | 'delivered' | 'read'
    emptyText: string
}

export const MessageList = ({
    messages,
    currentUserId,
    otherUser,
    getMessageStatus,
    emptyText
}: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages.length])

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-(--bg-1)">
            {messages.length === 0 ? (
                <div className="text-center text-(--text-2) mt-8">
                    {emptyText}
                </div>
            ) : (
                messages.map((message) => {
                    const isOwn = message.sender_id === currentUserId

                    return (
                        <div
                            key={message.id}
                            className="flex flex-col gap-1"
                        >
                            {!isOwn && (
                                <div className="flex items-start gap-2">
                                    <Avatar
                                        src={otherUser?.image || undefined}
                                        alt={otherUser?.name || 'User'}
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
    )
}
