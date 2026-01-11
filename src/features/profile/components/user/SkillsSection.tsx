'use client'
import { useState } from "react"
import { Card } from "@/shared/components/ui/Card"
import { useTranslations } from "next-intl"
import { FiBookOpen, FiZap } from "react-icons/fi"
import type { SkillsSectionProps } from '@/types'
import { SkillList } from "../skills/SkillList"
import { SkillModal } from "../skills/SkillModal"
import { WantedSkillModal } from "../skills/WantedSkillModal"

export const SkillsSection = ({
    skillsTeach,
    skillsLearn,
    onAddSkill,
    onRemoveSkill,
    onAddWantedSkill,
    onRemoveWantedSkill
}: SkillsSectionProps) => {
    const t = useTranslations('profile')
    const [isAddingTeach, setIsAddingTeach] = useState(false)
    const [isAddingLearn, setIsAddingLearn] = useState(false)

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
                    onDelete={onRemoveSkill}
                    onAddClick={() => setIsAddingTeach(true)}
                    variant="teach"
                    emptyText={t('noSkillsTeach')}
                    showAddButton={!!onAddSkill}
                />

                {onAddSkill && (
                    <SkillModal
                        isOpen={isAddingTeach}
                        onClose={() => setIsAddingTeach(false)}
                        onAddSkill={onAddSkill}
                        existingSkills={skillsTeach}
                    />
                )}
            </Card>

            {/* Skills I Want to Learn Card */}
            <Card>
                <div className="flex items-center gap-2 mb-4">
                    <FiBookOpen className="text-[#F59E0B]" size={20} />
                    <h3 className="text-lg font-bold text-(--text-1)">{t('skillsLearn')}</h3>
                </div>

                <SkillList
                    skills={skillsLearn}
                    onDelete={onRemoveWantedSkill}
                    onAddClick={() => setIsAddingLearn(true)}
                    variant="learn"
                    emptyText={t('noSkillsLearn')}
                    showAddButton={!!onAddWantedSkill}
                />

                {onAddWantedSkill && (
                    <WantedSkillModal
                        isOpen={isAddingLearn}
                        onClose={() => setIsAddingLearn(false)}
                        onAddSkill={onAddWantedSkill}
                        existingSkills={skillsLearn}
                    />
                )}
            </Card>
        </div>
    )
}
