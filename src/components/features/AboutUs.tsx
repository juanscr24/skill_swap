'use client'
import Image from "next/image"
import { motion } from "motion/react"
import { Button } from "../ui/Button"
import { landing } from "@public/images"
import { useTranslations } from "next-intl"
import Link from "next/link"

export const AboutUs = () => {
    const t = useTranslations('aboutUs')
    return (
        <div className="flex gap-20 items-center justify-between">
            <motion.div
                className="flex flex-col gap-8 w-1/2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut"
                }}
            >
                <motion.h2
                    className="text-5xl font-bold text-(--text-1)"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.2,
                        ease: "easeOut"
                    }}
                >
                    {t('title')}
                </motion.h2>

                <motion.p
                    className="text-lg text-(--text-2)"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.3,
                        ease: "easeOut"
                    }}
                >
                    {t('description')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.4,
                        ease: "easeOut"
                    }}
                >
                    <Link href="/auth">
                        <Button className="w-60 py-3" primary children={t('button')} />
                    </Link>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: "easeOut"
                }}
            >
                <Image className="object-cover" src={landing} alt="Landing" width={550} height={550} />
            </motion.div>
        </div>
    )
}
