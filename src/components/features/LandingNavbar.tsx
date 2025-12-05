'use client'
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { useEffect, useState } from "react"
import { Component, Menu, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "../ui/Button"
import { ButtonMode } from "../ui/ButtonMode"
import { LanguageSwitcher } from "../ui/LanguageSwitcher"
import { NAVBAR_ITEMS } from "@/constants/navbar_item"
import { scrollToTop, scrollToElement } from "@/utils/scroll"

export const LandingNavbar = () => {
    const t = useTranslations("landingNavbar")
    const [mounted, setMounted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => setMounted(true), [])

    const handleNavClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const elementId = href.replace('#', '')
        scrollToElement(elementId, e)
        setMobileMenuOpen(false) // Cerrar menú móvil al hacer clic
    }

    return (
        <>
            <motion.nav
                id="navbar"
                className="flex justify-between items-center py-6 max-md:py-4 border-b border-(--border-1) fixed top-0 w-8/10 max-md:w-9/10 z-50 bg-(--bg-1) transition-colors duration-300"
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
                    className="flex items-center gap-3 max-sm:gap-2 text-(--text-1)"
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
                                <Component className="text-(--button-1) max-sm:w-5 max-sm:h-5" />
                            </motion.div>

                            <motion.h1
                                className="font-bold text-xl max-sm:text-lg"
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

                {/* Hamburger Menu Button - Solo visible en móvil */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="hidden max-lg:flex items-center justify-center w-10 h-10 text-(--text-1) hover:bg-(--bg-2) rounded-lg transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Navigation */}
                <div className="flex items-center gap-5 max-lg:gap-3 text-(--text-2) max-lg:hidden">
                    {/* Nav Links */}
                    <motion.div
                        className="flex items-center gap-5 max-lg:gap-3"
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
                                    className="hover:scale-102 hover:text-(--text-1) transition-all duration-300 text-sm max-lg:text-xs"
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
                        className="flex items-center gap-3 max-lg:gap-2"
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
                        className="flex items-center gap-4 max-lg:gap-2"
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

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="hidden max-lg:flex fixed top-20 max-sm:top-16 left-0 right-0 z-40 bg-(--bg-1) border-b border-(--border-1) shadow-lg"
                    >
                        <div className="flex flex-col w-8/10 mx-auto py-6 gap-6">
                            {/* Nav Links */}
                            <div className="flex flex-col gap-4">
                                {NAVBAR_ITEMS.map((item, index) => (
                                    <Link
                                        key={index}
                                        className="text-(--text-2) hover:text-(--text-1) transition-colors py-2 text-base"
                                        href={item.href}
                                        onClick={handleNavClick(item.href)}
                                    >
                                        {t(item.label)}
                                    </Link>
                                ))}
                            </div>

                            {/* Separator */}
                            <div className="h-px bg-(--border-1)"></div>

                            {/* Theme & Language */}
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-(--text-2) text-sm">Tema & Idioma</span>
                                <div className="flex items-center gap-3">
                                    <ButtonMode />
                                    <LanguageSwitcher />
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="h-px bg-(--border-1)"></div>

                            {/* Auth Buttons */}
                            <div className="flex flex-col gap-3">
                                <Link href="/auth" className="w-full">
                                    <Button secondary children={t("login")} className="w-full" />
                                </Link>
                                <Link href="/auth" className="w-full">
                                    <Button primary children={t("register")} className="w-full" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
