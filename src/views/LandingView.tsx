'use client'
import { guides } from "@/constants/guides"
import { skills } from "@/constants/skills"
import { useTranslations } from "next-intl"
import { userReviews } from "@/constants/userReviews"
import { LadingFooter } from "@/components/features/LadingFooter"
import { AboutUs, CardGuide, CardReview, CardSkill, LandingNavbar } from "@/components"

export const LandingView = () => {
    const t = useTranslations('landing')
    const tCardGuide = useTranslations('cardGuide')
    const tskills = useTranslations('skills')
    const toccupation = useTranslations('occupation')
    return (
        <div>
            <LandingNavbar />
            <AboutUs />
            <h2 id="how_work" className="text-4xl font-semibold text-(--text-1) pb-20 text-center">{t('howItWorks')}</h2>
            <div className="grid grid-cols-3 gap-10">
                {guides.map((guide, index) => {
                    const Icon = guide.icon
                    return (
                        <CardGuide key={index} icon={<Icon className="text-(--button-1) h-7 w-7" />} title={tCardGuide(guide.title)} description={tCardGuide(guide.description)} />
                    )
                })}
            </div>
            <h2 id="popular_skills" className="text-4xl font-semibold text-(--text-1) py-20 text-center">{t('popularSkills')}</h2>
            <div className="grid grid-cols-3 gap-10">
                {skills.map((skill, index) => {
                    const Icon = skill.icon
                    return (
                        <CardSkill
                            key={index}
                            icon={<Icon className="text-(--button-1) h-7 w-7" />}
                            skill={tskills(skill.skill)} />
                    )
                })}
            </div>
            <h2 id="reviews" className="text-4xl font-semibold text-(--text-1) py-20 text-center">{t('userReviews')}</h2>
            <div className="grid grid-cols-4 gap-10 pb-20 pt-5">
                {userReviews.map((review, index) => (
                    <CardReview
                        key={index}
                        username={review.username}
                        occupation={toccupation(review.occupation)}
                        review={review.review} />
                ))}
            </div>
            <LadingFooter />
        </div>
    )
}
