import { Badge } from "@/components/ui/Badge"
import { useTranslations } from "next-intl"
import { FiZap, FiBookOpen } from "react-icons/fi"
import type { MentorSkillsSectionProps, Skill } from '@/types'

export const MentorSkillsSection = ({ skillsTeach, skillsLearn }: MentorSkillsSectionProps) => {
    const t = useTranslations('profile')

    return (
        <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1)">
            <div className="flex items-center gap-2 mb-6">
                <FiZap className="text-(--button-1)" size={20} />
                <h2 className="text-xl font-bold text-(--text-1)">{t('skills')}</h2>
            </div>

            {/* What I Teach */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-(--text-2) uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiZap className="text-(--text-2)" />
                    {t('whatITeach')}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {skillsTeach.length > 0 ? (
                        skillsTeach.map(skill => (
                            <Badge
                                key={skill.id}
                                variant="info"
                                className="px-3 py-1.5 bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20 cursor-default"
                            >
                                {skill.name} {skill.level ? `• ${skill.level}` : ''}
                            </Badge>
                        ))
                    ) : (
                        <p className="text-(--text-2) text-sm italic">{t('noSkillsTeach')}</p>
                    )}
                </div>
            </div>

            {/* What I Learn */}
            <div>
                <h3 className="text-sm font-bold text-(--text-2) uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiBookOpen className="text-(--text-2)" />
                    {t('whatILearn')}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {skillsLearn.length > 0 ? (
                        skillsLearn.map(skill => (
                            <Badge
                                key={skill.id}
                                variant="warning"
                                className="px-3 py-1.5 bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20 cursor-default"
                            >
                                {skill.name}
                            </Badge>
                        ))
                    ) : (
                        <p className="text-(--text-2) text-sm italic">{t('noSkillsLearn')}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
