'use client'
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useProfile } from "@/hooks/useProfile"
import { useSkills } from "@/hooks/useSkills"
import { useLanguages } from "@/hooks/useLanguages"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components"
import { FiLoader, FiArrowLeft } from "react-icons/fi"
import Link from "next/link"
import { EditAboutMeSection } from "@/components/features/profile/edit/EditAboutMeSection"
import { EditSkillsSection } from "@/components/features/profile/edit/EditSkillsSection"
import { EditLanguagesSection } from "@/components/features/profile/edit/EditLanguagesSection"

export const EditProfileView = () => {
    const t = useTranslations('profile')
    const router = useRouter()
    const { profile, isLoading: isLoadingProfile, updateProfile } = useProfile()
    const {
        skills,
        wantedSkills,
        isLoading: isLoadingSkills,
        addSkill,
        deleteSkill,
        addWantedSkill,
        deleteWantedSkill
    } = useSkills()
    const {
        languages,
        isLoading: isLoadingLanguages,
        addLanguage,
        deleteLanguage
    } = useLanguages()

    // Función para actualizar solo About Me
    const handleUpdateAboutMe = async (data: any) => {
        try {
            const response = await fetch('/api/users/profile/about-me', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error('Failed to update profile')
            }

            // Refrescar profile completo
            window.location.reload()

            return { success: true }
        } catch (error) {
            console.error('Error updating profile:', error)
            return { success: false }
        }
    }

    if (isLoadingProfile || isLoadingSkills || isLoadingLanguages) {
        return (
            <div className="p-8 max-md:p-6 max-sm:p-4 max-w-7xl mx-auto">
                <div className="flex items-center justify-center min-h-100">
                    <FiLoader className="w-8 h-8 animate-spin text-(--button-1)" />
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="p-8 max-md:p-6 max-sm:p-4 max-w-7xl mx-auto">
                <Card className="p-6 text-center">
                    <p className="text-red-500">Error al cargar el perfil</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="px-30 max-2xl:px-14 max-lg:px-10 max-md:px-6 max-sm:px-4 py-8 max-md:py-6 max-sm:py-4 mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-(--text-1)">Edit Profile</h1>
                    <p className="text-(--text-2)">Update your personal details, skills, and languages.</p>
                </div>
                <Link href="/profile">
                    <Button secondary className="flex items-center gap-2">
                        <FiArrowLeft />
                        {t('back')}
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                {/* About Me Section */}
                <EditAboutMeSection
                    profile={profile}
                    onUpdate={handleUpdateAboutMe}
                />

                {/* Languages Section */}
                <EditLanguagesSection
                    languages={languages}
                    onAddLanguage={addLanguage}
                    onDeleteLanguage={deleteLanguage}
                />

                {/* Skills & Expertise Section */}
                <EditSkillsSection
                    skills={skills}
                    wantedSkills={wantedSkills}
                    onAddSkill={addSkill}
                    onDeleteSkill={deleteSkill}
                    onAddWantedSkill={addWantedSkill}
                    onDeleteWantedSkill={deleteWantedSkill}
                />
            </div>
        </div>
    )
}
