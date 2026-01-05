'use client'
import Image from "next/image"
import { motion } from "motion/react"
import { Button } from "../../ui/Button"
import { landing } from "@public/images"
import { useTranslations } from "next-intl"
import Link from "next/link"

export const AboutUs = () => {
    const t = useTranslations('aboutUs')
    return (
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-20 pt-10 max-lg:gap-4 max-md:gap-8 items-center justify-between">
            <motion.div
                className="flex flex-col gap-8 max-md:gap-6 w-full"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut"
                }}
            >
                <motion.h2
                    className="text-5xl max-lg:text-4xl max-md:text-3xl max-sm:text-2xl font-bold text-(--text-1)"
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
                <Image
                    className="object-cover w-full rounded-lg hidden max-md:block"
                    src={landing}
                    alt="Landing"
                    width={1280}
                    height={1280}
                />
                <motion.p
                    className="text-lg max-md:text-base max-sm:text-sm text-(--text-2)"
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
                    <Link href="/register">
                        <Button className="w-60 max-sm:w-full py-3" primary children={t('button')} />
                    </Link>
                </motion.div>
            </motion.div>

            <motion.div
                className="max-md:w-full max-md:flex max-md:justify-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: "easeOut"
                }}
            >
                <Image
                    className="object-cover rounded-lg max-md:hidden cursor-pointer hover:scale-101 transition-all duration-300"
                    src={landing}
                    alt="Landing"
                    width={1280}
                    height={1280}
                />
            </motion.div>
        </div>
    )
}
