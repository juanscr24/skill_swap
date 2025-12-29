'use client'

import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useSessionRequests } from '@/hooks'

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
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string | Date) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateDuration = (start: string | Date, end: string | Date) => {
    const startTime = new Date(start).getTime()
    const endTime = new Date(end).getTime()
    return Math.round((endTime - startTime) / (1000 * 60))
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-(--text-2)">Cargando...</div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-(--text-2)">
        No tienes solicitudes pendientes
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-(--text-1)">
        {translations.pendingRequests}
      </h2>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-(--bg-2) border border-(--border-1) rounded-lg p-6 space-y-4"
          >
            {/* Student Info */}
            <div className="flex items-center gap-3">
              <Avatar
                src={request.users_sessions_guest_idTousers?.image}
                alt={request.users_sessions_guest_idTousers?.name || 'Student'}
                size="md"
              />
              <div>
                <p className="font-semibold text-(--text-1)">
                  {request.users_sessions_guest_idTousers?.name}
                </p>
                <p className="text-sm text-(--text-2)">
                  {request.users_sessions_guest_idTousers?.email}
                </p>
              </div>
            </div>

            {/* Session Details */}
            <div className="space-y-2">
              <div>
                <p className="text-sm text-(--text-2)">{translations.topic}</p>
                <p className="font-semibold text-(--text-1)">{request.title}</p>
              </div>

              {request.description && (
                <div>
                  <p className="text-sm text-(--text-2)">
                    {translations.description}
                  </p>
                  <p className="text-(--text-1)">{request.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-(--text-2)">{translations.date}</p>
                  <p className="text-(--text-1)">
                    {formatDate(request.start_at)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-(--text-2)">{translations.time}</p>
                  <p className="text-(--text-1)">
                    {formatTime(request.start_at)} -{' '}
                    {formatTime(request.end_at)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-(--text-2)">
                  {translations.duration}
                </p>
                <p className="text-(--text-1)">
                  {calculateDuration(request.start_at, request.end_at)}{' '}
                  {translations.minutes}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                primary
                onClick={() => handleAccept(request.id)}
                disabled={isLoading}
                className="flex-1"
              >
                {translations.acceptRequest}
              </Button>
              <Button
                secondary
                onClick={() => handleReject(request.id)}
                disabled={isLoading}
                className="flex-1"
              >
                {translations.rejectRequest}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
