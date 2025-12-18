'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { mockReviews } from "@/constants/mockReviews"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { Rating } from "@/components/ui/Rating"
import { Button } from "@/components"
import { Textarea } from "@/components/ui/Textarea"
import { Modal } from "@/components/ui/Modal"

export const ReviewsView = () => {
    const t = useTranslations('reviews')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

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
                {mockReviews.map((review) => (
                    <Card key={review.id}>
                        <div className="flex flex-col sm:flex-row gap-4 max-sm:gap-3">
                            <Avatar 
                                src={review.author.image} 
                                alt={review.author.name}
                                size="md"
                            />
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                                    <div>
                                        <h3 className="font-semibold text-(--text-1) max-sm:text-sm">
                                            {review.author.name}
                                        </h3>
                                        <p className="text-sm max-sm:text-xs text-(--text-2)">
                                            {t('reviewFor')} {review.target.name}
                                        </p>
                                    </div>
                                    <div className="sm:text-right">
                                        <Rating value={review.rating} readonly size="sm" />
                                        <p className="text-xs max-sm:text-[10px] text-(--text-2) mt-1">
                                            {review.created_at.toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-(--text-2) max-sm:text-sm">{review.comment}</p>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Leave Review Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t('leaveReview')}
            >
                <form className="space-y-6 max-sm:space-y-4">
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
                            onClick={() => setIsModalOpen(false)}
                        >
                            {t('submit')}
                        </Button>
                        <Button 
                            secondary 
                            className="px-8 max-sm:px-4 py-3 max-sm:py-2"
                            onClick={() => setIsModalOpen(false)}
                        >
                            {t('cancel')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
