'use client'
import { useTranslations } from "next-intl"
import { Button, Input } from "@/components"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

export const LoginView = () => {
    const t = useTranslations('auth')

    return (
        <div className="min-h-screen flex items-center justify-center bg-(--bg-1) px-4 max-sm:px-2">
            <div className="max-w-md w-full bg-(--bg-2) border border-(--border-1) rounded-lg p-8 max-md:p-6 max-sm:p-4">
                <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) text-center mb-2 max-sm:mb-1">
                    {t('login')}
                </h1>
                <p className="text-(--text-2) text-center mb-8 max-md:mb-6 max-sm:mb-4 max-sm:text-sm">
                    SkillSwap
                </p>

                <form className="space-y-4 max-sm:space-y-3">
                    <Input
                        type="email"
                        label={t('email')}
                        placeholder="tu@email.com"
                        id="email"
                    />
                    <Input
                        type="password"
                        label={t('password')}
                        placeholder="••••••••"
                        id="password"
                    />

                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-sm max-sm:text-xs text-(--button-1) hover:underline"
                        >
                            {t('forgotPassword')}
                        </Link>
                    </div>

                    <Button primary className="w-full py-3 max-sm:py-2">
                        {t('loginButton')}
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
                        <Button secondary className="flex items-center justify-center gap-2 max-sm:gap-1 py-3 max-sm:py-2 max-sm:text-sm">
                            <FcGoogle className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
                            {t('google')}
                        </Button>
                        <Button secondary className="flex items-center justify-center gap-2 max-sm:gap-1 py-3 max-sm:py-2 max-sm:text-sm">
                            <FaGithub className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
                            {t('github')}
                        </Button>
                    </div>
                </div>

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
