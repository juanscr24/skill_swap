'use client'

import { useTranslations } from "next-intl"
import { FiEye } from "react-icons/fi"
import { SettingsSection } from "./SettingsSection"
import { Select } from "../../../shared/components/ui/Select"
import { useSettings } from "../hooks/useSettings"
import { useState } from "react"

export const PrivacySection = () => {
    const t = useTranslations('settings.privacy')
    const { settings, updateSettings, isLoading } = useSettings()
    const [saving, setSaving] = useState(false)

    const handleChange = async (key: 'visibility' | 'messagesPrivacy', value: string) => {
        if (!settings || saving) return

        setSaving(true)
        const updatedPrivacy = {
            ...settings.privacy,
            [key]: value
        }

        await updateSettings({ privacy: updatedPrivacy })
        setSaving(false)
    }

    if (isLoading || !settings) {
        return (
            <SettingsSection title={t('title')} icon={FiEye}>
                <div className="text-center py-4 text-(--text-2)">Cargando...</div>
            </SettingsSection>
        )
    }

    const VisibilityOptions = [
        { value: 'public', label: t('public') },
        { value: 'mentors', label: t('mentorsOnly') },
        { value: 'private', label: t('private') },
    ]

    const MessagesOptions = [
        { value: 'everyone', label: t('everyone') },
        { value: 'matches', label: t('matchesOnly') },
        { value: 'mentors', label: t('mentorsOnly') },
    ]

    return (
        <SettingsSection
            title={t('title')}
            icon={FiEye}
        >
            <div className="space-y-6">
                {/* Profile Visibility */}
                <div className="flex items-center justify-between max-sm:flex-col max-sm:items-stretch max-sm:gap-3">
                    <div>
                        <h3 className="text-sm font-medium text-(--text-1)">{t('visibility')}</h3>
                        <p className="text-xs text-(--text-2)">{t('visibilityDescription')}</p>
                    </div>
                    <div className="w-48 max-sm:w-full">
                        <Select
                            options={VisibilityOptions}
                            value={settings.privacy.visibility}
                            onChange={(e) => handleChange('visibility', e.target.value)}
                            disabled={saving}
                        />
                    </div>
                </div>

                <div className="h-px bg-(--border-1)" />

                {/* Messages Privacy */}
                <div className="flex items-center justify-between max-sm:flex-col max-sm:items-stretch max-sm:gap-3">
                    <div>
                        <h3 className="text-sm font-medium text-(--text-1)">{t('messages')}</h3>
                        <p className="text-xs text-(--text-2)">{t('messagesDescription')}</p>
                    </div>
                    <div className="w-48 max-sm:w-full">
                        <Select
                            options={MessagesOptions}
                            value={settings.privacy.messagesPrivacy}
                            onChange={(e) => handleChange('messagesPrivacy', e.target.value)}
                            disabled={saving}
                        />
                    </div>
                </div>
            </div>
        </SettingsSection>
    )
}
