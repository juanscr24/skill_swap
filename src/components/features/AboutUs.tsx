'use client'
import Image from "next/image"
import { Button } from "../ui/Button"
import { landing } from "@public/images"
import { useTranslations } from "next-intl"
import Link from "next/link"

export const AboutUs = () => {
    const t = useTranslations('aboutUs')
    return (
        <div className="grid grid-cols-2 py-20 gap-20 items-center">
            <div className="flex flex-col gap-8">
                <h2 className="text-5xl font-bold text-(--text-1)">{t('title')}</h2>
                <p className="text-lg text-(--text-2)">{t('description')}</p>
                <Link href="/auth">
                    <Button className="w-60 py-3" primary children={t('button')} />
                </Link>
            </div>
            <Image src={landing} alt="Lading" width={500} height={500} />
        </div>
    )
}
