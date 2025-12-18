'use client'
import { useTranslations } from "next-intl"
import { Button, Input } from "@/components"
import Link from "next/link"

export const ForgotPasswordView = () => {
    const t = useTranslations('auth')

    return (
        <div className="min-h-screen flex items-center justify-center bg-(--bg-1) px-4">
            <div className="max-w-md w-full bg-(--bg-2) border border-(--border-1) rounded-lg p-8">
                <h1 className="text-3xl font-bold text-(--text-1) text-center mb-2">
                    {t('resetPassword')}
                </h1>
                <p className="text-(--text-2) text-center mb-8">
                    {t('resetPasswordDescription')}
                </p>

                <form className="space-y-4">
                    <Input
                        type="email"
                        label={t('email')}
                        placeholder="tu@email.com"
                        id="email"
                    />

                    <Button primary className="w-full py-3">
                        {t('sendResetLink')}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/auth/login"
                        className="text-sm text-(--button-1) hover:underline"
                    >
                        {t('backToLogin')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
