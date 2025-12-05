'use client'
import { motion } from "motion/react"
import { guides } from "@/constants/guides"
import { skills } from "@/constants/skills"
import { useTranslations } from "next-intl"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { userReviews } from "@/constants/userReviews"
import { LadingFooter } from "@/components/features/LadingFooter"
import { AboutUs, CardGuide, CardReview, CardSkill, LandingNavbar } from "@/components"

export const LandingView = () => {
    const t = useTranslations('landing')
    const tCardGuide = useTranslations('cardGuide')
    const tskills = useTranslations('skills')
    const toccupation = useTranslations('occupation')

    // Detectar tamaños de pantalla
    const isTablet = useMediaQuery('(max-width: 1024px)')
    const isSmallDesktop = useMediaQuery('(max-width: 1536px)')

    // Limitar skills según el tamaño de pantalla
    const displayedSkills =
        isTablet ?
            skills.slice(0, 6) :
            isSmallDesktop ?
                skills.slice(0, 8) :
                skills

    return (
        <div className="pt-24 max-md:pt-20 max-sm:pt-16">
            <LandingNavbar />
            <AboutUs />

            {/* Sección: Cómo funciona */}
            <motion.h2
                id="how_work"
                className="text-4xl max-lg:text-3xl max-md:text-2xl max-sm:text-xl font-semibold text-(--text-1) pb-20 max-md:pb-12 max-sm:pb-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {t('howItWorks')}
            </motion.h2>

            <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-10 max-lg:gap-6 max-md:gap-4">
                {guides.map((guide, index) => {
                    const Icon = guide.icon
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: "easeOut"
                            }}
                        >
                            <CardGuide
                                icon={<Icon className="text-(--button-1) h-7 w-7" />}
                                title={tCardGuide(guide.title)}
                                description={tCardGuide(guide.description)}
                            />
                        </motion.div>
                    )
                })}
            </div>

            {/* Sección: Habilidades Populares */}
            <motion.h2
                id="popular_skills"
                className="text-4xl max-lg:text-3xl max-md:text-2xl max-sm:text-xl font-semibold text-(--text-1) pb-20 max-md:pb-12 max-sm:pb-8 mt-20 max-md:mt-12 max-sm:mt-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {t('popularSkills')}
            </motion.h2>

            <div className="grid grid-cols-5 max-2xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 gap-10 max-lg:gap-6 max-md:gap-4 mb-20 max-md:mb-12 max-sm:mb-8">
                {displayedSkills.map((skill, index) => {
                    const Icon = skill.icon
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.05,
                                ease: "easeOut"
                            }}
                        >
                            <CardSkill
                                icon={<Icon className="text-(--button-1) h-7 w-7" />}
                                skill={tskills(skill.skill)}
                            />
                        </motion.div>
                    )
                })}
            </div>

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

            <LadingFooter />
        </div>
    )
}
