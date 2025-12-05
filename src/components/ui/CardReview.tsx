import { CardReviewProps } from "@/types"
import { Quote, Star } from "lucide-react"
import Image from "next/image"

export const CardReview = ({ review, username, occupation }: CardReviewProps) => {
    // Generar avatar dinámico usando DiceBear API con expresión seria/neutral
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username || 'default')}&backgroundColor=b6e3f4,c0aede,d1d4f9&mouth=twinkle&eyebrows=default&eyes=default`

    return (
        <div className="flex flex-col w-70 max-md:w-60 max-sm:w-50 items-center justify-center gap-4 max-sm:gap-3 relative bg-(--bg-2) rounded-lg border border-(--border-1) pt-15 max-sm:pt-12 pb-6 max-sm:pb-4 hover:scale-101 transition-all duration-300 cursor-pointer">
            <div className="absolute -top-12 max-sm:-top-10 h-25 w-25 max-sm:h-20 max-sm:w-20 bg-(--bg-1) border-b border-(--border-1) flex items-center justify-center rounded-full overflow-hidden">
                <Image
                    src={avatarUrl}
                    alt={`Avatar de ${username}`}
                    width={100}
                    height={100}
                    className="w-20 h-20 max-sm:w-16 max-sm:h-16 object-cover rounded-full border border-(--border-1)"
                    unoptimized // DiceBear SVGs no necesitan optimización
                />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 max-sm:gap-1 px-8 max-md:px-6 max-sm:px-4">
                <div className="flex gap-1">
                    <Star className="text-(--button-1) h-5 w-5 max-sm:h-4 max-sm:w-4" />
                    <Star className="text-(--button-1) h-5 w-5 max-sm:h-4 max-sm:w-4" />
                    <Star className="text-(--button-1) h-5 w-5 max-sm:h-4 max-sm:w-4" />
                    <Star className="text-(--button-1) h-5 w-5 max-sm:h-4 max-sm:w-4" />
                    <Star className="text-(--button-1) h-5 w-5 max-sm:h-4 max-sm:w-4" />
                </div>
                <h4 className="text-lg max-md:text-base max-sm:text-sm font-bold text-(--text-1)">{username}</h4>
                <p className="text-sm max-sm:text-xs font-light text-(--text-2)">{occupation}</p>
                <Quote className="text-(--button-1) h-7 w-7 max-sm:h-5 max-sm:w-5" />
                <p className="text-sm max-sm:text-xs font-light text-(--text-2) text-center">{review}</p>
            </div>
        </div>
    )
}
