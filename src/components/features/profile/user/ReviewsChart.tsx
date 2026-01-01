import { useTranslations } from "next-intl"
import { Rating } from "@/components/ui/Rating"
import type { ReviewsChartProps, Review } from '@/types'

export const ReviewsChart = ({ reviews, averageRating, totalReviews }: ReviewsChartProps) => {
    const t = useTranslations('profile')

    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(r => {
        const rounded = Math.round(r.rating)
        if (counts[rounded] !== undefined) counts[rounded]++
    })

    return (
        <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1) mb-6">
            <h2 className="text-xl font-bold text-(--text-1) mb-6">{t('reviewsBreakdown')}</h2>

            <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Summary */}
                <div className="flex flex-col items-center justify-center min-w-37.5">
                    <span className="text-6xl font-bold text-(--text-1) leading-none">{averageRating.toFixed(1)}</span>
                    <div className="my-2">
                        <Rating value={averageRating} readonly size="md" />
                    </div>
                    <span className="text-(--text-2) text-sm">
                        {t('basedOnReviews', { count: totalReviews })}
                    </span>
                </div>

                {/* Bars */}
                <div className="flex-1 w-full space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = counts[star] || 0
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

                        return (
                            <div key={star} className="flex items-center gap-3 text-sm">
                                <span className="font-medium text-(--text-2) w-3 text-right">{star}</span>
                                <div className="flex-1 h-2 bg-(--bg-1) rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-(--button-1) rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="font-medium text-(--text-2) w-8 text-right">{Math.round(percentage)}%</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
