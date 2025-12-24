'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useReviews } from "@/hooks"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { Rating } from "@/components/ui/Rating"
import { Button } from "@/components"
import { Textarea } from "@/components/ui/Textarea"
import { Modal } from "@/components/ui/Modal"
import { useSession } from "next-auth/react"

export const ReviewsView = () => {
    const t = useTranslations('reviews')
    const { data: session } = useSession()
    const { reviews, isLoading, createReview } = useReviews()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [targetUserId, setTargetUserId] = useState<string>('')

    const handleSubmit = async () => {
        if (!targetUserId || rating === 0) {
            alert(t('fillRequired'))
            return
        }

        const result = await createReview(targetUserId, rating, comment)
        
        if (result.success) {
            setIsModalOpen(false)
            setRating(0)
            setComment('')
            setTargetUserId('')
        } else {
            alert(result.error || t('errorCreating'))
        }
    }

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 max-md:mb-6 max-sm:mb-4 gap-4">
                <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1)">{t('reviews')}</h1>
                <Button primary onClick={() => setIsModalOpen(true)} className="px-6 max-sm:px-4 py-3 max-sm:py-2 max-sm:text-sm max-sm:w-full">
                    {t('leaveReview')}
                </Button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 max-sm:space-y-3 max-w-4xl">
                {isLoading ? (
                    <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">{t('loading')}</p>
                ) : reviews.length === 0 ? (
                    <p className="text-(--text-2) text-center py-8 max-sm:py-6 max-sm:text-sm">{t('noReviews')}</p>
                ) : (
                    reviews.map((review) => {
                        const createdAt = new Date(review.createdAt)
                        return (
                            <Card key={review.id}>
                                <div className="flex flex-col sm:flex-row gap-4 max-sm:gap-3">
                                    <Avatar 
                                        src={review.author?.image || ''} 
                                        alt={review.author?.name || 'User'}
                                        size="md"
                                    />
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                                            <div>
                                                <h3 className="font-semibold text-(--text-1) max-sm:text-sm">
                                                    {review.author?.name || 'Unknown User'}
                                                </h3>
                                                <p className="text-sm max-sm:text-xs text-(--text-2)">
                                                    {t('reviewFor')} {review.target?.name || 'Unknown User'}
                                                </p>
                                            </div>
                                            <div className="sm:text-right">
                                                <Rating value={review.rating} readonly size="sm" />
                                                <p className="text-xs max-sm:text-[10px] text-(--text-2) mt-1">
                                                    {createdAt.toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="text-(--text-2) max-sm:text-sm">{review.comment}</p>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )
                    })
                )}
            </div>

            {/* Leave Review Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setRating(0)
                    setComment('')
                    setTargetUserId('')
                }}
                title={t('leaveReview')}
            >
                <div className="space-y-6 max-sm:space-y-4">
                    <div>
                        <label className="block font-semibold text-(--text-1) mb-2 max-sm:text-sm">
                            {t('selectUser')}
                        </label>
                        <input
                            type="text"
                            value={targetUserId}
                            onChange={(e) => setTargetUserId(e.target.value)}
                            placeholder={t('userIdPlaceholder')}
                            className="w-full px-4 py-2 bg-(--bg-1) border border-(--border-1) rounded-lg text-(--text-1)"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold text-(--text-1) mb-3 max-sm:mb-2 max-sm:text-sm">
                            {t('yourRating')}
                        </label>
                        <div className="flex justify-center">
                            <Rating 
                                value={rating} 
                                onChange={setRating}
                                size="lg"
                            />
                        </div>
                    </div>

                    <Textarea
                        label={t('yourComment')}
                        id="comment"
                        placeholder={t('writeReview')}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                    />

                    <div className="flex gap-4 max-sm:gap-2 max-sm:flex-col">
                        <Button 
                            primary 
                            className="flex-1 py-3 max-sm:py-2"
                            onClick={handleSubmit}
                        >
                            {t('submit')}
                        </Button>
                        <Button 
                            secondary 
                            className="px-8 max-sm:px-4 py-3 max-sm:py-2"
                            onClick={() => {
                                setIsModalOpen(false)
                                setRating(0)
                                setComment('')
                                setTargetUserId('')
                            }}
                        >
                            {t('cancel')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
