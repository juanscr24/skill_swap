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
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <Card className="mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <Avatar src={currentUser.image} alt={currentUser.name} size="xl" />
                    
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h1 className="text-3xl font-bold text-(--text-1)">{currentUser.name}</h1>
                                <div className="flex items-center gap-2 text-(--text-2) mt-1">
                                    <FiMapPin className="w-4 h-4" />
                                    <span>{currentUser.city}</span>
                                </div>
                            </div>
                            <Link href="/profile/edit">
                                <Button secondary className="flex items-center gap-2">
                                    <FiEdit className="w-4 h-4" />
                                    {t('editProfile')}
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="flex items-center gap-4 my-4">
                            <div className="flex items-center gap-2">
                                <Rating value={currentUser.rating} readonly size="sm" />
                                <span className="font-semibold text-(--text-1)">{currentUser.rating}</span>
                                <span className="text-(--text-2) text-sm">({currentUser.totalReviews} {t('reviews')})</span>
                            </div>
                        </div>
                        
                        <p className="text-(--text-2)">{currentUser.bio}</p>
                    </div>
                </div>
            </Card>

            {/* Skills I Teach */}
            <Card className="mb-6">
                <h2 className="text-2xl font-bold text-(--text-1) mb-4">{t('skillsTeach')}</h2>
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
                <h2 className="text-2xl font-bold text-(--text-1) mb-4">{t('skillsLearn')}</h2>
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
