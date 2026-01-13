'use client'

import { useTranslations } from "next-intl"
import { FiMonitor, FiMoon, FiSun, FiGlobe } from "react-icons/fi"
import { useThemeStore } from "@/stores/themeStore"
import { useLocaleStore } from "@/stores/localeStore"
import { SettingsSection } from "./SettingsSection"

export const PreferencesSection = () => {
    const t = useTranslations('settings.preferences')
    const { theme, setTheme } = useThemeStore()
    const { locale, setLocale } = useLocaleStore()

    return (
        <SettingsSection
            title={t('title')}
            icon={FiMonitor}
        >
            <div className="space-y-6">
                {/* Theme Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-(--text-1)">{t('theme')}</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'light'
                                        ? 'bg-(--button-1)/10 border-(--button-1) text-(--button-1-text)'
                                        : 'bg-(--bg-1) border-transparent hover:bg-(--border-1) text-(--text-2)'
                                    }`}
                            >
                                <FiSun className="w-4 h-4" />
                                <span>{t('light')}</span>
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${theme === 'dark'
                                        ? 'bg-(--button-1)/10 border-(--button-1) text-(--button-1-text)' // Fixed text color for active dark mode
                                        : 'bg-(--bg-1) border-transparent hover:bg-(--border-1) text-(--text-2)'
                                    }`}
                            >
                                <FiMoon className="w-4 h-4" />
                                <span>{t('dark')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Language Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-(--text-1)">{t('language')}</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setLocale('es')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${locale === 'es'
                                        ? 'bg-(--button-1)/10 border-(--button-1) text-(--button-1-text)'
                                        : 'bg-(--bg-1) border-transparent hover:bg-(--border-1) text-(--text-2)'
                                    }`}
                            >
                                <span className="text-lg">🇪🇸</span>
                                <span>{t('es')}</span>
                            </button>
                            <button
                                onClick={() => setLocale('en')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${locale === 'en'
                                        ? 'bg-(--button-1)/10 border-(--button-1) text-(--button-1-text)'
                                        : 'bg-(--bg-1) border-transparent hover:bg-(--border-1) text-(--text-2)'
                                    }`}
                            >
                                <span className="text-lg">🇺🇸</span>
                                <span>{t('en')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsSection>
    )
}
