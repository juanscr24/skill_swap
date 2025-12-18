'use client'
import { useTranslations } from "next-intl"
import { mockMatches } from "@/constants/mockMatches"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Tabs } from "@/components/ui/Tabs"
import { Button } from "@/components"
import { FiCheck, FiX } from "react-icons/fi"
import { currentUser } from "@/constants/mockUsers"

export const RequestsView = () => {
    const t = useTranslations('requests')

    const receivedRequests = mockMatches.filter(match => match.receiver.id === currentUser.id)
    const sentRequests = mockMatches.filter(match => match.sender.id === currentUser.id)

    const RequestCard = ({ match, type }: { match: typeof mockMatches[0], type: 'received' | 'sent' }) => {
        const otherUser = type === 'received' ? match.sender : match.receiver
        
        const statusVariant = {
            pending: 'warning',
            accepted: 'success',
            rejected: 'error'
        } as const

        return (
            <Card>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-sm:gap-3">
                    <Avatar src={otherUser.image} alt={otherUser.name} size="md" />
                    
                    <div className="flex-1">
                        <h3 className="font-semibold text-(--text-1) max-sm:text-sm">{otherUser.name}</h3>
                        <p className="text-sm max-sm:text-xs text-(--text-2)">
                            {t('skill')}: <span className="font-medium">{match.skill}</span>
                        </p>
                        <p className="text-xs max-sm:text-[10px] text-(--text-2) mt-1">
                            {match.created_at.toLocaleDateString()}
                        </p>
                    </div>

                    <Badge variant={statusVariant[match.status]}>
                        {t(match.status)}
                    </Badge>

                    {type === 'received' && match.status === 'pending' && (
                        <div className="flex gap-2 max-sm:gap-1 flex-wrap max-sm:w-full">
                            <Button 
                                primary 
                                className="flex items-center gap-2 max-sm:gap-1 px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs max-sm:flex-1"
                            >
                                <FiCheck className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                                {t('accept')}
                            </Button>
                            <Button 
                                secondary 
                                className="flex items-center gap-2 max-sm:gap-1 px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs max-sm:flex-1"
                            >
                                <FiX className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                                {t('reject')}
                            </Button>
                        </div>
                    )}

                    {type === 'sent' && match.status === 'pending' && (
                        <Button secondary className="px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs max-sm:w-full">
                            {t('cancel')}
                        </Button>
                    )}
                </div>
            </Card>
        )
    }

    const tabs = [
        {
            id: 'received',
            label: t('received'),
            content: (
                <div className="space-y-4 max-sm:space-y-3">
                    {receivedRequests.length === 0 ? (
                        <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">{t('noRequests')}</p>
                    ) : (
                        receivedRequests.map((match) => (
                            <RequestCard key={match.id} match={match} type="received" />
                        ))
                    )}
                </div>
            )
        },
        {
            id: 'sent',
            label: t('sent'),
            content: (
                <div className="space-y-4 max-sm:space-y-3">
                    {sentRequests.length === 0 ? (
                        <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">{t('noRequests')}</p>
                    ) : (
                        sentRequests.map((match) => (
                            <RequestCard key={match.id} match={match} type="sent" />
                        ))
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4">
            <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-8 max-md:mb-6 max-sm:mb-4">{t('requests')}</h1>
            <Tabs tabs={tabs} defaultTab="received" />
        </div>
    )
}
