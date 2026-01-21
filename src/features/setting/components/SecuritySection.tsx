'use client'

import { useState } from 'react'
import { useTranslations } from "next-intl"
import { FiLock, FiLogOut } from "react-icons/fi"
import { SettingsSection } from "./SettingsSection"
import { Button } from "../../../shared/components/ui/Button"

export const SecuritySection = () => {
    const t = useTranslations('settings.security')
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isClosing, setIsClosing] = useState(false)

    const handleChangePassword = async () => {
        setError('')
        setSuccess('')

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError(t('passwordMismatch'))
            return
        }

        if (passwordForm.newPassword.length < 8) {
            setError(t('passwordTooShort'))
            return
        }

        try {
            const response = await fetch('/api/settings/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || t('passwordChangeError'))
            }

            setSuccess(t('passwordUpdated'))
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            setIsChangingPassword(false)
        } catch (err: any) {
            setError(err.message || t('passwordChangeError'))
        }
    }

    const handleCloseSessions = async () => {
        if (!confirm(t('confirmCloseSessions'))) {
            return
        }

        setIsClosing(true)
        try {
            const response = await fetch('/api/settings/close-sessions', {
                method: 'POST'
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || t('closeSessionsError'))
            }

            alert(data.message || t('sessionsClosed'))
        } catch (err: any) {
            alert(err.message || t('closeSessionsError'))
        } finally {
            setIsClosing(false)
        }
    }

    return (
        <SettingsSection
            title={t('title')}
            icon={FiLock}
        >
            <div className="space-y-6">
                {/* Change Password */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-3">
                        <div>
                            <h3 className="text-sm font-medium text-(--text-1)">{t('password')}</h3>
                            <p className="text-xs text-(--text-2)">{t('passwordDescription')}</p>
                        </div>
                        <Button 
                            secondary 
                            className="w-auto"
                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                        >
                            {isChangingPassword ? t('cancel') : t('changePassword')}
                        </Button>
                    </div>

                    {isChangingPassword && (
                        <div className="space-y-3 mt-4 p-4 bg-(--bg-1) rounded-lg">
                            <input
                                type="password"
                                placeholder={t('currentPassword')}
                                className="w-full px-3 py-2 bg-(--bg-2) border border-(--border-1) rounded-lg text-(--text-1) text-sm"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder={t('newPassword')}
                                className="w-full px-3 py-2 bg-(--bg-2) border border-(--border-1) rounded-lg text-(--text-1) text-sm"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder={t('confirmPassword')}
                                className="w-full px-3 py-2 bg-(--bg-2) border border-(--border-1) rounded-lg text-(--text-1) text-sm"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            />
                            {error && <p className="text-xs text-red-500">{error}</p>}
                            {success && <p className="text-xs text-green-500">{success}</p>}
                            <Button 
                                primary 
                                onClick={handleChangePassword}
                                className="w-full"
                            >
                                {t('savePassword')}
                            </Button>
                        </div>
                    )}
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
                        disabled={isClosing}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10 w-auto bg-transparent border-transparent disabled:opacity-50"
                    >
                        <FiLogOut className="mr-2 inline-block" />
                        {isClosing ? 'Cerrando...' : t('closeSessions')}
                    </Button>
                </div>
            </div>
        </SettingsSection>
    )
}
