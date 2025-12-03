import { guides } from "@/constants/guides"
import { skills } from "@/constants/skills"
import { AboutUs, CardGuide, CardReview, CardSkill, LandingNavbar } from "@/components"
import { User } from "lucide-react"
import { LadingFooter } from "@/components/features/LadingFooter"
import { userReviews } from "@/constants/userReviews"

export const LandingView = () => {
    return (
        <div>
            <LandingNavbar />
            <AboutUs />
            <h2 className="text-4xl font-semibold text-(--text-1) pb-20 text-center">¿Cómo funciona SkillSwap?</h2>
            <div className="grid grid-cols-3 gap-10">
                {guides.map((guide, index) => {
                    const Icon = guide.icon
                    return (
                        <CardGuide key={index} icon={<Icon className="text-(--button-1) h-7 w-7" />} title={guide.title} description={guide.description} />
                    )
                })}
            </div>
            <h2 className="text-4xl font-semibold text-(--text-1) py-20 text-center">Habilidades Populares</h2>
            <div className="grid grid-cols-3 gap-10">
                {skills.map((skill, index) => {
                    const Icon = skill.icon
                    return (
                        <CardSkill
                            key={index}
                            icon={<Icon className="text-(--button-1) h-7 w-7" />}
                            skill={skill.skill} />
                    )
                })}
            </div>
            <h2 className="text-4xl font-semibold text-(--text-1) py-20 text-center">Lo que dicen nuestros usuarios</h2>
            <div className="grid grid-cols-4 gap-10 pb-20 pt-5">
                {userReviews.map((review, index) => (
                    <CardReview
                        key={index}
                        username={review.username}
                        skill={review.skill}
                        review={review.review}
                        icon={<User className={review.iconClass} />} />
                ))}
            </div>
            <LadingFooter />
        </div>
    )
}
