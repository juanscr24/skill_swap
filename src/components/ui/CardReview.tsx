import { CardReviewProps } from "@/types"
import { Quote, Star } from "lucide-react"

export const CardReview = ({ review, icon, username, skill }: CardReviewProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 relative bg-(--bg-2) rounded-lg border border-(--border-1) pt-15 pb-6 hover:scale-101 transition-all duration-300 cursor-pointer">
            <div className="absolute -top-13 h-25 w-25 border-b border-(--border-1) bg-(--bg-1) flex items-center justify-center rounded-full">
                {icon}
            </div>
            <div className="flex flex-col items-center justify-center gap-2 px-8">
                <div className="flex gap-1">
                    <Star className="text-(--button-1) h-5 w-5" />
                    <Star className="text-(--button-1) h-5 w-5" />
                    <Star className="text-(--button-1) h-5 w-5" />
                    <Star className="text-(--button-1) h-5 w-5" />
                    <Star className="text-(--button-1) h-5 w-5" />
                </div>
                <h4 className="text-lg font-bold text-(--text-1)">{username}</h4>
                <p className="text-sm font-light text-(--text-2)">{skill}</p>
                <Quote className="text-(--button-1) h-7 w-7" />
                <p className="text-sm font-light text-(--text-2) text-center">{review}</p>
            </div>
        </div>
    )
}
