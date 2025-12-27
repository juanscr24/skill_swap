import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components"
import Link from "next/link"
import { FiMapPin, FiEdit, FiShare2 } from "react-icons/fi"
import { useTranslations } from "next-intl"
import { Star } from "lucide-react"

interface ProfileHeaderProps {
    name: string
    title: string | null
    city: string | null
    image: string | null
    rating: number
    totalReviews: number
}

export const ProfileHeader = ({
    name,
    title,
    city,
    image,
    rating,
    totalReviews,
}: ProfileHeaderProps) => {
    const t = useTranslations('profile')

    return (
        <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1) text-center flex flex-col items-center">
            <div className="relative w-full flex justify-end -mb-5 z-10">
                <button className="text-(--text-2) hover:text-(--text-1) transition-colors">
                    <FiShare2 size={20} />
                </button>
            </div>

            <div className="mb-4">
                <Avatar src={image || ''} alt={name} size="xl" className="w-32 h-32" />
            </div>

            <h1 className="text-2xl font-bold text-(--text-1) mb-1">{name}</h1>
            <p className="text-(--text-2) mb-4">{title || 'Member'}</p>

            {city && (
                <div className="flex items-center gap-2 text-(--text-2) text-sm mb-4">
                    <FiMapPin />
                    <span>{city}</span>
                </div>
            )}
            
            <div className="flex items-center gap-2 mb-6 bg-(--bg-1) px-4 py-2 rounded-full">
                <span className="font-bold text-(--text-1)">{rating.toFixed(1)}</span>

                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-[#3B82F6]' : 'text-gray-600'
                                }`}
                            fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
                            strokeWidth={star <= Math.round(rating) ? 0 : 2}
                        />
                    ))}
                </div>
                <span className="text-(--text-2) text-sm">({totalReviews})</span>
            </div>


            <Link href="/profile/edit" className="w-full">
                <Button className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white border-none py-3">
                    <FiEdit />
                    {t('editProfile')}
                </Button>
            </Link>
        </div>
    )
}
