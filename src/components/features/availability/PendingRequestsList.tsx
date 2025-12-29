'use client'

import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useSessionRequests } from '@/hooks'
import { FiCalendar } from 'react-icons/fi'

interface PendingRequestsListProps {
  translations: {
    pendingRequests: string
    acceptRequest: string
    rejectRequest: string
    requestAccepted: string
    requestRejected: string
    errorManagingRequest: string
    topic: string
    description: string
    duration: string
    minutes: string
    date: string
    time: string
  }
}

export const PendingRequestsList = ({
  translations,
}: PendingRequestsListProps) => {
  const { requests, isLoading, acceptRequest, rejectRequest, refresh } =
    useSessionRequests()

  const handleAccept = async (sessionId: string) => {
    try {
      await acceptRequest(sessionId)
      alert(translations.requestAccepted)
      refresh()
    } catch (error: any) {
      alert(error.message || translations.errorManagingRequest)
    }
  }

  const handleReject = async (sessionId: string) => {
    try {
      await rejectRequest(sessionId)
      alert(translations.requestRejected)
      refresh()
    } catch (error: any) {
      alert(error.message || translations.errorManagingRequest)
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
      <div className="bg-[var(--bg-2)] border border-[var(--border-1)] rounded-xl p-6">
        <div className="text-center py-8 text-[var(--text-2)]">Cargando...</div>
      </div>
    )
  }

  if (requests.length === 0) {
    return null
  }

  return (
    <div className="bg-[var(--bg-2)] border border-[var(--border-1)] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-1)]">
          {translations.pendingRequests}
        </h2>
        <span className="bg-[var(--button-1)] text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {requests.length}
        </span>
      </div>

      <div className="space-y-4">
        {requests.map((request) => {
          const guest = request.users_sessions_guest_idTousers
          return (
            <div
              key={request.id}
              className="bg-[var(--bg-1)] border border-[var(--border-1)] rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                {/* User Info */}
                <div className="flex items-center gap-3 flex-1">
                  <Avatar
                    src={guest?.image}
                    alt={guest?.name || 'User'}
                    size="md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--text-1)]">
                      {guest?.name || 'Usuario'}
                    </h3>
                    <p className="text-sm text-[var(--text-2)]">
                      {request.title || 'Sin tema'}
                    </p>

                    {/* Date and Time */}
                    <div className="flex items-center gap-2 mt-2 text-sm text-[var(--text-2)]">
                      <FiCalendar className="text-[var(--button-1)]" />
                      <span>
                        {formatDate(request.start_at)} • {formatTime(request.start_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleReject(request.id)}
                    className="px-4 py-2 bg-[var(--bg-2)] border border-[var(--border-1)] text-[var(--text-1)] rounded-lg hover:bg-[var(--bg-1)] transition-colors"
                  >
                    {translations.rejectRequest}
                  </Button>
                  <Button
                    onClick={() => handleAccept(request.id)}
                    className="px-4 py-2 bg-[var(--button-1)] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {translations.acceptRequest}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
