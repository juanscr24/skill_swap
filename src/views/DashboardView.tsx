'use client'

import { useTranslations } from "next-intl"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { useSessions } from "@/hooks/useSessions"
import { useRecentActivity } from "@/hooks/useRecentActivity"
import { useUserImpact } from "@/hooks/useUserImpact"
import { 
  StatsOverview, 
  QuickActions, 
  UpcomingSessions, 
  RecentActivity, 
  UserImpact 
} from "@/components/features/dashboard/sections"

export const DashboardView = () => {
  const t = useTranslations('dashboard')
  
  // Hooks para obtener datos de manera modular
  const { stats, isLoading: isLoadingStats } = useDashboardStats()
  const { sessions, isLoading: isLoadingSessions } = useSessions('upcoming')
  const { activities, isLoading: isLoadingActivities } = useRecentActivity()
  const { impact, isLoading: isLoadingImpact } = useUserImpact()

  return (
    <div className="p-8 max-md:p-6 max-sm:p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-2">
          {t('dashboard')}
        </h1>
        <p className="text-(--text-2)">
          {t('impactDescription')}
        </p>
      </div>

      {/* Stats Overview Section */}
      <StatsOverview 
        stats={stats} 
        isLoading={isLoadingStats} 
        className="mb-8"
      />

      {/* Quick Actions Section */}
      <QuickActions className="mb-8" />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Sessions */}
          <UpcomingSessions 
            sessions={sessions} 
            isLoading={isLoadingSessions}
          />

          {/* Recent Activity */}
          <RecentActivity 
            activities={activities} 
            isLoading={isLoadingActivities}
          />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="lg:col-span-1">
          {/* User Impact */}
          <UserImpact 
            impact={impact} 
            isLoading={isLoadingImpact}
          />
        </div>
      </div>
    </div>
  )
}
