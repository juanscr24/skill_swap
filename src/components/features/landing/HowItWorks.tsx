import { CardGuide } from "@/components/ui/CardGuide"
import { guides } from "@/constants"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"

export const HowItWorks = () => {
    const t = useTranslations('landing')
    const tCardGuide = useTranslations('cardGuide')
    return (
        <>
            {/* Sección: Cómo funciona */}
            < motion.h2
                id="how_work"
                className="text-4xl max-lg:text-3xl max-md:text-2xl max-sm:text-xl font-semibold text-(--text-1) pb-20 max-md:pb-12 max-sm:pb-8 text-center"
                initial={{ opacity: 0, y: 30 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {t('howItWorks')}
            </motion.h2 >

            <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-10 max-lg:gap-6 max-md:gap-4">
                {guides.map((guide, index) => {
                    const Icon = guide.icon
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: "easeOut"
                            }}
                        >
                            <CardGuide
                                icon={<Icon className="text-(--button-1) h-7 w-7" />}
                                title={tCardGuide(guide.title)}
                                description={tCardGuide(guide.description)}
                            />
                        </motion.div>
                    )
                })}
            </div>
        </>
    )
}