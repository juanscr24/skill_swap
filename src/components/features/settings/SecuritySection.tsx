'use client'

import { useTranslations } from "next-intl"
import { FiLock, FiLogOut } from "react-icons/fi"
import { SettingsSection } from "./SettingsSection"
import { Button } from "../../ui/Button"

export const SecuritySection = () => {
    const t = useTranslations('settings.security')

    const handleCloseSessions = () => {
        // Here we would implement the API call to invalidate sessions
        alert(t('sessionsClosed'))
    }

    return (
        <SettingsSection
            title={t('title')}
            icon={FiLock}
        >
            <div className="space-y-6">
                {/* Change Password */}
                <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-3">
                    <div>
                        <h3 className="text-sm font-medium text-(--text-1)">{t('password')}</h3>
                        <p className="text-xs text-(--text-2)">{t('passwordDescription')}</p>
                    </div>
                    <Button secondary className="w-auto">
                        {t('changePassword')}
                    </Button>
                </div>

                <div className="h-px bg-(--border-1)" />

                {/* Active Sessions */}
                <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-3">
                    <div>
                        <h3 className="text-sm font-medium text-(--text-1)">{t('sessions')}</h3>
                        <p className="text-xs text-(--text-2)">{t('sessionsDescription')}</p>
                    </div>
                    <Button
                        onClick={handleCloseSessions}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10 w-auto bg-transparent border-transparent"
                    >
                        <FiLogOut className="mr-2 inline-block" />
                        {t('closeSessions')}
                    </Button>
                </div>
            </div>
        </SettingsSection>
    )
}
