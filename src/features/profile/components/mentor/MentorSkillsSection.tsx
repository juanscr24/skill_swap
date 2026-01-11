import { Card } from "@/shared/components/ui/Card"
import { useTranslations } from "next-intl"
import { FiZap, FiBookOpen } from "react-icons/fi"
import type { MentorSkillsSectionProps } from '@/types'
import { SkillList } from "../skills/SkillList"

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

                <SkillList
                    skills={skillsTeach}
                    emptyText={t('noSkillsTeach')}
                    variant="teach"
                />
            </Card>

            {/* Skills I Want to Learn Card */}
            <Card>
                <div className="flex items-center gap-2 mb-4">
                    <FiBookOpen className="text-[#F59E0B]" size={20} />
                    <h3 className="text-lg font-bold text-(--text-1)">{t('skillsLearn')}</h3>
                </div>

                <SkillList
                    skills={skillsLearn}
                    emptyText={t('noSkillsLearn')}
                    variant="learn"
                />
            </Card>
        </div>
    )
}
