'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useMatches } from "@/hooks"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components"
import { FiX, FiHeart, FiMapPin } from "react-icons/fi"

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
                const result = await sendMatchRequest(currentProfile.id, firstSkill.name)
                if (result.success) {
                    // Mostrar mensaje de éxito
                    alert(t('matchRequestSent'))
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
                <p className="text-(--text-2) max-sm:text-sm">{t('loading')}</p>
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

    // Separar habilidades que enseña (no wanted) de las que quiere aprender (wanted)
    const teachingSkills = currentProfile.skills.filter(s => s.level !== 'wanted')
    const learningSkills = currentProfile.skills.filter(s => s.level === 'wanted')

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4">
            <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-8 max-md:mb-6 max-sm:mb-4">{t('matching')}</h1>

            <div className="max-w-2xl mx-auto">
                <Card className="overflow-hidden">
                    {/* Profile Card */}
                    <div className="text-center">
                        <div className="bg-(--bg-1) p-8 max-md:p-6 max-sm:p-4 mb-6 max-sm:mb-4">
                            <Avatar 
                                src={currentProfile.image || ''} 
                                alt={currentProfile.name || 'User'} 
                                size="xl"
                                className="mx-auto mb-4 max-sm:mb-3"
                            />
                            <h2 className="text-2xl max-md:text-xl max-sm:text-lg font-bold text-(--text-1) mb-2 max-sm:mb-1">
                                {currentProfile.name || 'Unknown User'}
                            </h2>
                            <div className="flex items-center justify-center gap-2 max-sm:gap-1 text-(--text-2)">
                                <FiMapPin className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                                <span className="max-sm:text-sm">{currentProfile.city || 'Unknown'}</span>
                            </div>
                        </div>

                        <div className="px-8 max-md:px-6 max-sm:px-4 pb-8 max-md:pb-6 max-sm:pb-4">
                            <p className="text-(--text-2) mb-6 max-sm:mb-4 max-sm:text-sm">{currentProfile.bio || t('noBio')}</p>

                            {/* Skills they teach */}
                            {teachingSkills.length > 0 && (
                                <div className="mb-6 max-sm:mb-4">
                                    <h3 className="font-semibold text-(--text-1) mb-3 max-sm:mb-2 max-sm:text-sm">{t('teaches')}</h3>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {teachingSkills.map((skill) => (
                                            <Badge key={skill.id} variant="success">
                                                {skill.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skills they want to learn */}
                            {learningSkills.length > 0 && (
                                <div className="mb-8 max-md:mb-6 max-sm:mb-4">
                                    <h3 className="font-semibold text-(--text-1) mb-3 max-sm:mb-2 max-sm:text-sm">{t('wantsToLearn')}</h3>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {learningSkills.map((skill) => (
                                            <Badge key={skill.id} variant="warning">
                                                {skill.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 max-sm:gap-3 justify-center">
                                <button
                                    onClick={() => handleSwipe('left')}
                                    className="w-16 h-16 max-sm:w-12 max-sm:h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    <FiX className="w-8 h-8 max-sm:w-6 max-sm:h-6" />
                                </button>
                                <button
                                    onClick={() => handleSwipe('right')}
                                    className="w-16 h-16 max-sm:w-12 max-sm:h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    <FiHeart className="w-8 h-8 max-sm:w-6 max-sm:h-6" />
                                </button>
                            </div>

                            <div className="mt-6 max-sm:mt-4 text-(--text-2) text-sm max-sm:text-xs">
                                <p>{t('swipeLeft')} | {t('swipeRight')}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Progress */}
                <div className="mt-6 max-sm:mt-4 text-center text-(--text-2) max-sm:text-sm">
                    {currentIndex + 1} / {matches.length}
                </div>
            </div>
        </div>
    )
}
