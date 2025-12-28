'use client'
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Badge } from "@/components/ui/Badge"
import { FiMapPin, FiX, FiCheck, FiStar } from "react-icons/fi"
import { Dot, Languages } from "lucide-react"

interface MatchCardProps {
    user: {
        id: string
        name: string
        image?: string
        city?: string
        title?: string
        bio?: string
        rating?: number
        teachingSkills: string[]
        learningSkills: string[]
        matchPercentage?: number
        yearsExperience?: number
    }
    onAccept: () => void
    onReject: () => void
}

export const MatchCard = ({ user, onAccept, onReject }: MatchCardProps) => {
    const t = useTranslations('matching')

    return (
        <div className="h-[80dvh] max-lg:h-[85dvh] max-sm:h-[90dvh] w-[90vw] max-w-4xl mx-auto flex flex-col lg:flex-row gap-0 overflow-hidden rounded-2xl shadow-2xl bg-(--bg-2)">
            {/* Left Section - Profile Image */}
            <div className="relative w-full lg:w-[55%] h-[40dvh] lg:h-full overflow-hidden shrink-0">
                {/* Background Image */}
                {user.image ? (
                    <Image
                        src={user.image}
                        alt={user.name}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-(--bg-1) to-(--bg-2) flex items-center justify-center">
                        <span className="text-6xl text-(--text-2) font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                    {/* Top Badge */}
                    {user.matchPercentage && user.matchPercentage >= 90 && (
                        <div className="absolute top-4 right-4">
                            <Badge variant="default" className="bg-(--button-1) text-(--button-1-text) font-semibold text-sm px-4 py-1.5">
                                TOP MATCH
                            </Badge>
                        </div>
                    )}

                    {user.matchPercentage && (
                        <div className="inline-block bg-(--button-1) text-(--button-1-text) px-3 py-1 rounded-full text-sm font-bold shadow-xl mb-2">
                            {user.matchPercentage}% Match
                        </div>
                    )}


                    {/* Name */}
                    <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        {user.name}
                    </h2>

                    {/* Header with Title */}
                    <h3 className="italic text-sm mb-2 text-(--text-1)">
                        {user.title || t('noTitle')}
                    </h3>
                </div>
            </div>

            {/* Right Section - Details */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Content Area - Fixed sections without scroll */}
                <div className="flex-1 flex flex-col p-4 lg:p-5 space-y-4 overflow-hidden">
                    {/* Location */}
                    <div className="flex flex-col gap-4 mb-4 max-lg:mb-0">
                        <div className="flex items-center gap-2 text-(--text-1)">
                            <FiMapPin className="h-6 w-6 max-lg:h-5 max-lg:w-5 max-md:h-4 max-md:w-4" />
                            <span className="text-4xl max-lg:text-3xl max-md:tex-2xl max-sm:text-xl">{user.city || (t('unknown'))}</span>
                        </div>
                        {/* Languages */}
                        <div className="flex gap-2 text-(--text-1)">
                            <Languages />
                            <h3>Español / English</h3>
                        </div>
                    </div>
                    {/* About Me - with invisible scroll */}
                    {user.bio && (
                        <div className="min-h-0 flex flex-col">
                            <div className="overflow-y-auto flex-1 pr-2 max-h-30 max-lg:max-h-40 lg:max-h-none max-lg:mt-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                <style jsx>{`
                                            div::-webkit-scrollbar {
                                                display: none;
                                            }
                                        `}</style>
                                <p className="text-(--text-2) leading-relaxed text-xs lg:text-sm">
                                    {user.bio}
                                </p>
                            </div>
                        </div>
                    )}
                    {/* What I Want to Learn */}
                    {user.learningSkills.length > 0 && (
                        <div className="shrink-0">
                            <h4 className="text-base font-semibold text-(--text-1) mb-4 flex items-center">
                                <Dot />
                                {t('wantsToLearn')}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {user.learningSkills.map((skill, index) => (
                                    <Badge key={index} variant="info" className="text-sm!">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* What I Teach */}
                    {user.teachingSkills.length > 0 && (
                        <div className="shrink-0">
                            <h4 className="text-base font-semibold text-(--text-1) mb-4 flex items-center">
                                <Dot />
                                {t('teaches')}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {user.teachingSkills.map((skill, index) => (
                                    <Badge key={index} variant="warning" className="text-sm!">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Rating */}
                    {user.rating !== undefined && (
                        <div className="shrink-0">
                            <h4 className="text-base font-semibold text-(--text-1) mb-2 flex items-center gap-2">
                                <span className="w-1 h-5 bg-linear-to-b from-(--button-1) to-(--button-1)/50 rounded-full"></span>
                                {t('rating')}
                            </h4>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, index) => (
                                        <FiStar
                                            key={index}
                                            className={`w-5 h-5 ${index < Math.floor(user.rating!)
                                                ? 'fill-(--button-1) text-(--button-1)'
                                                : 'text-(--text-2)'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-(--text-1) font-semibold text-base">
                                    {user.rating.toFixed(1)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="p-3 lg:p-4 border-t border-(--border-1) bg-(--bg-1) shrink-0">
                    <div className="flex gap-3 justify-center items-center">
                        <button
                            onClick={onReject}
                            className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-(--bg-2) hover:bg-(--border-1) border-2 border-(--border-1) flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg group"
                        >
                            <FiX className="w-6 h-6 lg:w-7 lg:h-7 text-(--text-2) group-hover:text-red-500 transition-colors" />
                        </button>
                        <button
                            onClick={onAccept}
                            className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-(--button-1) hover:brightness-110 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl shadow-(--button-1)/50"
                        >
                            <FiCheck className="w-8 h-8 lg:w-9 lg:h-9 text-(--button-1-text)" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
