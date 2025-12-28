'use client'

import { useTranslations } from "next-intl"
import { FiAlertTriangle } from "react-icons/fi"
import { Button } from "../../ui/Button"

export const DeleteAccountSection = () => {
    const t = useTranslations('settings.danger')

    const handleDelete = () => {
        if (confirm(t('confirmDelete'))) {
            // API call implementation
            console.log('Account deleted')
        }
    }

    return (
        <section className="bg-red-500/5 rounded-xl border border-red-500/20 overflow-hidden">
            <div className="p-6 max-sm:p-4 border-b border-red-500/20">
                <div className="flex items-center gap-3">
                    <FiAlertTriangle className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">{t('title')}</h2>
                </div>
            </div>
            <div className="p-6 max-sm:p-4 flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-4">
                <div>
                    <h3 className="text-sm font-medium text-(--text-1)">{t('deleteAccount')}</h3>
                    <p className="text-xs text-(--text-2)">{t('deleteDescription')}</p>
                </div>
                <Button
                    onClick={handleDelete}
                    className="max-sm:w-full bg-red-500 hover:bg-red-600 text-white"
                >
                    {t('deleteButton')}
                </Button>
            </div>
        </section>
    )
}
