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
            className="flex flex-col items-center justify-center gap-10 py-10 border-t border-(--border-1)">
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3 text-(--text-1)">
                    <Component className="text-(--button-1)" />
                    <h1 className="font-bold text-xl">SkillSwap</h1>
                </div>
                <div className="flex items-center gap-10 text-(--text-2)">
                    {FOOTER_ITEMS.map((item, index) => (
                        <Link className="hover:scale-102 transition-all duration-300" key={index} href={item.href}>{t(item.label)}</Link>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-10 text-(--text-2)">
                <p>© 2025 SkillSwap. All rights reserved.</p>
            </div>
        </motion.div>
    )
}
