'use client'
import { useTranslations } from 'next-intl'
import { FiSearch } from 'react-icons/fi'
import { Avatar } from '@/shared/components'
import { PresenceIndicator } from '@/features/chat/components/PresenceIndicator'
import { formatMessageTime } from '@/shared/utils/date'
import { ConversationWithDetails } from '../types'

interface ConversationListProps {
    conversations: ConversationWithDetails[]
    selectedId: string | null
    onSelect: (id: string) => void
    searchQuery: string
    onSearchChange: (query: string) => void
    isUserOnline: (userId: string) => boolean
}

export const ConversationList = ({
    conversations,
    selectedId,
    onSelect,
    searchQuery,
    onSearchChange,
    isUserOnline
}: ConversationListProps) => {
    const t = useTranslations('chat')
    
    return (
        <div className={`w-80 max-md:w-full border-r border-(--border-1) bg-(--bg-2) flex flex-col ${selectedId ? 'max-md:hidden' : ''}`}>
            <div className="p-4 border-b border-(--border-1)">
                <h2 className="text-xl font-bold text-(--text-1) mb-3">
                    {t('chats')}
                </h2>

                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-2)" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={t('typeMessage')}
                        className="w-full pl-10 pr-4 py-2 bg-(--bg-1) border border-(--border-1) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--button-1) text-(--text-1) placeholder:text-(--text-2) text-sm"
                    />
                </div>
            </div>

            <div className="flex border-b border-(--border-1) px-2">
                <button className="px-4 py-2 text-sm font-medium text-(--text-1) border-b-2 border-(--button-1)">
                    {t('conversations')}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-(--text-2)">
                        {searchQuery ? t('noMessages') : t('noConversations')}
                    </div>
                ) : (
                    conversations.map((conversation) => (
                        <button
                            key={conversation.id}
                            onClick={() => onSelect(conversation.id)}
                            className={`w-full p-4 flex items-start gap-3 hover:bg-(--bg-1) transition-colors border-b border-(--border-1) ${selectedId === conversation.id
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
    )
}
