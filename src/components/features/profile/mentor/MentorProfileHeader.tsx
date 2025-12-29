import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components"
import { MapPin, Share2, Bookmark, MessageSquare, Calendar, Linkedin, Github, Globe, Star, Dot, Languages } from "lucide-react"
import { useTranslations } from "next-intl"

interface MentorProfileHeaderProps {
    name: string
    title: string | null
    city: string | null
    image: string | null
    rating: number
    totalReviews: number
    languages?: string[]
    isOnline?: boolean
    socialLinks?: {
        linkedin?: string
        github?: string
        website?: string
    } | null
}

export const MentorProfileHeader = ({
    name,
    title,
    city,
    image,
    rating,
    totalReviews,
    languages = ['Español', 'English'],
    isOnline = true,
    socialLinks,
}: MentorProfileHeaderProps) => {
    const t = useTranslations('profile')

    return (
        <div className="bg-(--bg-2) rounded-2xl p-4 md:p-6 border border-(--border-1)">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                {/* Left: Avatar */}
                <div className="relative shrink-0 mx-auto md:mx-0">
                    <Avatar src={image || ''} alt={name} size="xl" className="w-24 h-24 md:w-32 md:h-32" />
                    {isOnline && (
                        <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-(--bg-2)" />
                    )}
                </div>

                <div className="w-full">
                    {/* Center: Info */}
                    <div className="flex-1">
                        {/* Name and Title */}
                        <h1 className="text-xl md:text-2xl font-bold text-(--text-1) mb-1 text-center md:text-left">{name}</h1>
                        <p className="text-(--text-2) text-lg mb-3 italic text-center md:text-left">{title || 'Mentor'}</p>


                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            {/* Location */}
                            {city && (
                                <div className="flex items-center gap-2 text-(--text-2) text-sm">
                                    <MapPin size={14} className="md:w-4 md:h-4" />
                                    <span className="text-xs md:text-sm">{city}</span>
                                </div>
                            )}

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <Dot className="text-(--text-1) hidden md:block" />
                                <span className="font-bold text-(--text-1)">{rating.toFixed(1)}</span>

                                <Star
                                    className="w-5 h-5 text-yellow-500"
                                    fill="currentColor"
                                    strokeWidth={0}
                                />

                                <span className="text-(--text-2) text-sm">({totalReviews})</span>
                            </div>

                            {/* Languages */}
                            <div className="flex items-center gap-1 md:gap-2">
                                <Dot className="text-(--text-1) hidden md:block" />
                                <Languages className="text-(--text-2) h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-(--text-2) text-xs md:text-sm">{languages.join(', ')}</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        {socialLinks && (socialLinks.linkedin || socialLinks.github || socialLinks.website) && (
                            <div className="flex items-center gap-2 md:gap-3 justify-center md:justify-start mb-4 md:mb-0">
                                {socialLinks.linkedin && (
                                    <a
                                        href={socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-(--text-2) hover:text-[#0A66C2] transition-colors p-1.5 md:p-2 hover:bg-(--bg-1) rounded-lg"
                                        title="LinkedIn"
                                    >
                                        <Linkedin size={18} className="md:w-5 md:h-5" />
                                    </a>
                                )}
                                {socialLinks.github && (
                                    <a
                                        href={socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-(--text-2) hover:text-(--text-1) transition-colors p-1.5 md:p-2 hover:bg-(--bg-1) rounded-lg"
                                        title="GitHub"
                                    >
                                        <Github size={18} className="md:w-5 md:h-5" />
                                    </a>
                                )}
                                {socialLinks.website && (
                                    <a
                                        href={socialLinks.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-(--text-2) hover:text-[#3B82F6] transition-colors p-1.5 md:p-2 hover:bg-(--bg-1) rounded-lg"
                                        title="Website"
                                    >
                                        <Globe size={18} className="md:w-5 md:h-5" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-5/10 max-2xl:w-7/10 max-xl:w-full mt-4">
                        <Button className="flex-1 bg-(--bg-1) hover:bg-(--border-1) text-(--text-1) border border-(--border-1) py-2.5 font-semibold flex items-center justify-center gap-2 text-sm md:text-base">
                            <MessageSquare size={16} className="md:w-4.5 md:h-4.5" />
                            Mensaje
                        </Button>
                        <button className="text-(--text-2) hover:text-(--text-1) transition-colors p-2.5 hover:bg-(--bg-1) rounded-lg border border-(--border-1) hidden sm:block">
                            <Share2 size={18} className="md:w-5 md:h-5" />
                        </button>
                        <button className="text-(--text-2) hover:text-(--text-1) transition-colors p-2.5 hover:bg-(--bg-1) rounded-lg border border-(--border-1) hidden sm:block">
                            <Bookmark size={18} className="md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
