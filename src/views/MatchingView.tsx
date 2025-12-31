'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useMatches } from "@/hooks"
import { MatchCard } from "@/components/features/matching"
import { Card, Button, LoadingSpinner } from "@/components"

export const MatchingView = () => {
    const t = useTranslations('matching')
    const { matches, isLoading, sendMatchRequest } = useMatches()
    const [currentIndex, setCurrentIndex] = useState(0)

    const currentProfile = matches[currentIndex]

    const handleSwipe = async (direction: 'left' | 'right') => {
        if (direction === 'right' && currentProfile) {
            // Enviar solicitud de match con la primera habilidad del perfil
            const firstSkill = currentProfile.skills.find(s => s.level !== 'wanted')
            if (firstSkill) {
                try {
                    const result = await sendMatchRequest(currentProfile.id, firstSkill.name)
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

    if (isLoading) {
        return (
            <div className="p-8 max-md:p-6 max-sm:p-4 flex items-center justify-center min-h-[80vh]">
                <LoadingSpinner />
            </div>
        )
    }

    if (!currentProfile || matches.length === 0) {
        return (
            <div className="p-8 max-md:p-6 max-sm:p-4 flex items-center justify-center min-h-[80vh]">
                <Card className="text-center py-12 max-md:py-8 max-sm:py-6">
                    <h2 className="text-2xl max-md:text-xl max-sm:text-lg font-bold text-(--text-1) mb-4 max-sm:mb-3">{t('noMoreUsers')}</h2>
                    <Button primary onClick={() => setCurrentIndex(0)}>
                        {t('startMatching')}
                    </Button>
                </Card>
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
