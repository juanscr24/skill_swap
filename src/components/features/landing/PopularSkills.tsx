import { CardSkill } from "@/components/ui/CardSkill"
import { skills } from "@/constants"
import { useMediaQuery } from "@/hooks"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"

export const PopularSkills = () => {
    const t = useTranslations('landing')
    const tskills = useTranslations('skills')

    // Detectar tamaños de pantalla
    const isTablet = useMediaQuery('(max-width: 1024px)')
    const isSmallDesktop = useMediaQuery('(max-width: 1536px)')

    // Limitar skills según el tamaño de pantalla
    const displayedSkills =
        isTablet ?
            skills.slice(0, 6) :
            isSmallDesktop ?
                skills.slice(0, 8) :
                skills
    return (
        <>
            {/* Sección: Habilidades Populares */}
            <motion.h2
                id="popular_skills"
                className="text-4xl max-lg:text-3xl max-md:text-2xl max-sm:text-xl font-semibold text-(--text-1) pb-20 max-md:pb-12 max-sm:pb-8 mt-20 max-md:mt-12 max-sm:mt-8 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {t('popularSkills')}
            </motion.h2>

            <div className="grid grid-cols-5 max-2xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 gap-10 max-lg:gap-6 max-md:gap-4 mb-20 max-md:mb-12 max-sm:mb-8">
                {displayedSkills.map((skill, index) => {
                    const Icon = skill.icon
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.05,
                                ease: "easeOut"
                            }}
                        >
                            <CardSkill
                                icon={<Icon className="text-(--button-1) h-7 w-7" />}
                                skill={tskills(skill.skill)}
                            />
                        </motion.div>
                    )
                })}
            </div>
        </>
    )
}