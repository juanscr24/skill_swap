'use client'
import { useTranslations } from "next-intl"
import { currentUser } from "@/constants/mockUsers"
import { Avatar } from "@/components/ui/Avatar"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components"
import { Badge } from "@/components/ui/Badge"
import { Rating } from "@/components/ui/Rating"
import Link from "next/link"
import { FiMapPin, FiEdit } from "react-icons/fi"

export const ProfileView = () => {
    const t = useTranslations('profile')

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4 max-w-5xl mx-auto">
            {/* Header */}
            <Card className="mb-6 max-sm:mb-4">
                <div className="flex flex-col md:flex-row gap-6 max-md:gap-4">
                    <Avatar src={currentUser.image} alt={currentUser.name} size="xl" />
                    
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-3">
                            <div>
                                <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1)">{currentUser.name}</h1>
                                <div className="flex items-center gap-2 text-(--text-2) mt-1">
                                    <FiMapPin className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                                    <span className="max-sm:text-sm">{currentUser.city}</span>
                                </div>
                            </div>
                            <Link href="/profile/edit">
                                <Button secondary className="flex items-center gap-2 max-sm:text-sm">
                                    <FiEdit className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                                    {t('editProfile')}
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="flex items-center gap-4 max-sm:gap-3 my-4 max-sm:my-3 flex-wrap">
                            <div className="flex items-center gap-2 max-sm:gap-1">
                                <Rating value={currentUser.rating} readonly size="sm" />
                                <span className="font-semibold text-(--text-1) max-sm:text-sm">{currentUser.rating}</span>
                                <span className="text-(--text-2) text-sm max-sm:text-xs">({currentUser.totalReviews} {t('reviews')})</span>
                            </div>
                        </div>
                        
                        <p className="text-(--text-2) max-sm:text-sm">{currentUser.bio}</p>
                    </div>
                </div>
            </Card>

            {/* Skills I Teach */}
            <Card className="mb-6 max-sm:mb-4">
                <h2 className="text-2xl max-md:text-xl max-sm:text-lg font-bold text-(--text-1) mb-4 max-sm:mb-3">{t('skillsTeach')}</h2>
                <div className="flex flex-wrap gap-2">
                    {currentUser.skills.map((skill) => (
                        <Badge key={skill.id} variant="info">
                            {skill.name} - {skill.level}
                        </Badge>
                    ))}
                </div>
            </Card>

            {/* Skills I Want to Learn */}
            <Card>
                <h2 className="text-2xl max-md:text-xl max-sm:text-lg font-bold text-(--text-1) mb-4 max-sm:mb-3">{t('skillsLearn')}</h2>
                <div className="flex flex-wrap gap-2">
                    {currentUser.wanted_skills.map((skill) => (
                        <Badge key={skill.id} variant="warning">
                            {skill.name}
                        </Badge>
                    ))}
                </div>
            </Card>
        </div>
    )
}
