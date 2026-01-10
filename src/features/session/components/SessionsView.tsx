'use client'

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useSessions, useMentorsAvailability } from "@/hooks"
import { useProfile } from "@/hooks/useProfile"
import { Tabs, Button, LoadingSpinner } from "@/shared/components"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ManageAvailability } from "./ManageAvailability"
import { SessionCard } from "./SessionCard"
import { MentorsAvailabilityCalendar } from "./MentorsAvailabilityCalendar"
import { SessionsCalendar, EventDetailModal } from "./calendar"
import { SESSION_STATUS, SESSION_TAB_IDS } from "@/shared/constants"
import type { CalendarEvent } from "@/types/calendar"

interface SessionUser {
    id: string
    name: string | null
    image: string | null
}

interface Session {
    id: string
    title: string
    description: string | null
    start_at: Date
    end_at: Date
    status: string | null
    users_sessions_host_idTousers: SessionUser | null
    users_sessions_guest_idTousers: SessionUser | null
}

export const SessionsView = () => {
    const t = useTranslations('sessions')
    const { data: session } = useSession()
    const { sessions, isLoading, cancelSession, updateSessionStatus } = useSessions('all')
    const { profile } = useProfile()
    const { mentorAvailabilities, isLoading: isLoadingMentorsAvailability } = useMentorsAvailability()

    // Modal state for calendar event details
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Check if user is a mentor
    const isMentor = (profile?.skills && profile.skills.length > 0) ||
        profile?.role === 'MENTOR' ||
        profile?.role === 'ADMIN'

    // Handle event click from calendar
    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedEvent(null)
    }

    const upcomingSessions = sessions.filter(
        (s) => s.status === SESSION_STATUS.SCHEDULED
    )

    const pastSessions = sessions.filter(
        (s) => s.status === SESSION_STATUS.COMPLETED
    )

    // Session action handlers
    const handleCancelSession = async (id: string) => {
        return await cancelSession(id)
    }

    const handleApproveSession = async (id: string) => {
        return await updateSessionStatus(id, SESSION_STATUS.SCHEDULED)
    }

    const handleRejectSession = async (id: string) => {
        return await updateSessionStatus(id, SESSION_STATUS.REJECTED)
    }

    const handleCompleteSession = async (id: string) => {
        return await updateSessionStatus(id, SESSION_STATUS.COMPLETED)
    }

    // Render session list
    const renderSessionList = (sessionList: Session[], emptyMessage: string) => {
        if (isLoading) {
            return <LoadingSpinner />
        }

        if (sessionList.length === 0) {
            return (
                <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">
                    {emptyMessage}
                </p>
            )
        }

        return (
            <div className="space-y-4 max-sm:space-y-3">
                {sessionList.map((sessionData) => (
                    <SessionCard
                        key={sessionData.id}
                        sessionData={sessionData}
                        currentUserId={session?.user?.id}
                        onCancel={handleCancelSession}
                        onApprove={handleApproveSession}
                        onReject={handleRejectSession}
                        onComplete={handleCompleteSession}
                    />
                ))}
            </div>
        )
    }

    // Define tabs
    const tabs = [
        {
            id: 'calendar',
            label: t('calendarView'),
            content: (
                <SessionsCalendar onEventClick={handleEventClick} />
            )
        },
        {
            id: SESSION_TAB_IDS.AVAILABILITY,
            label: t('myAvailability'),
            content: (
                <div>
                    {profile ? (
                        <ManageAvailability profile={profile} isMentor={isMentor} />
                    ) : (
                        <LoadingSpinner />
                    )}
                </div>
            )
        },
        {
            id: SESSION_TAB_IDS.MENTORS_AVAILABILITY,
            label: t('mentorsAvailability'),
            content: (
                <MentorsAvailabilityCalendar
                    mentorAvailabilities={mentorAvailabilities}
                    isLoading={isLoadingMentorsAvailability}
                />
            )
        },
        {
            id: SESSION_TAB_IDS.UPCOMING,
            label: t('upcomingSessions'),
            content: renderSessionList(upcomingSessions, t('noSessions'))
        },
        {
            id: SESSION_TAB_IDS.PAST,
            label: t('pastSessions'),
            content: renderSessionList(pastSessions, t('noSessions'))
        }
    ]

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 max-md:mb-6 max-sm:mb-4 gap-4">
                <div>
                    <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1)">
                        {t('sessions')}
                    </h1>
                    <p className="text-(--text-2) mt-2 max-sm:text-sm">
                        {t('sessionsDescription')}
                    </p>
                </div>
                <Link href="/sessions/schedule">
                    <Button primary className="px-6 max-sm:px-4 py-3 max-sm:py-2 max-sm:text-sm">
                        {t('scheduleSessions')}
                    </Button>
                </Link>
            </div>

            <Tabs tabs={tabs} defaultTab="calendar" />

            {/* Event Detail Modal */}
            <EventDetailModal
                event={selectedEvent}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                isMentor={isMentor}
            />
        </div>
    )
}