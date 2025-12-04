'use client'
import Link from "next/link"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { Component } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "../ui/Button"
import { ButtonMode } from "../ui/ButtonMode"
import { LanguageSwitcher } from "../ui/LanguageSwitcher"
import { NAVBAR_ITEMS } from "@/constants/navbar_item"
import { scrollToTop, scrollToElement } from "@/utils/scroll"

export const LandingNavbar = () => {
    const t = useTranslations("landingNavbar")
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const handleNavClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const elementId = href.replace('#', '')
        scrollToElement(elementId, e)
    }

    return (
        <motion.nav
            id="navbar"
            className="flex justify-between items-center py-6 border-b border-(--border-1) fixed top-0 w-8/10 z-50 bg-(--bg-1) transition-colors duration-300"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.5,
                ease: [0, 0.71, 0.2, 1.01]
            }}
        >
            {/* Logo */}
            <Link
                href="#navbar"
                onClick={scrollToTop}
                className="flex items-center gap-3 text-(--text-1)"
            >
                {mounted && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.5,
                                ease: [0, 0.71, 0.2, 1.01],
                                scale: {
                                    type: "spring",
                                    damping: 10,
                                    stiffness: 100,
                                }
                            }}
                        >
                            <Component className="text-(--button-1)" />
                        </motion.div>

                        <motion.h1
                            className="font-bold text-xl"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.2,
                                ease: "easeOut"
                            }}
                        >
                            SkillSwap
                        </motion.h1>
                    </>
                )}
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-5 text-(--text-2)">
                {/* Nav Links */}
                <motion.div
                    className="flex items-center gap-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {NAVBAR_ITEMS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: 0.4 + index * 0.1
                            }}
                        >
                            <Link
                                className="hover:scale-102 hover:text-(--text-1) transition-all duration-300"
                                href={item.href}
                                onClick={handleNavClick(item.href)}
                            >
                                {t(item.label)}
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Separator */}
                <div className="h-6 w-px bg-(--text-2)/20"></div>

                {/* Theme & Language */}
                <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    <ButtonMode />
                    <LanguageSwitcher />
                </motion.div>

                {/* Separator */}
                <div className="h-6 w-px bg-(--text-2)/20"></div>

                {/* Auth Buttons */}
                <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.8,
                        ease: "easeOut"
                    }}
                >
                    <Link href="/auth">
                        <Button secondary children={t("login")} />
                    </Link>
                    <Link href="/auth">
                        <Button primary children={t("register")} />
                    </Link>
                </motion.div>
            </div>
        </motion.nav>
    )
}
