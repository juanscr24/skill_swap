'use client'

import { ReactNode, useEffect, useState } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { useLocaleStore } from '@/stores/localeStore'
import type { LocaleProviderProps } from '@/types'

export function LocaleProvider({ children }: LocaleProviderProps) {
    const { locale, messages } = useLocaleStore()
    const [mounted, setMounted] = useState(false)

    // Esperar a que Zustand se hidrate desde localStorage
    useEffect(() => {
        setMounted(true)
    }, [])

    // Durante SSR y la primera renderización, usar el locale del store
    // (que será el valor por defecto o el valor hidratado de localStorage)
    return (
        <NextIntlClientProvider
            messages={messages}
            locale={locale}
            // Evitar warnings de hydration
            timeZone="America/Bogota"
        >
            {children}
        </NextIntlClientProvider>
    )
}
