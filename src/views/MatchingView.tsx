'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { mockUsers } from "@/constants/mockUsers"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components"
import { FiX, FiHeart, FiMapPin } from "react-icons/fi"

export const MatchingView = () => {
    const t = useTranslations('matching')
    const [currentIndex, setCurrentIndex] = useState(0)
    
    const availableUsers = mockUsers.filter((_, index) => index !== 0) // Exclude current user

    const currentProfile = availableUsers[currentIndex]

    const handleSwipe = (direction: 'left' | 'right') => {
        if (currentIndex < availableUsers.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    if (!currentProfile) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[80vh]">
                <Card className="text-center py-12">
                    <h2 className="text-2xl font-bold text-(--text-1) mb-4">{t('noMoreUsers')}</h2>
                    <Button primary onClick={() => setCurrentIndex(0)}>
                        {t('startMatching')}
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-(--text-1) mb-8">{t('matching')}</h1>

            <div className="max-w-2xl mx-auto">
                <Card className="overflow-hidden">
                    {/* Profile Card */}
                    <div className="text-center">
                        <div className="bg-(--bg-1) p-8 mb-6">
                            <Avatar 
                                src={currentProfile.image} 
                                alt={currentProfile.name} 
                                size="xl"
                                className="mx-auto mb-4"
                            />
                            <h2 className="text-2xl font-bold text-(--text-1) mb-2">
                                {currentProfile.name}
                            </h2>
                            <div className="flex items-center justify-center gap-2 text-(--text-2)">
                                <FiMapPin className="w-4 h-4" />
                                <span>{currentProfile.city}</span>
                            </div>
                        </div>

                        <div className="px-8 pb-8">
                            <p className="text-(--text-2) mb-6">{currentProfile.bio}</p>

                            {/* Skills they teach */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-(--text-1) mb-3">{t('teaches')}</h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {currentProfile.skills.map((skill) => (
                                        <Badge key={skill.id} variant="success">
                                            {skill.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Skills they want to learn */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-(--text-1) mb-3">{t('wantsToLearn')}</h3>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {currentProfile.wanted_skills.map((skill) => (
                                        <Badge key={skill.id} variant="warning">
                                            {skill.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => handleSwipe('left')}
                                    className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    <FiX className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={() => handleSwipe('right')}
                                    className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    <FiHeart className="w-8 h-8" />
                                </button>
                            </div>

                            <div className="mt-6 text-(--text-2) text-sm">
                                <p>{t('swipeLeft')} | {t('swipeRight')}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Progress */}
                <div className="mt-6 text-center text-(--text-2)">
                    {currentIndex + 1} / {availableUsers.length}
                </div>
            </div>
        </div>
    )
}
