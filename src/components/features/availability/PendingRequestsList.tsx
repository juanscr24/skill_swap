'use client'

import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useSessionRequests } from '@/hooks'
import { FiCalendar } from 'react-icons/fi'
import { useTranslations } from 'next-intl'

export const PendingRequestsList = () => {
  const t = useTranslations('sessions')
  const { requests, isLoading, acceptRequest, rejectRequest, refresh } =
    useSessionRequests()

  const handleAccept = async (sessionId: string) => {
    try {
      await acceptRequest(sessionId)
      alert(t('requestAccepted'))
      refresh()
    } catch (error: any) {
      alert(error.message || t('errorManagingRequest'))
    }
  }

  const handleReject = async (sessionId: string) => {
    try {
      await rejectRequest(sessionId)
      alert(t('requestRejected'))
      refresh()
    } catch (error: any) {
      alert(error.message || t('errorManagingRequest'))
    }
  }

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string | Date) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="bg-(--bg-2) border border-(--border-1) rounded-xl p-6">
        <div className="text-center py-8 text-(--text-2)">Cargando...</div>
      </div>
    )
  }

  if (requests.length === 0) {
    return null
  }

  return (
    <div className="bg-(--bg-2) border border-(--border-1) rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold text-(--text-1)">
          {t('pendingRequests')}
        </h2>
        <span className="bg-(--button-1) text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {requests.length}
        </span>
      </div>

      <div className="space-y-4">
        {requests.map((request) => {
          const guest = request.users_sessions_guest_idTousers
          return (
            <div
              key={request.id}
              className="bg-(--bg-2) border border-(--border-1) rounded-2xl p-6"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                <Avatar
                  src={guest?.image}
                  alt={guest?.name || 'User'}
                  size="lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-(--text-1)">
                    {guest?.name || 'Usuario'}
                  </h3>
                  <p className="text-base text-(--text-2)">
                    {request.title || 'Sin tema'}
                  </p>
                </div>
              </div>

              {/* Date and Time Box */}
              <div className="bg-(--bg-1) rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-(--button-1) text-2xl" />
                  <span className="text-base text-(--text-1)">
                    {formatDate(request.start_at)} • {formatTime(request.start_at)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleReject(request.id)}
                  className="w-full py-3 bg-(--bg-1) border border-(--border-1) text-(--text-1) rounded-xl hover:bg-(--bg-2) transition-colors font-medium"
                >
                  {t('rejectRequest')}
                </Button>
                <Button
                  onClick={() => handleAccept(request.id)}
                  className="w-full py-3 bg-(--button-1) text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
                >
                  {t('acceptRequest')}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
