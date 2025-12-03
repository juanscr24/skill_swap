import { Component } from "lucide-react"
import Link from "next/link"

export const LadingFooter = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-10 py-10 border-t border-(--border-1)">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3 text-(--text-1)">
                    <Component className="text-(--button-1)" />
                    <h1 className="font-bold text-xl">SkillSwap</h1>
                </div>
                <div className="flex items-center gap-10 text-(--text-1)">
                    <Link href="#">About Us</Link>
                    <Link href="#">Contact</Link>
                    <Link href="#">Terms of Use</Link>
                    <Link href="#">Privacy Policy</Link>
                </div>
            </div>
            <div className="flex items-center gap-10 text-(--text-2)">
                <p>© 2025 SkillSwap. All rights reserved.</p>
            </div>
        </div>
    )
}
