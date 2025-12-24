'use client'
import { useTranslations } from "next-intl"
import { Button, Input } from "@/components"
import Link from "next/link"

export const ForgotPasswordView = () => {
    const t = useTranslations('auth')

    return (
        <div className="min-h-screen flex items-center justify-center bg-(--bg-1) px-4 max-sm:px-2">
            <div className="max-w-md w-full bg-(--bg-2) border border-(--border-1) rounded-lg p-8 max-md:p-6 max-sm:p-4">
                <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) text-center mb-2 max-sm:mb-1">
                    {t('resetPassword')}
                </h1>
                <p className="text-(--text-2) text-center mb-8 max-md:mb-6 max-sm:mb-4 max-sm:text-sm">
                    {t('resetPasswordDescription')}
                </p>

                <form className="space-y-4 max-sm:space-y-3">
                    <Input
                        type="email"
                        label={t('email')}
                        placeholder="tu@email.com"
                        id="email"
                    />

                    <Button primary className="w-full py-3 max-sm:py-2">
                        {t('sendResetLink')}
                    </Button>
                </form>

                <div className="mt-6 max-sm:mt-4 text-center">
                    <Link
                        href="/auth/login"
                        className="text-sm max-sm:text-xs text-(--button-1) hover:underline"
                    >
                        {t('backToLogin')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
