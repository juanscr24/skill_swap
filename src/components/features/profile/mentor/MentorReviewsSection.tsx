import { useState } from "react"
import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components"
import { Rating } from "@/components/ui/Rating"
import { useTranslations } from "next-intl"
import { Star, Trash2, Edit3 } from "lucide-react"
import { useSession } from "next-auth/react"
import type { MentorReviewsSectionProps, Review } from '@/types'

export const MentorReviewsSection = ({
    reviews,
    mentorId,
    onAddReview,
    onDeleteReview,
    isSubmitting,
}: MentorReviewsSectionProps) => {
    const t = useTranslations('profile')
    const { data: session } = useSession()
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Find user's existing review
    const userReview = reviews.find(
        review => review.users_reviews_author_idTousers?.id === session?.user?.id
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (rating === 0) {
            setError(t('ratingRequired') || 'Rating is required')
            return
        }

        if (!comment.trim()) {
            setError('Comment is required')
            return
        }

        try {
            await onAddReview(rating, comment.trim())
            setShowReviewForm(false)
            setRating(0)
            setComment('')
        } catch (err: any) {
            setError(err.message || 'Error submitting review')
        }
    }

    const handleDelete = async (reviewId: string) => {
        if (window.confirm(t('deleteReviewConfirm'))) {
            try {
                await onDeleteReview(reviewId)
            } catch (err: any) {
                setError(err.message || 'Error deleting review')
            }
        }
    }

    const handleWriteReview = () => {
        if (userReview) {
            setError(t('mustDeleteToAdd'))
        } else {
            setShowReviewForm(true)
            setError(null)
        }
    }

    return (
        <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1)">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Edit3 className="text-(--button-1)" size={20} />
                    <h2 className="text-xl font-bold text-(--text-1)">{t('recentReviews')}</h2>
                </div>
                {reviews.length > 3 && (
                    <button className="text-(--button-1) text-sm font-medium hover:underline">
                        {t('viewAll')} ({reviews.length})
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Write Review Button */}
            {session && !showReviewForm && (
                <div className="mb-6">
                    <Button
                        onClick={handleWriteReview}
                        className="w-full bg-(--bg-1) hover:bg-(--border-1) text-(--text-1) border border-(--border-1) py-3 font-semibold flex items-center justify-center gap-2"
                    >
                        <Edit3 size={18} />
                        Escribir una reseña
                    </Button>
                </div>
            )}

            {/* Review Form */}
            {showReviewForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-(--bg-1) rounded-lg border border-(--border-1)">
                    <h3 className="text-lg font-semibold text-(--text-1) mb-4">{t('writeReview')}</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-(--text-1) mb-2">
                            {t('yourRating')}
                        </label>
                        <Rating value={rating} onChange={setRating} size="lg" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-(--text-1) mb-2">
                            {t('yourComment')}
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={t('writeReview')}
                            className="w-full p-3 bg-(--bg-2) border border-(--border-1) rounded-lg text-(--text-1) placeholder:text-(--text-2) focus:outline-none focus:ring-2 focus:ring-(--button-1) transition-all resize-none"
                            rows={4}
                            maxLength={500}
                        />
                        <p className="text-xs text-(--text-2) mt-1">
                            {comment.length}/500
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white border-none"
                        >
                            {isSubmitting ? t('loading') : t('submit')}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                setShowReviewForm(false)
                                setRating(0)
                                setComment('')
                                setError(null)
                            }}
                            disabled={isSubmitting}
                            className="bg-(--bg-2) hover:bg-(--border-1) text-(--text-1) border border-(--border-1)"
                        >
                            {t('cancel')}
                        </Button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length > 0 ? (
                    reviews.slice(0, 3).map((review) => {
                        const isOwnReview = review.users_reviews_author_idTousers?.id === session?.user?.id

                        return (
                            <div
                                key={review.id}
                                className="p-4 bg-(--bg-1) rounded-lg border border-(--border-1)"
                            >
                                <div className="flex items-start gap-3">
                                    <Avatar
                                        src={review.users_reviews_author_idTousers?.image || ''}
                                        alt={review.users_reviews_author_idTousers?.name || 'User'}
                                        size="md"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-semibold text-(--text-1)">
                                                    {review.users_reviews_author_idTousers?.name || 'Anonymous'}
                                                </h4>
                                                {review.users_reviews_author_idTousers?.title && (
                                                    <p className="text-xs text-(--text-2)">
                                                        {review.users_reviews_author_idTousers.title}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-(--text-2)">
                                                    {new Date(review.created_at).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                                {isOwnReview && (
                                                    <button
                                                        onClick={() => handleDelete(review.id)}
                                                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                        title={t('deleteReview')}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <Rating value={review.rating} readonly size="sm" />
                                        {review.comment && (
                                            <p className="text-(--text-2) text-sm mt-2 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-8">
                        <p className="text-(--text-2) text-sm">
                            No reviews yet. Be the first to review!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
