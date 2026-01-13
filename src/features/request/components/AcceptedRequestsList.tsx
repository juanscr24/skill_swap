'use client'
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card } from "@/shared/components/ui/Card"
import { Avatar } from "@/shared/components/ui/Avatar"
import { Badge } from "@/shared/components/ui/Badge"
import { Button, LoadingSpinner } from "@/shared/components"
import { FiMessageSquare } from "react-icons/fi"
import { useRequests } from "../hooks/useRequests"
import { useCreateConversation } from "@/features/chat/hooks/useConversations"
import { MatchRequest } from "../types"

export const AcceptedRequestsList = () => {
    const t = useTranslations('requests')
    const router = useRouter()
    const { requests, isLoading } = useRequests('accepted')
    const { mutateAsync: createConversation } = useCreateConversation()

    const RequestCard = ({ match }: { match: MatchRequest }) => {
        // Determinar quién es el otro usuario
        const { data: session } = useSession()
        const isCurrentUserSender = match.senderId === session?.user?.id
        const otherUser = isCurrentUserSender ? match.receiver : match.sender

        const handleSendMessage = async () => {
            if (!otherUser?.id) return

            const result = await createConversation(otherUser.id)
            if (result.success && result.data) {
                router.push(`/chats?conversation=${result.data.conversationId}`)
            } else {
                console.error('Error creating conversation:', result.error)
                router.push('/chats')
            }
        }

        const createdAt = new Date(match.createdAt)

        return (
            <Card>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-sm:gap-3">
                    <Avatar src={otherUser?.image || ''} alt={otherUser?.name || 'User'} size="md" />

                    <div className="flex-1">
                        <h3 className="font-semibold text-(--text-1) max-sm:text-sm">{otherUser?.name || 'Unknown User'}</h3>
                        <p className="text-sm max-sm:text-xs text-(--text-2)">
                            {t('skill')}: <span className="font-medium">{match.skill}</span>
                        </p>
                        <p className="text-xs max-sm:text-[10px] text-(--text-2) mt-1">
                            {createdAt.toLocaleDateString()}
                        </p>
                    </div>

                    <Badge variant="success">
                        {t('accepted')}
                    </Badge>

                    <Button
                        primary
                        onClick={handleSendMessage}
                        className="flex items-center gap-2 max-sm:gap-1 px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs max-sm:w-full"
                    >
                        <FiMessageSquare className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                        {t('sendMessage')}
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-4 max-sm:space-y-3">
            {isLoading ? (
                <LoadingSpinner />
            ) : requests.length === 0 ? (
                <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">{t('noAcceptedRequests')}</p>
            ) : (
                requests.map((match) => (
                    <RequestCard key={match.id} match={match} />
                ))
            )}
        </div>
    )
}
