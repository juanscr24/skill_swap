import Link from "next/link"
import { Button } from "../ui/Button"
import { ButtonMode } from "../ui/ButtonMode"
import { Component } from "lucide-react"
import { LanguageSwitcher } from "../ui/LanguageSwitcher"

export const LandingNavbar = () => {
    return (
        <nav className="flex justify-between items-center py-6 border-b border-(--border-1)">
            <div className="flex items-center gap-3 text-(--text-1)">
                <Component className="text-(--button-1)" />
                <h1 className="font-bold text-xl">SkillSwap</h1>
            </div>
            <div className="flex items-center gap-10 text-(--text-2)">
                <Link href="#">How It Works</Link>
                <Link href="#">Skills</Link>
                <Link href="#">About Us</Link>
                <ButtonMode />
                <LanguageSwitcher />
                <div className="flex items-center gap-4">
                    <Button secondary children="Login" />
                    <Button primary children="Register" />
                </div>
            </div>
        </nav>
    )
}
