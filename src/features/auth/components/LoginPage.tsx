'use client'
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { useForm } from "react-hook-form"
import { useAuth } from "@/features/auth"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input } from "@/shared/components/ui"
import { SkillSwapLogo } from "@/shared/components/ui/SkillSwapLogo"
import { loginSchema, type LoginInput } from "@/features/auth/validations/login"

export const LoginPage = () => {
    const t = useTranslations('auth')
    const { login, loginWithGoogle, loginWithGithub, isLoading, error: authError } = useAuth()

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' }
    })

    const { handleSubmit, formState: { errors, isSubmitting } } = form

    const onSubmit = async (data: LoginInput) => {
        try {
            const result = await login(data)
            if (!result.success) {
                form.setError('root', { message: result.error || 'Error al iniciar sesión' })
            }
        } catch (err: any) {
            form.setError('root', { message: err.message || 'Error al iniciar sesión' })
        }
    }

    const globalError = form.formState.errors.root?.message || authError

    return (
        <div className="min-h-screen flex items-center justify-center bg-(--bg-1) px-4 max-sm:px-2">
            <div className="max-w-md w-full bg-(--bg-2) border border-(--border-1) rounded-lg p-8 max-md:p-6 max-sm:p-4 shadow-xl">

                {/* Logo */}
                <div className="flex justify-center mb-8 max-md:mb-6 max-sm:mb-4">
                    <SkillSwapLogo className="w-50 max-xl:w-45 max-md:w-40 max-sm:w-35" />
                </div>

                {/* Error global */}
                {globalError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                        {globalError}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-sm:space-y-3">
                    <Input
                        {...form.register('email')}
                        type="email"
                        label={t('email')}
                        placeholder="tu@email.com"
                        error={errors.email?.message}
                    />

                    <Input
                        {...form.register('password')}
                        type="password"
                        label={t('password')}
                        placeholder="••••••••"
                        error={errors.password?.message}
                    />

                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-sm text-(--button-1) hover:underline">
                            {t('forgotPassword')}
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        primary
                        className="w-full py-3 max-sm:py-2"
                        disabled={isLoading || isSubmitting}
                    >
                        {isLoading || isSubmitting ? t('loading') : t('loginButton')}
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative my-8 max-sm:my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-(--border-1)" />
                    </div>
                    <div className="relative flex justify-center text-xs max-sm:text-[10px]">
                        <span className="px-2 bg-(--bg-2) text-(--text-2)">
                            {t('orContinueWith')}
                        </span>
                    </div>
                </div>

                {/* OAuth buttons */}
                <div className="grid grid-cols-2 gap-3 max-sm:gap-2">
                    <Button
                        type="button"
                        secondary
                        onClick={loginWithGoogle}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 py-3 max-sm:py-2 text-sm max-sm:text-xs"
                    >
                        <FcGoogle className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
                        {t('google')}
                    </Button>

                    <Button
                        type="button"
                        secondary
                        onClick={loginWithGithub}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 py-3 max-sm:py-2 text-sm max-sm:text-xs"
                    >
                        <FaGithub className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
                        {t('github')}
                    </Button>
                </div>

                {/* Register link */}
                <p className="mt-8 max-md:mt-6 max-sm:mt-4 text-center text-sm max-sm:text-xs text-(--text-2)">
                    {t('noAccount')}{' '}
                    <Link href="/register" className="text-(--button-1) hover:underline font-semibold">
                        {t('register')}
                    </Link>
                </p>
            </div>
        </div>
    )
}
