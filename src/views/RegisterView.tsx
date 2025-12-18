'use client'
import { useTranslations } from "next-intl"
import { Button, Input } from "@/components"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

export const RegisterView = () => {
    const t = useTranslations('auth')

    return (
        <div className="min-h-screen flex items-center justify-center bg-(--bg-1) px-4">
            <div className="max-w-md w-full bg-(--bg-2) border border-(--border-1) rounded-lg p-8">
                <h1 className="text-3xl font-bold text-(--text-1) text-center mb-2">
                    {t('register')}
                </h1>
                <p className="text-(--text-2) text-center mb-8">
                    SkillSwap
                </p>

                <form className="space-y-4">
                    <Input
                        type="text"
                        label={t('name')}
                        placeholder="Juan Pérez"
                        id="name"
                    />
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
                    <Input
                        type="password"
                        label={t('confirmPassword')}
                        placeholder="••••••••"
                        id="confirmPassword"
                    />

                    <Button primary className="w-full py-3">
                        {t('registerButton')}
                    </Button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-(--border-1)" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-(--bg-2) text-(--text-2)">
                                {t('orContinueWith')}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button secondary className="flex items-center justify-center gap-2 py-3">
                            <FcGoogle className="w-5 h-5" />
                            {t('google')}
                        </Button>
                        <Button secondary className="flex items-center justify-center gap-2 py-3">
                            <FaGithub className="w-5 h-5" />
                            {t('github')}
                        </Button>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-(--text-2)">
                    {t('hasAccount')}{' '}
                    <Link href="/login" className="text-(--button-1) hover:underline font-semibold">
                        {t('login')}
                    </Link>
                </p>
            </div>
        </div>
    )
}
