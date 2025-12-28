'use client'

import { useUserProfile } from '@/hooks/useUserProfile'
import { useReviews } from '@/hooks/useReviews'
import { useState } from 'react'
import { FiLoader } from 'react-icons/fi'
import { Card } from '@/components/ui/Card'
import { MentorProfileHeader } from '@/components/features/profile/mentor/MentorProfileHeader'
import { MentorAboutSection } from '@/components/features/profile/mentor/MentorAboutSection'
import { MentorSkillsSection } from '@/components/features/profile/mentor/MentorSkillsSection'
import { MentorReviewsSection } from '@/components/features/profile/mentor/MentorReviewsSection'
import { MentorAvailability } from '@/components/features/profile/mentor/MentorAvailability'
import { MentorSimilarProfiles } from '@/components/features/profile/mentor/MentorSimilarProfiles'
import { MentorStats } from '@/components/features/profile/mentor/MentorStats'
import { useMentors } from '@/hooks/useMentors'

interface UserProfileViewProps {
  userId: string
}

export const UserProfileView = ({ userId }: UserProfileViewProps) => {
  const { profile, isLoading, error, refetch } = useUserProfile(userId)
  const { createReview, deleteReview } = useReviews(userId)
  const { mentors } = useMentors({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddReview = async (rating: number, comment: string) => {
    try {
      setIsSubmitting(true)
      await createReview(userId, rating, comment)
      // Refetch profile to update reviews
      setTimeout(() => refetch(), 1000)
    } catch (err) {
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      setIsSubmitting(true)
      const result = await deleteReview(reviewId)
      if (result.success) {
        // Refetch profile to update reviews
        setTimeout(() => refetch(), 1000)
      } else {
        throw new Error(result.error)
      }
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
        <div className="flex items-center justify-center min-h-100">
          <FiLoader className="w-8 h-8 animate-spin text-(--button-1)" />
        </div>
      </div>
    )
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="px-30 max-2xl:px-14 max-lg:px-10 max-md:px-6 max-sm:px-4 py-8 max-md:py-6 max-sm:py-4 mx-auto">
        <Card className="p-6 text-center">
          <p className="text-red-500">{error || 'Error al cargar el perfil'}</p>
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
      title: (m as any).title || null,
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
          socialLinks={profile.social_links}
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
          <MentorAvailability availability={profile.availability} />

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
