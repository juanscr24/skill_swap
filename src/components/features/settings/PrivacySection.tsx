'use client'

import { useTranslations } from "next-intl"
import { FiEye } from "react-icons/fi"
import { SettingsSection } from "./SettingsSection"
import { Select } from "../../ui/Select"
import { useSettingsStore } from "@/stores/settingsStore"

export const PrivacySection = () => {
    const t = useTranslations('settings.privacy')
    const { privacy, setPrivacy } = useSettingsStore()

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
                            value={privacy.visibility}
                            onChange={(e) => setPrivacy('visibility', e.target.value)}
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
                            value={privacy.messagesPrivacy}
                            onChange={(e) => setPrivacy('messagesPrivacy', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </SettingsSection>
    )
}
