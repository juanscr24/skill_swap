'use client'
import { useTranslations } from "next-intl"
import { Button, Input } from "@/components"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterInput } from "@/validations/auth"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import { SkillSwapLogo } from "@/components/ui/SkillSwapLogo"

export const RegisterView = () => {
    const t = useTranslations('auth')
    const { register: registerUser, loginWithGoogle, loginWithGithub, isLoading, error: authError } = useAuth()
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur', // Validar cuando el campo pierde el foco
    })

    const onSubmit = async (data: RegisterInput) => {
        try {
            setSubmitError(null)

            const result = await registerUser(data)

            if (!result.success) {
                setSubmitError(result.error || 'Error al registrar usuario')
            }
        } catch (err: any) {
            setSubmitError(err.message || 'Error al registrar usuario')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-(--bg-1) px-4 max-sm:px-2 py-8 max-sm:py-4">
            <div className="max-w-md w-full bg-(--bg-2) border border-(--border-1) rounded-lg p-8 max-md:p-6 max-sm:p-4">
                <div className="flex justify-center">
                    <SkillSwapLogo className="w-50 max-xl:w-45 max-md:w-40 max-sm:w-35 mb-8 max-xl:mb-7 max-md:mb-6 max-sm:mb-5" />
                </div>
                {(submitError || authError) && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                        {submitError || authError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-sm:space-y-3">
                    <div>
                        <Input
                            type="text"
                            label={t('name')}
                            placeholder="Juan Pérez"
                            id="name"
                            {...register('name')}
                            error={errors.name?.message}
                        />
                    </div>
                    <div>
                        <Input
                            type="email"
                            label={t('email')}
                            placeholder="tu@email.com"
                            id="email"
                            {...register('email')}
                            error={errors.email?.message}
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            label={t('password')}
                            placeholder="••••••••"
                            id="password"
                            {...register('password')}
                            error={errors.password?.message}
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            label={t('confirmPassword')}
                            placeholder="••••••••"
                            id="confirmPassword"
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
                        />
                    </div>

                    <Button
                        type="submit"
                        primary
                        className="w-full py-3 max-sm:py-2"
                        disabled={isLoading || isSubmitting}
                    >
                        {isLoading || isSubmitting ? 'Cargando...' : t('registerButton')}
                    </Button>
                </form>

                <div className="mt-6 max-sm:mt-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-(--border-1)" />
                        </div>
                        <div className="relative flex justify-center text-sm max-sm:text-xs">
                            <span className="px-2 bg-(--bg-2) text-(--text-2)">
                                {t('orContinueWith')}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 max-sm:mt-4 grid grid-cols-2 gap-3 max-sm:gap-2">
                        <Button
                            type="button"
                            secondary
                            className="flex items-center justify-center gap-2 max-sm:gap-1 py-3 max-sm:py-2 max-sm:text-sm"
                            onClick={loginWithGoogle}
                            disabled={isLoading}
                        >
                            <FcGoogle className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
                            {t('google')}
                        </Button>
                        <Button
                            type="button"
                            secondary
                            className="flex items-center justify-center gap-2 max-sm:gap-1 py-3 max-sm:py-2 max-sm:text-sm"
                            onClick={loginWithGithub}
                            disabled={isLoading}
                        >
                            <FaGithub className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
                            {t('github')}
                        </Button>
                    </div>
                </div>

                <p className="mt-8 max-md:mt-6 max-sm:mt-4 text-center text-sm max-sm:text-xs text-(--text-2)">
                    {t('hasAccount')}{' '}
                    <Link href="/login" className="text-(--button-1) hover:underline font-semibold">
                        {t('login')}
                    </Link>
                </p>
            </div>
        </div>
    )
}
