'use client'
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useRequests } from "@/hooks"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Tabs } from "@/components/ui/Tabs"
import { Button } from "@/components"
import { FiCheck, FiX, FiMessageSquare } from "react-icons/fi"

interface MatchRequest {
  id: string
  senderId: string
  receiverId: string
  skill: string
  status: string | null
  createdAt: Date
  sender: {
    id: string
    name: string | null
    image: string | null
  } | null
  receiver: {
    id: string
    name: string | null
    image: string | null
  } | null
}

const ReceivedRequestsList = () => {
    const t = useTranslations('requests')
    const router = useRouter()
    const { requests, isLoading, acceptRequest, rejectRequest } = useRequests('received')

    const RequestCard = ({ match }: { match: MatchRequest }) => {
        const otherUser = match.sender
        
        const statusVariant = {
            pending: 'warning',
            accepted: 'success',
            rejected: 'error'
        } as const

        const handleAccept = async () => {
            const result = await acceptRequest(match.id)
            if (!result.success) {
                alert(t('errorAccepting'))
            }
        }

        const handleReject = async () => {
            const result = await rejectRequest(match.id)
            if (!result.success) {
                alert(t('errorRejecting'))
            }
        }

        const handleSendMessage = () => {
            router.push(`/chats`)
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

                    <Badge variant={statusVariant[match.status as keyof typeof statusVariant] || 'warning'}>
                        {t(match.status || 'pending')}
                    </Badge>

                    {match.status === 'accepted' && (
                        <Button 
                            primary 
                            onClick={handleSendMessage}
                            className="flex items-center gap-2 max-sm:gap-1 px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs"
                        >
                            <FiMessageSquare className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                            {t('sendMessage')}
                        </Button>
                    )}

                    {match.status === 'pending' && (
                        <div className="flex gap-2 max-sm:gap-1 flex-wrap max-sm:w-full">
                            <Button 
                                primary 
                                onClick={handleAccept}
                                className="flex items-center gap-2 max-sm:gap-1 px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs max-sm:flex-1"
                            >
                                <FiCheck className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                                {t('accept')}
                            </Button>
                            <Button 
                                secondary 
                                onClick={handleReject}
                                className="flex items-center gap-2 max-sm:gap-1 px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs max-sm:flex-1"
                            >
                                <FiX className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                                {t('reject')}
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-4 max-sm:space-y-3">
            {isLoading ? (
                <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">{t('loading')}</p>
            ) : requests.length === 0 ? (
                <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">{t('noRequests')}</p>
            ) : (
                requests.map((match) => (
                    <RequestCard key={match.id} match={match} />
                ))
            )}
        </div>
    )
}

const SentRequestsList = () => {
    const t = useTranslations('requests')
    const { requests, isLoading, cancelRequest } = useRequests('sent')

    const RequestCard = ({ match }: { match: MatchRequest }) => {
        const otherUser = match.receiver
        
        const statusVariant = {
            pending: 'warning',
            accepted: 'success',
            rejected: 'error'
        } as const

        const handleCancel = async () => {
            const result = await cancelRequest(match.id)
            if (!result.success) {
                alert(t('errorCancelling'))
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

                    <Badge variant={statusVariant[match.status as keyof typeof statusVariant] || 'warning'}>
                        {t(match.status || 'pending')}
                    </Badge>

                    {match.status === 'pending' && (
                        <Button 
                            secondary 
                            onClick={handleCancel}
                            className="px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs max-sm:w-full"
                        >
                            {t('cancel')}
                        </Button>
                    )}
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-4 max-sm:space-y-3">
            {isLoading ? (
                <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">{t('loading')}</p>
            ) : requests.length === 0 ? (
                <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">{t('noRequests')}</p>
            ) : (
                requests.map((match) => (
                    <RequestCard key={match.id} match={match} />
                ))
            )}
        </div>
    )
}

export const RequestsView = () => {
    const t = useTranslations('requests')

    const tabs = [
        {
            id: 'received',
            label: t('received'),
            content: <ReceivedRequestsList />
        },
        {
            id: 'sent',
            label: t('sent'),
            content: <SentRequestsList />
        }
    ]

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4">
            <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-8 max-md:mb-6 max-sm:mb-4">{t('requests')}</h1>
            <Tabs tabs={tabs} defaultTab="received" />
        </div>
    )
}
