'use client'

import type { PropsWithChildren } from 'react'

export function DynamicIntlProvider({ children }: PropsWithChildren) {
    // LocaleProvider ya incluye NextIntlClientProvider, solo retornamos children
    return <>{children}</>
}
