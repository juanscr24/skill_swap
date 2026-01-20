'use client'

import { useUserProfile } from '@/features/profile/hooks/useUserProfile'
import { useReviews } from '@/features/review/hooks/useReviews'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { LoadingSpinner } from '@/shared/components'
import { Card } from '@/shared/components/ui/Card'
import { MentorProfileHeader } from './mentor/MentorProfileHeader'
import { MentorAboutSection } from './mentor/MentorAboutSection'
import { MentorSkillsSection } from './mentor/MentorSkillsSection'
import { MentorReviewsSection } from './mentor/MentorReviewsSection'
import { MentorAvailability } from './mentor/MentorAvailability'
import { MentorSimilarProfiles } from './mentor/MentorSimilarProfiles'
import { MentorStats } from './mentor/MentorStats'
import { useMentors } from '@/features/mentor/hooks/useMentors'
import { UserProfileViewProps } from '../types'

export const UserProfileView = ({ userId }: UserProfileViewProps) => {
  const t = useTranslations('profile')
  const { profile, isLoading, error, refetch, updateReviews } = useUserProfile(userId)
  const { createReview, deleteReview } = useReviews(userId)
  const { mentors } = useMentors({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddReview = async (rating: number, comment: string) => {
    try {
      setIsSubmitting(true)
      const newReview = await createReview(userId, rating, comment)
      // Actualizar reviews en el estado local sin recargar todo el perfil
      updateReviews?.()
    } catch (err) {
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      setIsSubmitting(true)
      await deleteReview(reviewId)
      // Actualizar reviews en el estado local sin recargar todo el perfil
      updateReviews?.()
    } catch (err) {
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="px-30 max-2xl:px-14 max-lg:px-10 max-md:px-6 max-sm:px-4 py-8 max-md:py-6 max-sm:py-4 mx-auto">
        <LoadingSpinner />
      </div>
    )
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="px-30 max-2xl:px-14 max-lg:px-10 max-md:px-6 max-sm:px-4 py-8 max-md:py-6 max-sm:py-4 mx-auto">
        <Card className="p-6 text-center">
          <p className="text-red-500">{error || t('errorLoadingProfile')}</p>
        </Card>
      </div>
    )
  }

  // Get similar mentors (filter out current mentor and limit to 5)
  const similarMentors = mentors
    .filter(m => m.id !== userId)
    .slice(0, 5)
    .map(m => ({
      id: m.id,
      name: m.name,
      image: m.image,
      title: m.title || null,
      averageRating: m.averageRating,
    }))

  return (
    <div className="px-30 max-2xl:px-14 max-lg:px-10 max-md:px-6 max-sm:px-4 py-8 max-md:py-6 max-sm:py-4 mx-auto">
      {/* Header - Full Width */}
      <div className="mb-8">
        <MentorProfileHeader
          name={profile.name || ''}
          title={profile.title}
          city={profile.city}
          image={profile.image}
          rating={profile.averageRating}
          totalReviews={profile.totalReviews}
          socialLinks={profile.social_links || undefined}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <MentorAboutSection bio={profile.bio} />

          <MentorSkillsSection
            skillsTeach={profile.skills}
            skillsLearn={profile.wanted_skills}
          />

          <MentorReviewsSection
            reviews={profile.reviews}
            mentorId={userId}
            onAddReview={handleAddReview}
            onDeleteReview={handleDeleteReview}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <MentorAvailability
            mentorId={userId}
            mentorName={profile.name || 'this mentor'}
            availability={profile.availability}
          />

          <MentorStats
            totalSessions={profile.totalSessions}
            totalHours={profile.totalHours}
            totalReviews={profile.totalReviews}
            averageRating={profile.averageRating}
          />

          <MentorSimilarProfiles
            mentorName={profile.name || 'this mentor'}
            similarMentors={similarMentors}
          />
        </div>
      </div>
    </div>
  )
}
