import { Avatar } from "@/components/ui/Avatar"
import { useTranslations } from "next-intl"
import { FiChevronRight, FiChevronLeft } from "react-icons/fi"
import Link from "next/link"
import { useRef } from "react"
import type { MentorSimilarProfilesProps, SimilarMentor } from '@/types'

export const MentorSimilarProfiles = ({ mentorName, similarMentors }: MentorSimilarProfilesProps) => {
    const t = useTranslations('profile')
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    if (similarMentors.length === 0) {
        return null
    }

    return (
        <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1)">
            <h2 className="text-lg font-bold text-(--text-1) mb-4">
                {t('similarTo')} {mentorName}
            </h2>

            <div className="relative">
                {/* Scroll Buttons */}
                {similarMentors.length > 2 && (
                    <>
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-(--bg-1) hover:bg-(--border-1) text-(--text-1) rounded-full p-2 shadow-lg border border-(--border-1)"
                        >
                            <FiChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-(--bg-1) hover:bg-(--border-1) text-(--text-1) rounded-full p-2 shadow-lg border border-(--border-1)"
                        >
                            <FiChevronRight size={16} />
                        </button>
                    </>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {similarMentors.map((mentor) => (
                        <Link
                            key={mentor.id}
                            href={`/profile/${mentor.id}`}
                            className="shrink-0 w-40"
                        >
                            <div className="bg-(--bg-1) rounded-lg p-3 border border-(--border-1) hover:border-(--button-1) transition-all hover:shadow-md">
                                <Avatar
                                    src={mentor.image || ''}
                                    alt={mentor.name || 'Mentor'}
                                    size="lg"
                                    className="mx-auto mb-2"
                                />
                                <h3 className="text-(--text-1) font-semibold text-sm text-center truncate">
                                    {mentor.name || 'Unknown'}
                                </h3>
                                <p className="text-(--text-2) text-xs text-center truncate mb-2">
                                    {mentor.title || 'Mentor'}
                                </p>
                                <div className="flex items-center justify-center gap-1 text-xs">
                                    <span className="text-(--text-1)">⭐ {mentor.averageRating.toFixed(1)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
