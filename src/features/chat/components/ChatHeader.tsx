'use client'
import { Avatar } from '@/shared/components'
import { PresenceIndicator } from '@/features/chat/components/PresenceIndicator'
import { formatRelativeTime } from '@/shared/utils/date'
import { ConversationWithDetails } from '../types'
import { useTranslations } from 'next-intl'

interface ChatHeaderProps {
    conversation: ConversationWithDetails | undefined
    isOnline: boolean
    lastSeen: string | Date | null
    onBack: () => void
}

export const ChatHeader = ({
    conversation,
    isOnline,
    lastSeen,
    onBack
}: ChatHeaderProps) => {
    const t = useTranslations('sessions')
    return (
        <div className="px-6 py-4 border-b border-(--border-1) bg-(--bg-2) flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="md:hidden p-2 hover:bg-(--bg-1) rounded-lg"
                >
                    ←
                </button>

                <div className="relative">
                    <Avatar
                        src={conversation?.otherUser?.image || undefined}
                        alt={conversation?.otherUser?.name || 'User'}
                        size="md"
                    />
                    {conversation?.otherUser?.id && (
                        <div className="absolute bottom-0 right-0">
                            <PresenceIndicator
                                isOnline={isOnline}
                                size="md"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="font-semibold text-(--text-1)">
                        {conversation?.otherUser?.name || conversation?.otherUser?.email}
                    </h3>
                    {conversation?.otherUser?.id && (
                        <p className="text-xs text-(--text-2)">
                            {isOnline
                                ? 'Online'
                                : lastSeen ? `Last seen ${formatRelativeTime(lastSeen)}` : 'Offline'}
                        </p>
                    )}
                </div>
            </div>
            <button className="px-4 py-2 bg-(--button-1) text-(--button-1-text) rounded-lg font-medium hover:opacity-90">
                {t('scheduleSessions')}
            </button>
        </div>
    )
}
