'use client'
import { FOOTER_ITEMS } from "@/constants/footer_item"
import { Component } from "lucide-react"
import { useTranslations } from "next-intl"
import { motion } from "motion/react"
import Link from "next/link"

export const LadingFooter = () => {
    const t = useTranslations("landingFooter")
    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.5,
                ease: [0, 0.71, 0.2, 1.01]
            }}
            className="flex flex-col items-center justify-center gap-10 max-md:gap-6 py-10 max-md:py-6 border-t border-(--border-1)">
            <div className="flex max-md:flex-col justify-between items-center max-md:gap-6 w-full">
                <div className="flex items-center gap-3 max-sm:gap-2 text-(--text-1)">
                    <Component className="text-(--button-1) max-sm:w-5 max-sm:h-5" />
                    <h1 className="font-bold text-xl max-sm:text-lg">SkillSwap</h1>
                </div>
                <div className="flex items-center max-md:flex-col gap-10 max-lg:gap-6 max-md:gap-4 text-(--text-2)">
                    {FOOTER_ITEMS.map((item, index) => (
                        <Link
                            className="hover:text-(--text-1) transition-all duration-300 text-sm max-sm:text-xs"
                            key={index}
                            href={item.href}
                        >
                            {t(item.label)}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-10 text-(--text-2)">
                <p className="text-sm max-sm:text-xs text-center">© 2025 SkillSwap. All rights reserved.</p>
            </div>
        </motion.div>
    )
}
