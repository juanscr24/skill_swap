import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components"
import Link from "next/link"
import { FiMapPin, FiEdit, FiShare2 } from "react-icons/fi"
import { useTranslations } from "next-intl"

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
            <div className="relative w-full flex justify-end mb-[-20px] z-10">
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
                        <svg
                            key={star}
                            className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-[#3B82F6]' : 'text-gray-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
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
