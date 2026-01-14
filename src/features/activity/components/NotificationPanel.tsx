'use client'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { FiX, FiCheckCircle } from 'react-icons/fi'

import { useAllActivity } from '../hooks/useAllActivity'
import { useUnreadCount } from '../hooks/useUnreadCount'
import { LoadingSpinner } from '@/shared/components'
import Link from 'next/link'
import { NotificationItem } from './NotificationItem'

interface NotificationPanelProps {
    isOpen: boolean
    onClose: () => void
    onMarkAllRead?: () => void
}

export const NotificationPanel = ({ isOpen, onClose, onMarkAllRead }: NotificationPanelProps) => {
    const t = useTranslations('notifications')
    const { activities, isLoading, refetch } = useAllActivity()
    const { unreadCount } = useUnreadCount()

    // Tomar solo las últimas 5 notificaciones
    const recentNotifications = activities.slice(0, 5)

    // Función para marcar todas como leídas
    const handleMarkAllRead = async () => {
        try {
            const response = await fetch('/api/dashboard/activity/mark-read', {
                method: 'POST'
            })

            if (response.ok) {
                // Refrescar las actividades y el contador
                await refetch()
                if (onMarkAllRead) {
                    onMarkAllRead()
                }
            }
        } catch (error) {
            console.error('Error al marcar como leídas:', error)
        }
    }

    // Bloquear scroll cuando el panel está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`fixed bottom-0 right-0 h-[calc(100dvh-4rem)] max-md:h-[calc(100dvh-3.5rem)] w-full max-w-md bg-(--bg-2) shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    } flex flex-col max-sm:max-w-full`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-(--border-1)">
                    <div>
                        <h2 className="text-xl font-bold text-(--text-1) flex items-center gap-2">
                            {t('title')}
                            {unreadCount > 0 && (
                                <span className="bg-(--button-1) text-(--button-1-text) text-xs font-semibold px-2 py-1 rounded-full">
                                    {unreadCount} {t('new')}
                                </span>
                            )}
                        </h2>
                        <p className="text-sm text-(--text-2) mt-1">
                            {t('subtitle')}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-(--bg-1) rounded-lg transition-colors text-(--text-1)"
                        aria-label={t('close')}
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <LoadingSpinner />
                        </div>
                    ) : recentNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-(--bg-1) flex items-center justify-center mb-4">
                                <FiCheckCircle className="w-8 h-8 text-(--text-2)" />
                            </div>
                            <h3 className="text-lg font-semibold text-(--text-1) mb-2">
                                {t('noNotifications')}
                            </h3>
                            <p className="text-sm text-(--text-2)">
                                {t('noNotificationsDescription')}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-(--border-1)">
                            {recentNotifications.map((activity) => (
                                <NotificationItem
                                    key={activity.id}
                                    activity={activity}
                                    onClick={onClose}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {recentNotifications.length > 0 && (
                    <div className="p-4 border-t border-(--border-1)">
                        <Link
                            href="/activity"
                            onClick={onClose}
                            className="block w-full text-center py-3 bg-(--button-1) text-(--button-1-text) rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            {t('viewAll')}
                        </Link>
                        <button
                            onClick={handleMarkAllRead}
                            disabled={unreadCount === 0}
                            className="block w-full text-center py-2 text-sm text-(--text-2) hover:text-(--text-1) transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiCheckCircle className="inline-block w-4 h-4 mr-1" />
                            {t('markAllRead')}
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
