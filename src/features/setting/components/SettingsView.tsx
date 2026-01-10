'use client'

import { useTranslations } from "next-intl"
import { PreferencesSection } from "./PreferencesSection"
import { NotificationsSection } from "./NotificationsSection"
import { SecuritySection } from "./SecuritySection"
import { PrivacySection } from "./PrivacySection"
import { DeleteAccountSection } from "./DeleteAccountSection"

export const SettingsView = () => {
    const t = useTranslations('settings')

    return (
        <div className="max-w-4xl mx-auto p-6 max-sm:p-4 pb-20 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-(--text-1) mb-2">{t('title')}</h1>
            </div>

            <PreferencesSection />
            <NotificationsSection />
            <SecuritySection />
            <PrivacySection />
            <DeleteAccountSection />
        </div>
    )
}
