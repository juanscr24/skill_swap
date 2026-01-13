'use client'
import Link from "next/link"
import { useForm } from 'react-hook-form'
import { useTranslations } from "next-intl"
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from "@/shared/components/ui"
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/validations/forgot'

export const ForgotPasswordPage = () => {
    const t = useTranslations('auth')

    const form = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    })

    const { handleSubmit, formState: { isSubmitting, errors } } = form

    const onSubmit = async (data: ForgotPasswordInput) => {
        console.log('Enviar reset:', data)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-(--bg-1) px-4 max-sm:px-2">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md w-full bg-(--bg-2) border border-(--border-1) rounded-lg p-8 max-md:p-6 max-sm:p-4 shadow-xl"
            >
                <div className="text-center mb-8 max-md:mb-6 max-sm:mb-4">
                    <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-2 max-sm:mb-1">
                        {t('resetPassword')}
                    </h1>
                    <p className="text-(--text-2) max-sm:text-sm">
                        {t('resetPasswordDescription')}
                    </p>
                </div>

                <div className="space-y-4 max-sm:space-y-3">
                    <Input
                        {...form.register('email')}
                        type="email"
                        label={t('email')}
                        placeholder="tu@email.com"
                        error={errors.email?.message}
                    />

                    <Button
                        type="submit"
                        primary
                        className="w-full py-3 max-sm:py-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('sending') : t('sendResetLink')}
                    </Button>
                </div>

                <div className="mt-6 max-sm:mt-4 text-center">
                    <Link
                        href="/login"
                        className="text-sm max-sm:text-xs text-(--button-1) hover:underline"
                    >
                        {t('backToLogin')}
                    </Link>
                </div>
            </form>
        </div>
    )
}
