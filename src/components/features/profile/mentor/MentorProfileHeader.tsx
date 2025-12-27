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
        <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1)">
            <div className="flex gap-6 items-start">
                {/* Left: Avatar */}
                <div className="relative shrink-0">
                    <Avatar src={image || ''} alt={name} size="xl" className="w-32 h-32" />
                    {isOnline && (
                        <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-(--bg-2)" />
                    )}
                </div>

                <div className="w-full">
                    {/* Center: Info */}
                    <div className="flex-1">
                        {/* Name and Title */}
                        <h1 className="text-2xl font-bold text-(--text-1) mb-1">{name}</h1>
                        <p className="text-(--button-1) mb-3 font-medium">{title || 'Mentor'}</p>


                        <div className="flex gap-4">
                            {/* Location */}

                            {city && (
                                <div className="flex items-center gap-2 text-(--text-2) text-sm mb-3">
                                    <MapPin size={16} />
                                    <span>{city}</span>
                                </div>
                            )}

                            {/* Rating */}
                            <div className="flex gap-2 w-fit">
                                <Dot className="text-(--text-1)" />
                                <span className="font-bold text-(--text-1)">{rating.toFixed(1)}</span>

                                <Star
                                    className="w-5 h-5 text-(--button-1)"
                                    fill="currentColor"
                                    strokeWidth={0}
                                />

                                <span className="text-(--text-2) text-sm">({totalReviews})</span>
                            </div>

                            {/* Languages */}
                            <div className="flex items-center gap-2 mb-3">
                                <Dot className="text-(--text-1)" />
                                <Languages className="text-(--text-2) h-5 w-5" />
                                <span className="text-(--text-2) text-sm">{languages.join(', ')}</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        {socialLinks && (socialLinks.linkedin || socialLinks.github || socialLinks.website) && (
                            <div className="flex items-center gap-3">
                                {socialLinks.linkedin && (
                                    <a
                                        href={socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-(--text-2) hover:text-[#0A66C2] transition-colors p-2 hover:bg-(--bg-1) rounded-lg"
                                        title="LinkedIn"
                                    >
                                        <Linkedin size={20} />
                                    </a>
                                )}
                                {socialLinks.github && (
                                    <a
                                        href={socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-(--text-2) hover:text-(--text-1) transition-colors p-2 hover:bg-(--bg-1) rounded-lg"
                                        title="GitHub"
                                    >
                                        <Github size={20} />
                                    </a>
                                )}
                                {socialLinks.website && (
                                    <a
                                        href={socialLinks.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-(--text-2) hover:text-[#3B82F6] transition-colors p-2 hover:bg-(--bg-1) rounded-lg"
                                        title="Website"
                                    >
                                        <Globe size={20} />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex gap-4 w-5/10">
                        <Button className="flex-1 bg-(--button-1) text-(--button-1-text) border-none py-3 font-semibold flex items-center justify-center gap-2">
                            <Calendar size={18} />
                            Reservar Sesión
                        </Button>
                        <Button className="flex-1 bg-(--bg-1) hover:bg-(--border-1) text-(--text-1) border border-(--border-1) py-3 font-semibold flex items-center justify-center gap-2">
                            <MessageSquare size={18} />
                            Mensaje
                        </Button>
                        <button className="text-(--text-2) hover:text-(--text-1) transition-colors p-3 hover:bg-(--bg-1) rounded-lg border border-(--border-1)">
                            <Share2 size={20} />
                        </button>
                        <button className="text-(--text-2) hover:text-(--text-1) transition-colors p-3 hover:bg-(--bg-1) rounded-lg border border-(--border-1)">
                            <Bookmark size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
