'use client'
import { AboutUs, LandingNavbar } from "@/components"
import { HowItWorks } from "@/features/landing/components/HowItWorks"
import { LadingFooter } from "@/features/landing/components/LadingFooter"
import { PopularSkills } from "@/features/landing/components/PopularSkills"
import { LandingReviews } from "@/features/landing/components/LandingReviews"

export const LandingPage = () => {
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
