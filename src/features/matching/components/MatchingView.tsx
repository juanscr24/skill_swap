'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { MatchCard } from "./MatchCard"
import { Card, Button, LoadingSpinner } from "@/shared/components"
import { useMatches } from "../hooks/useMatches"
import { useProfile } from "@/features/profile/hooks/useProfile"
import Link from "next/link"

export const MatchingView = () => {
    const t = useTranslations('matching')
    const { matches, isLoading, sendMatchRequest } = useMatches()
    const { profile, isLoading: isLoadingProfile } = useProfile()
    const [currentIndex, setCurrentIndex] = useState(0)

    const currentProfile = matches[currentIndex]

    const handleSwipe = async (direction: 'left' | 'right') => {
        if (direction === 'right' && currentProfile) {
            // Enviar solicitud de match con la primera habilidad del perfil
            const firstSkill = currentProfile.skills.find(s => s.level !== 'wanted')
            if (firstSkill) {
                try {
                    const result = await sendMatchRequest({
                        receiverId: currentProfile.id,
                        skill: firstSkill.name
                    })
                    if (result.success) {
                        // Mostrar mensaje de éxito
                        alert(t('matchRequestSent'))
                    }
                } catch (error) {
                    // Si ya existe una solicitud, simplemente continuar sin mostrar error
                    console.log('Solicitud ya existe o error:', error)
                }
            }
        }

        if (currentIndex < matches.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    if (isLoading || isLoadingProfile) {
        return (
            <div className="p-8 max-md:p-6 max-sm:p-4 flex items-center justify-center min-h-[80vh]">
                <LoadingSpinner />
            </div>
        )
    }

    // Verificar si el usuario tiene skills configuradas
    const hasTeachingSkills = profile?.skills && profile.skills.length > 0
    const hasLearningSkills = profile?.wanted_skills && profile.wanted_skills.length > 0
    const hasIncompleteProfile = !hasTeachingSkills || !hasLearningSkills

    // Mostrar mensaje de perfil incompleto
    if (hasIncompleteProfile) {
        return (
            <div className="h-[calc(100dvh-4rem)] bg-(--bg-1) flex items-center justify-center px-6">
                <div className="w-full max-w-2xl">
                    <Card className="relative overflow-hidden">
                        {/* Decorative gradient background */}
                        <div className="absolute inset-0 bg-linear-to-br from-(--button-1)/10 via-transparent to-(--button-1)/5 pointer-events-none"></div>

                        {/* Content */}
                        <div className="relative text-center py-16 max-md:py-12 max-sm:py-8 px-8 max-sm:px-4">
                            {/* Icon */}
                            <div className="mx-auto w-20 h-20 max-sm:w-16 max-sm:h-16 mb-6 max-sm:mb-4 rounded-full bg-(--button-1)/10 flex items-center justify-center">
                                <svg
                                    className="w-10 h-10 max-sm:w-8 max-sm:h-8 text-(--button-1)"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-3 max-sm:mb-2">
                                {t('incompleteProfile')}
                            </h2>

                            {/* Description */}
                            <p className="text-base max-sm:text-sm text-(--text-2) mb-8 max-sm:mb-6 max-w-md mx-auto">
                                {t('incompleteProfileDescription')}
                            </p>

                            {/* Button */}
                            <Link href="/profile">
                                <Button
                                    primary
                                    className="px-8 py-3 text-base max-sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    {t('goToProfile')}
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    if (!currentProfile || matches.length === 0) {
        return (
            <div className="h-[calc(100dvh-4rem)] bg-(--bg-1) flex items-center justify-center px-6">
                <div className="w-full max-w-2xl">
                    <Card className="relative overflow-hidden">
                        {/* Decorative gradient background */}
                        <div className="absolute inset-0 bg-linear-to-br from-(--button-1)/10 via-transparent to-(--button-1)/5 pointer-events-none"></div>

                        {/* Content */}
                        <div className="relative text-center py-16 max-md:py-12 max-sm:py-8 px-8 max-sm:px-4">
                            {/* Icon */}
                            <div className="mx-auto w-20 h-20 max-sm:w-16 max-sm:h-16 mb-6 max-sm:mb-4 rounded-full bg-(--button-1)/10 flex items-center justify-center">
                                <svg
                                    className="w-10 h-10 max-sm:w-8 max-sm:h-8 text-(--button-1)"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-3 max-sm:mb-2">
                                {t('noMoreUsers')}
                            </h2>

                            {/* Description */}
                            <p className="text-base max-sm:text-sm text-(--text-2) mb-8 max-sm:mb-6 max-w-md mx-auto">
                                Has visto todos los perfiles disponibles por ahora. Vuelve más tarde para descubrir nuevos mentores.
                            </p>

                            {/* Button */}
                            <Button
                                primary
                                onClick={() => setCurrentIndex(0)}
                                className="px-8 py-3 text-base max-sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <Link href="/mentors">
                                    {t('seeMentors')}
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    // Separar habilidades que enseña (no wanted) de las que quiere aprender (wanted_skills)
    const teachingSkills = currentProfile.skills.map(s => s.name)
    const learningSkills = currentProfile.wantedSkills.map(s => s.name)
    const languages = currentProfile.languages?.map(l => l.name) || []

    // Preparar datos del usuario para el MatchCard
    const userData = {
        id: currentProfile.id,
        name: currentProfile.name || 'Unknown User',
        image: currentProfile.image || undefined,
        city: currentProfile.city || undefined,
        title: currentProfile.title || undefined,
        bio: currentProfile.bio || undefined,
        rating: undefined,
        teachingSkills,
        learningSkills,
        matchPercentage: undefined,
        yearsExperience: undefined,
        languages,
    }

    return (
        <div className="h-[calc(100dvh-4rem)] bg-(--bg-1) flex items-center justify-center px-6">
            <MatchCard
                user={userData}
                onAccept={() => handleSwipe('right')}
                onReject={() => handleSwipe('left')}
            />
        </div>
    )
}
