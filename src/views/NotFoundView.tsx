'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { FiHome } from 'react-icons/fi'
import { Button } from '@/components'
import { SkillSwapLogo } from '@/components/ui/SkillSwapLogo'

export const NotFoundView = () => {
  const t = useTranslations('common')

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-1) px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <SkillSwapLogo className="w-40 max-sm:w-32" />
        </div>

        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl max-sm:text-7xl font-bold text-(--button-1) mb-4">
            404
          </h1>
          <div className="h-1 w-24 bg-(--button-1) mx-auto rounded-full animate-pulse" />
        </div>

        {/* Error Message */}
        <div className="bg-(--bg-2) border border-(--border-1) rounded-xl p-8 max-sm:p-6 mb-6">
          <h2 className="text-2xl max-sm:text-xl font-bold text-(--text-1) mb-3">
            {t('pageNotFoundTitle')}
          </h2>
          <p className="text-(--text-2) mb-6">
            {t('pageNotFoundDescription')}
          </p>

          {/* Action Button */}
          <Link href="/login">
            <Button className="w-full flex items-center justify-center gap-2">
              <FiHome className="w-5 h-5" />
              {t('backToLogin')}
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <p className="text-sm text-(--text-2)">
          {t('needHelp')}{' '}
          <Link 
            href="/login" 
            className="text-(--button-1) hover:underline font-semibold"
          >
            {t('contactSupport')}
          </Link>
        </p>
      </div>
    </div>
  )
}
