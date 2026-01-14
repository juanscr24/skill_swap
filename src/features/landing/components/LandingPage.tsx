'use client'
import { AboutUs } from "./AboutUs"
import { HowItWorks } from "./HowItWorks"
import { LadingFooter } from "./LadingFooter"
import { PopularSkills } from "./PopularSkills"
import { LandingReviews } from "./LandingReviews"
import { LandingNavbar } from "./LandingNavbar"

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
