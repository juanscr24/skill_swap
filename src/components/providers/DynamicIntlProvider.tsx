'use client'

import { useClientLocale } from '@/contexts/LocaleProvider'
import { ReactNode } from 'react'
import type { DynamicIntlProviderProps } from '@/types'

export function DynamicIntlProvider({ children }: DynamicIntlProviderProps) {
    // LocaleProvider ya incluye NextIntlClientProvider, solo retornamos children
    return <>{children}</>
}
