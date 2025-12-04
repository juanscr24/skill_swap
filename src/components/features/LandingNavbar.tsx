'use client'
import Link from "next/link"
import { Button } from "../ui/Button"
import { ButtonMode } from "../ui/ButtonMode"
import { Component } from "lucide-react"
import { LanguageSwitcher } from "../ui/LanguageSwitcher"
import { useTranslations } from "next-intl"
import { NAVBAR_ITEMS } from "@/constants/navbar_item"

export const LandingNavbar = () => {
    const t = useTranslations("landingNavbar")
    return (
        <nav id="navbar" className="flex justify-between items-center py-6 border-b border-(--border-1) fixed w-7/10 z-50 bg-(--bg-1)">
            <Link href="#navbar" className="flex items-center gap-3 text-(--text-1)">
                <Component className="text-(--button-1)" />
                <h1 className="font-bold text-xl">SkillSwap</h1>
            </Link>
            <div className="flex items-center gap-5 text-(--text-2)">
                {NAVBAR_ITEMS.map((item, index) => (
                    <Link className="hover:scale-102 transition-all duration-300" key={index} href={item.href}>{t(item.label)}</Link>
                ))}
                <ButtonMode />
                <LanguageSwitcher />
                <div className="flex items-center gap-4">
                    <Button secondary children={t("login")} />
                    <Button primary children={t("register")} />
                </div>
            </div>
        </nav>
    )
}
