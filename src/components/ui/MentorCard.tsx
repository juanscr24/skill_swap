import Link from "next/link"
import { Avatar } from "./Avatar"
import { Rating } from "./Rating"
import { Button } from "./Button"
import { FiMapPin, FiCheck } from "react-icons/fi"
import { useTranslations } from "next-intl"
import { MessageSquare } from "lucide-react"

interface MentorCardProps {
    id: string
    name: string
    image?: string | null
    city?: string | null
    bio?: string | null
    averageRating: number
    totalReviews: number
    skills: Array<{ id: string; name: string }>
    isAvailable?: boolean
}

export const MentorCard = ({
    id,
    name,
    image,
    city,
    bio,
    averageRating,
    totalReviews,
    skills,
    isAvailable = true
}: MentorCardProps) => {
    const t = useTranslations('mentors')

    return (
        <div className="bg-(--bg-2) border border-(--border-1) rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="bg-(--border-1) rounded-t-2xl">
                {/* Available Badge */}
                {isAvailable && (
                    <div className="flex items-center justify-end gap-2 mb-2 mr-2 pt-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-(--bg-1) rounded-full border border-(--border-1)">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                {t('available')}
                            </span>
                        </div>
                    </div>
                )}

                {/* Avatar with Verified Badge */}
                <div className="relative flex justify-center mb-16 h-14">
                    <Avatar
                        src={image || ''}
                        alt={name}
                        size="xl"
                        className="ring-4 ring-(--bg-1) absolute top-2"
                    />
                    <div className="absolute -bottom-13 right-4/12 bg-(--button-1) rounded-full p-1.5 border-2 border-(--bg-1)">
                        <FiCheck className="w-3 h-3 text-(--button-1-text)" />
                    </div>
                </div>
            </div>
            <div className="px-3 pb-3">
                {/* Name */}
                <h3 className="text-xl font-bold text-(--text-1) text-center mb-2">
                    {name}
                </h3>

                {/* Location */}
                <div className="flex items-center justify-center gap-1 text-(--text-2) mb-4">
                    <FiMapPin className="w-4 h-4" />
                    <span className="text-sm">{city || 'Sin ubicación'}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-2 mb-4 bg-(--bg-1) py-1.5 rounded-full border border-(--border-1)">
                    <Rating value={averageRating} readonly size="sm" />
                    <span className="text-sm font-semibold text-(--text-1)">
                        {averageRating.toFixed(1)}
                    </span>
                    <span className="text-(--text-2) text-xs">
                        ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                </div>

                {/* Bio */}
                <p className="text-(--text-2) text-sm text-center line-clamp-3 min-h-[3.6rem]">
                    {bio || 'Professional mentoring team specializing in bug bounty hunting...'}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    {skills.slice(0, 2).map((skill) => (
                        <span
                            key={skill.id}
                            className="px-3 py-1.5 bg-(--bg-1) text-(--text-2) rounded-lg text-xs font-medium border border-(--border-1)"
                        >
                            {skill.name}
                        </span>
                    ))}
                </div>

                {/* View Profile Button */}
                <div className="flex gap-2 items-center">
                    <div className="bg-(--bg-1) cursor-pointer flex items-center justify-center p-2 rounded-lg hover:scale-102 transition-all duration-200 border border-(--border-1)">
                        <MessageSquare className="text-(--text-2)" />
                    </div>
                    <Link href={`/profile/${id}`} className="w-full">
                        <Button
                            primary
                            className="w-full bg-(--button-1) border border-(--border-1) hover:bg-(--button-1)/90 text-(--button-1-text) font-semibold rounded-lg transition-all duration-200"
                        >
                            {t('viewProfile')} →
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
