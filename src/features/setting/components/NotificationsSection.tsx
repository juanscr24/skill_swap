'use client'

import { useTranslations } from "next-intl"
import { FiBell } from "react-icons/fi"
import { Switch } from "../../../shared/components/ui/Switch"
import { useSettings } from "../hooks/useSettings"
import { SettingsSection } from "."
import { useState } from "react"

export const NotificationsSection = () => {
    const t = useTranslations('settings.notifications')
    const { settings, updateSettings, isLoading } = useSettings()
    const [saving, setSaving] = useState(false)

    const handleToggle = async (key: string) => {
        if (!settings || saving) return

        setSaving(true)
        const updatedNotifications = {
            ...settings.notifications,
            [key]: !settings.notifications[key as keyof typeof settings.notifications]
        }

        await updateSettings({ notifications: updatedNotifications })
        setSaving(false)
    }

    if (isLoading || !settings) {
        return (
            <SettingsSection title={t('title')} icon={FiBell}>
                <div className="text-center py-4 text-(--text-2)">Cargando...</div>
            </SettingsSection>
        )
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
                        checked={settings.notifications.email}
                        onChange={() => handleToggle('email')}
                        disabled={saving}
                    />
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-(--text-1)">{t('push')}</h3>
                        <p className="text-xs text-(--text-2)">{t('pushDescription')}</p>
                    </div>
                    <Switch
                        checked={settings.notifications.push}
                        onChange={() => handleToggle('push')}
                        disabled={saving}
                    />
                </div>

                <div className="h-px bg-(--border-1)" />

                {/* Sub-categories */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-(--text-1)">{t('messages')}</span>
                        <Switch
                            checked={settings.notifications.messages}
                            onChange={() => handleToggle('messages')}
                            disabled={saving}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-(--text-1)">{t('mentors')}</span>
                        <Switch
                            checked={settings.notifications.mentors}
                            onChange={() => handleToggle('mentors')}
                            disabled={saving}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-(--text-1)">{t('security')}</span>
                        <Switch
                            checked={settings.notifications.security}
                            onChange={() => handleToggle('security')}
                            disabled={saving}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-(--text-1)">{t('news')}</span>
                        <Switch
                            checked={settings.notifications.news}
                            onChange={() => handleToggle('news')}
                            disabled={saving}
                        />
                    </div>
                </div>
            </div>
        </SettingsSection>
    )
}
