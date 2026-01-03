import { Card } from "@/components/ui/Card"
import { useTranslations } from "next-intl"
import { FiZap, FiBookOpen } from "react-icons/fi"
import type { MentorSkillsSectionProps } from '@/types'

export const MentorSkillsSection = ({ skillsTeach, skillsLearn }: MentorSkillsSectionProps) => {
    const t = useTranslations('profile')

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills I Teach Card */}
            <Card>
                <div className="flex items-center gap-2 mb-4">
                    <FiZap className="text-[#3B82F6]" size={20} />
                    <h3 className="text-lg font-bold text-(--text-1)">{t('skillsTeach')}</h3>
                </div>

                <div className="space-y-3">
                    {/* Existing Skills */}
                    {skillsTeach.map(skill => (
                        <div key={skill.id} className="flex items-center justify-between p-3 bg-(--bg-1) rounded-xl border border-(--border-1)">
                            <div className="flex items-center justify-between w-full">
                                <p className="font-semibold text-(--text-1)">{skill.name}</p>
                                {skill.level && (
                                    <span className="text-xs text-(--text-2) uppercase italic tracking-wider">{skill.level}</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {skillsTeach.length === 0 && (
                        <p className="text-(--text-2) text-sm italic text-center py-4">{t('noSkillsTeach')}</p>
                    )}
                </div>
            </Card>

            {/* Skills I Want to Learn Card */}
            <Card>
                <div className="flex items-center gap-2 mb-4">
                    <FiBookOpen className="text-[#F59E0B]" size={20} />
                    <h3 className="text-lg font-bold text-(--text-1)">{t('skillsLearn')}</h3>
                </div>

                <div className="space-y-3">
                    {/* Existing Skills */}
                    {skillsLearn.map(skill => (
                        <div key={skill.id} className="flex items-center justify-between p-3 bg-(--bg-1) rounded-xl border border-(--border-1)">
                            <p className="font-semibold text-(--text-1)">{skill.name}</p>
                        </div>
                    ))}

                    {skillsLearn.length === 0 && (
                        <p className="text-(--text-2) text-sm italic text-center py-4">{t('noSkillsLearn')}</p>
                    )}
                </div>
            </Card>
        </div>
    )
}
