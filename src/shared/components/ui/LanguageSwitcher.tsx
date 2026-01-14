'use client'

import Image from 'next/image'
import { useTransition } from 'react'
import { useLocaleStore } from '@/stores/localeStore'
import { flagEn, flagEs } from '@public/index'
import { LanguageSwitcherProps } from '@/shared/types/ui.types'

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
    const { locale, setLocale } = useLocaleStore()
    const [isPending, startTransition] = useTransition()

    const toggleLanguage = () => {
        const newLocale = locale === 'es' ? 'en' : 'es'

        startTransition(() => {
            setLocale(newLocale)
        })
    }

    return (
        <button
            onClick={toggleLanguage}
            className={`flex items-center justify-center p-2 rounded-md hover:scale-103 transition-all duration-200 cursor-pointer ${className || ''}`}
            disabled={isPending}
        >
            <Image
                src={locale === 'es' ? flagEs : flagEn}
                alt={locale === 'es' ? 'Español' : 'English'}
                width={30}
                height={22}
                className={`rounded-sm transition-all duration-300 ${isPending ? 'opacity-60 scale-90' : 'opacity-100'
                    }`}
            />
        </button>
    )
}