'use client'

import { Card, Avatar, Badge, Button } from '@/shared/components/ui'
import { FiCalendar, FiClock } from 'react-icons/fi'
import { useTranslations } from 'next-intl'
import { SESSION_STATUS_VARIANTS } from '@/shared/constants'
import { formatLongDate, formatTime } from '@/shared/utils/date'

interface SessionUser {
  id: string
  name: string | null
  image: string | null
}

interface SessionData {
  id: string
  title: string
  description: string | null
  start_at: Date
  end_at: Date
  status: string | null
  users_sessions_host_idTousers: SessionUser | null
  users_sessions_guest_idTousers: SessionUser | null
}

interface SessionCardProps {
  sessionData: SessionData
  currentUserId?: string
  onCancel: (id: string) => Promise<{ success: boolean; error?: string }>
  onApprove: (id: string) => Promise<{ success: boolean; error?: string }>
  onReject: (id: string) => Promise<{ success: boolean; error?: string }>
  onComplete: (id: string) => Promise<{ success: boolean; error?: string }>
}

export const SessionCard = ({
  sessionData,
  currentUserId,
  onCancel,
  onApprove,
  onReject,
  onComplete
}: SessionCardProps) => {
  const t = useTranslations('sessions')

  const isHost = sessionData.users_sessions_host_idTousers?.id === currentUserId
  const isGuest = sessionData.users_sessions_guest_idTousers?.id === currentUserId
  const otherUser = isHost
    ? sessionData.users_sessions_guest_idTousers
    : sessionData.users_sessions_host_idTousers

  const statusVariant = SESSION_STATUS_VARIANTS[
    sessionData.status as keyof typeof SESSION_STATUS_VARIANTS
  ] || 'warning'

  const handleCancel = async () => {
    if (!confirm(t('confirmCancel'))) return

    const result = await onCancel(sessionData.id)
    if (!result.success) {
      alert(t('errorCancelling'))
    }
  }

  const handleApprove = async () => {
    const result = await onApprove(sessionData.id)
    if (!result.success) {
      alert(t('errorApproving'))
    }
  }

  const handleReject = async () => {
    if (!confirm(t('confirmReject'))) return

    const result = await onReject(sessionData.id)
    if (!result.success) {
      alert(t('errorRejecting'))
    }
  }

  const handleComplete = async () => {
    const result = await onComplete(sessionData.id)
    if (!result.success) {
      alert(t('errorCompleting'))
    }
  }

  const startAt = new Date(sessionData.start_at)

  return (
    <Card hover>
      <div className="flex flex-col md:flex-row items-start gap-4 max-sm:gap-3">
        <div className="p-3 max-sm:p-2 bg-(--button-1) rounded-lg">
          <FiCalendar className="w-6 h-6 max-sm:w-5 max-sm:h-5 text-(--button-1-text)" />
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-2">
            <div>
              <h3 className="text-lg max-md:text-base max-sm:text-sm font-bold text-(--text-1)">
                {sessionData.title}
              </h3>
              {sessionData.description && (
                <p className="text-sm max-sm:text-xs text-(--text-2)">
                  {sessionData.description}
                </p>
              )}
            </div>
            <Badge variant={statusVariant}>
              {t(sessionData.status || 'scheduled')}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 max-sm:gap-2 text-sm max-sm:text-xs text-(--text-2) mb-3 max-sm:mb-2">
            <div className="flex items-center gap-2 max-sm:gap-1">
              <FiCalendar className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
              <span>{formatLongDate(startAt)}</span>
            </div>
            <div className="flex items-center gap-2 max-sm:gap-1">
              <FiClock className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
              <span>
                {formatTime(startAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Avatar
                src={otherUser?.image || ''}
                alt={otherUser?.name || t('user')}
                size="sm"
              />
              <div>
                <p className="text-sm max-sm:text-xs font-medium text-(--text-1)">
                  {otherUser?.name || t('unknown')}
                </p>
                <p className="text-xs max-sm:text-[10px] text-(--text-2)">
                  {isHost ? t('guest') : t('host')}
                </p>
              </div>
            </div>

            {/* Action buttons based on status and role */}
            {sessionData.status === 'pending' && isHost && (
              <div className="flex gap-2 max-sm:gap-1 flex-wrap">
                <Button
                  primary
                  onClick={handleApprove}
                  className="px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs"
                >
                  {t('accept')}
                </Button>
                <Button
                  secondary
                  onClick={handleReject}
                  className="px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs"
                >
                  {t('reject')}
                </Button>
              </div>
            )}

            {sessionData.status === 'pending' && isGuest && (
              <div className="flex gap-2 max-sm:gap-1 flex-wrap">
                <span className="text-sm max-sm:text-xs text-(--text-2) italic">
                  {t('waitingApproval')}
                </span>
                <Button
                  secondary
                  onClick={handleCancel}
                  className="px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs"
                >
                  {t('cancel')}
                </Button>
              </div>
            )}

            {sessionData.status === 'scheduled' && (
              <div className="flex gap-2 max-sm:gap-1 flex-wrap">
                <Button
                  primary
                  onClick={handleComplete}
                  className="px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs"
                >
                  {t('markAsCompleted')}
                </Button>
                <Button
                  secondary
                  onClick={handleCancel}
                  className="px-4 max-sm:px-3 py-2 max-sm:py-1.5 max-sm:text-xs"
                >
                  {t('cancel')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
