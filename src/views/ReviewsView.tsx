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
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-(--text-1)">{t('reviews')}</h1>
                <Button primary onClick={() => setIsModalOpen(true)} className="px-6 py-3">
                    {t('leaveReview')}
                </Button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 max-w-4xl">
                {mockReviews.map((review) => (
                    <Card key={review.id}>
                        <div className="flex gap-4">
                            <Avatar 
                                src={review.author.image} 
                                alt={review.author.name}
                                size="md"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-(--text-1)">
                                            {review.author.name}
                                        </h3>
                                        <p className="text-sm text-(--text-2)">
                                            {t('reviewFor')} {review.target.name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Rating value={review.rating} readonly size="sm" />
                                        <p className="text-xs text-(--text-2) mt-1">
                                            {review.created_at.toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-(--text-2)">{review.comment}</p>
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
                <form className="space-y-6">
                    <div>
                        <label className="block font-semibold text-(--text-1) mb-3">
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

                    <div className="flex gap-4">
                        <Button 
                            primary 
                            className="flex-1 py-3"
                            onClick={() => setIsModalOpen(false)}
                        >
                            {t('submit')}
                        </Button>
                        <Button 
                            secondary 
                            className="px-8 py-3"
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
