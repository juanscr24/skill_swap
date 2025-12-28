'use client'
import { useTranslations } from "next-intl"
import { useProfile } from "@/hooks/useProfile"
import { FiLoader, FiClock, FiCheckCircle } from "react-icons/fi"
import { ProfileHeader } from "@/components/features/profile/user/ProfileHeader"
import { SocialLinks } from "@/components/features/profile/user/SocialLinks"
import { StatsCard } from "@/components/features/profile/user/StatsCard"
import { SkillsSection } from "@/components/features/profile/user/SkillsSection"
import { ReviewsChart } from "@/components/features/profile/user/ReviewsChart"
import { AvailabilitySchedule } from "@/components/features/profile/user/AvailabilitySchedule"
import { LanguagesSection } from "@/components/features/profile/user/LanguagesSection"
import { Card } from "@/components/ui/Card"
import Link from "next/link"
import { Pencil } from "lucide-react"

export const ProfileView = () => {
    const t = useTranslations('profile')
    const { profile, isLoading, error, updateProfile, addSkill, removeSkill, addWantedSkill, removeWantedSkill } = useProfile()

    // Loading state
    if (isLoading) {
        return (
            <div className="p-8 max-md:p-6 max-sm:p-4 max-w-7xl mx-auto">
                <div className="flex items-center justify-center min-h-100">
                    <FiLoader className="w-8 h-8 animate-spin text-(--button-1)" />
                </div>
            </div>
        )
    }

    // Error state
    if (error || !profile) {
        return (
            <div className="p-8 max-md:p-6 max-sm:p-4 max-w-7xl mx-auto">
                <Card className="p-6 text-center">
                    <p className="text-red-500">{error || 'Error al cargar el perfil'}</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="px-30 max-2xl:px-14 max-lg:px-10 max-md:px-6 max-sm:px-4 py-8 max-md:py-6 max-sm:py-4 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-4 space-y-6">
                    <ProfileHeader
                        name={profile.name || ''}
                        title={profile.title}
                        city={profile.city}
                        image={profile.image}
                        rating={profile.averageRating}
                        totalReviews={profile.totalReviews}
                    />

                    <SocialLinks
                        links={profile.social_links}
                        onUpdate={updateProfile}
                    />

                    <div className="flex gap-4">
                        <StatsCard
                            icon={FiClock}
                            value={profile.totalHours || 0}
                            label={t('hours')}
                            color="text-[#3B82F6]"
                            bgColor="bg-[#3B82F6]/10"
                        />
                        <StatsCard
                            icon={FiCheckCircle}
                            value={profile.totalSessions || 0} // Using totalSessions instead of sessions count if relevant
                            label={t('sessions')}
                            color="text-[#10B981]"
                            bgColor="bg-[#10B981]/10"
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-8 space-y-6">
                    {/* About Me */}
                    <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1)">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-(--text-1)">{t('aboutMe')}</h2>
                            <Link href="/profile/edit" className="text-[#3B82F6] hover:underline">
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </div>
                        <p className="text-(--text-2) leading-relaxed whitespace-pre-line">
                            {profile.bio || 'No bio provided yet.'}
                        </p>
                    </div>

                    {profile.languages && profile.languages.length > 0 && (
                        <LanguagesSection languages={profile.languages} />
                    )}

                    <SkillsSection
                        skillsTeach={profile.skills}
                        skillsLearn={profile.wanted_skills}
                        onAddSkill={addSkill}
                        onRemoveSkill={removeSkill}
                        onAddWantedSkill={addWantedSkill}
                        onRemoveWantedSkill={removeWantedSkill}
                    />


                    <ReviewsChart
                        reviews={profile.reviews}
                        averageRating={profile.averageRating}
                        totalReviews={profile.totalReviews}
                    />

                    <AvailabilitySchedule availability={profile.availability} />
                </div>
            </div>
        </div>
    )
}
