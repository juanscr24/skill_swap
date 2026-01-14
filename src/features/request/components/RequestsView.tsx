'use client'
import { useTranslations } from "next-intl"
import { Tabs } from "@/shared/components/ui/Tabs"
import { ReceivedRequestsList } from "./ReceivedRequestsList"
import { AcceptedRequestsList } from "./AcceptedRequestsList"

export const RequestsView = () => {
    const t = useTranslations('requests')

    const tabs = [
        {
            id: 'received',
            label: t('received'),
            content: <ReceivedRequestsList />
        },
        {
            id: 'accepted',
            label: t('accepted'),
            content: <AcceptedRequestsList />
        }
    ]

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4">
            <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-8 max-md:mb-6 max-sm:mb-4">{t('requests')}</h1>
            <Tabs tabs={tabs} defaultTab="received" />
        </div>
    )
}
