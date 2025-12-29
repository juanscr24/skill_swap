'use client'

import { useTranslations } from "next-intl"
import { FiBell } from "react-icons/fi"
import { SettingsSection } from "./SettingsSection"
import { Switch } from "../../ui/Switch"
import { useSettingsStore } from "@/stores/settingsStore"

export const NotificationsSection = () => {
    const t = useTranslations('settings.notifications')
    const { notifications, setNotification } = useSettingsStore()

    const handleToggle = (key: keyof typeof notifications) => {
        setNotification(key, !notifications[key])
    }

    return (
        <SettingsSection
            title={t('title')}
            icon={FiBell}
        >
            <div className="space-y-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-(--text-1)">{t('email')}</h3>
                        <p className="text-xs text-(--text-2)">{t('emailDescription')}</p>
                    </div>
                    <Switch
                        checked={notifications.email}
                        onChange={() => handleToggle('email')}
                    />
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-(--text-1)">{t('push')}</h3>
                        <p className="text-xs text-(--text-2)">{t('pushDescription')}</p>
                    </div>
                    <Switch
                        checked={notifications.push}
                        onChange={() => handleToggle('push')}
                    />
                </div>

                <div className="h-px bg-(--border-1)" />

                {/* Sub-categories */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-(--text-1)">{t('messages')}</span>
                        <Switch
                            checked={notifications.messages}
                            onChange={() => handleToggle('messages')}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-(--text-1)">{t('mentors')}</span>
                        <Switch
                            checked={notifications.mentors}
                            onChange={() => handleToggle('mentors')}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-(--text-1)">{t('security')}</span>
                        <Switch
                            checked={notifications.security}
                            onChange={() => handleToggle('security')}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-(--text-1)">{t('news')}</span>
                        <Switch
                            checked={notifications.news}
                            onChange={() => handleToggle('news')}
                        />
                    </div>
                </div>
            </div>
        </SettingsSection>
    )
}
