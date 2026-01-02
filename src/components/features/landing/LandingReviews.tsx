import {motion} from "motion/react"
import { userReviews } from "@/constants/userReviews"
import { useTranslations } from "next-intl"
import { CardReview } from "@/components/ui/CardReview"

export const LandingReviews = () => {
    const t = useTranslations('landing')
    const toccupation = useTranslations('occupation')
    return (
        <>
        {/* Sección: Opiniones */}
                <motion.h2
                    id="reviews"
                    className="text-4xl max-lg:text-3xl max-md:text-2xl max-sm:text-xl font-semibold text-(--text-1) pb-20 max-md:pb-12 max-sm:pb-8 mt-10 max-md:mt-6 max-sm:mt-4 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {t('userReviews')}
                </motion.h2>

                <motion.div
                    className="relative overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Gradient fade izquierdo */}
                    <div className="absolute left-0 top-0 bottom-0 w-40 max-md:w-20 max-sm:w-10 bg-linear-to-r from-(--bg-1) to-transparent z-10 pointer-events-none"></div>

                    {/* Gradient fade derecho */}
                    <div className="absolute right-0 top-0 bottom-0 w-40 max-md:w-20 max-sm:w-10 bg-linear-to-l from-(--bg-1) to-transparent z-10 pointer-events-none"></div>

                    <div className="flex gap-10 max-md:gap-6 max-sm:gap-4 pb-20 pt-10 animate-marquee-right">
                        {[...userReviews, ...userReviews].map((review, index) => (
                            <CardReview
                                key={index}
                                username={review.username}
                                occupation={toccupation(review.occupation)}
                                review={review.review}
                            />
                        ))}
                    </div>
                </motion.div>
        </>
    )
}