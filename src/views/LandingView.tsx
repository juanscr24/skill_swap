'use client'
import { AboutUs, LandingNavbar } from "@/components"
import { HowItWorks } from "@/components/features/landing/HowItWorks"
import { LadingFooter } from "@/components/features/landing/LadingFooter"
import { PopularSkills } from "@/components/features/landing/PopularSkills"
import { LandingReviews } from "@/components/features/landing/LandingReviews"

export const LandingView = () => {
    return (
        <div className="flex justify-center w-full">
            <div className="pt-24 max-md:pt-20 max-sm:pt-16 w-8/10 max-md:w-9/10">
                <LandingNavbar />
                <AboutUs />
                <HowItWorks />
                <PopularSkills />
                <LandingReviews />
                <LadingFooter />
            </div>
        </div>
    )
}
