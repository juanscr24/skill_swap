'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import type { EditSkillsSectionProps } from '@/types'
import { Card } from "@/shared/components/ui"
import { SkillList } from "../skills/SkillList"
import { SkillModal } from "../skills/SkillModal"
import { WantedSkillModal } from "../skills/WantedSkillModal"

export const EditSkillsSection = ({
  skills,
  wantedSkills,
  onAddSkill,
  onDeleteSkill,
  onAddWantedSkill,
  onDeleteWantedSkill
}: EditSkillsSectionProps) => {
  const t = useTranslations('profile')

  const [isAddingTeach, setIsAddingTeach] = useState(false)
  const [isAddingLearn, setIsAddingLearn] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleAddSkill = async (name: string, level: 'beginner' | 'intermediate' | 'advanced' | 'expert') => {
    setSuccessMessage('')
    setErrorMessage('')

    const result = await onAddSkill({ name, level })

    if (result.success) {
      setSuccessMessage('Skill added successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      setErrorMessage('Error adding skill')
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to remove this skill?')) return

    setSuccessMessage('')
    setErrorMessage('')

    const result = await onDeleteSkill(skillId)

    if (result.success) {
      setSuccessMessage('Skill removed successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      setErrorMessage('Error removing skill')
    }
  }

  const handleAddWantedSkill = async (skillName: string) => {
    setSuccessMessage('')
    setErrorMessage('')

    const result = await onAddWantedSkill(skillName)

    if (result.success) {
      setSuccessMessage('Wanted skill added successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      setErrorMessage('Error adding wanted skill')
    }
  }

  const handleDeleteWantedSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to remove this wanted skill?')) return

    setSuccessMessage('')
    setErrorMessage('')

    const result = await onDeleteWantedSkill(skillId)

    if (result.success) {
      setSuccessMessage('Wanted skill removed successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      setErrorMessage('Error removing wanted skill')
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-bold text-(--text-1) mb-6">Skills & Expertise</h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-xl text-sm text-green-800 dark:text-green-200">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-xl text-sm text-red-800 dark:text-red-200">
          {errorMessage}
        </div>
      )}

      {/* Skills I Teach */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-(--text-1) mb-2">{t('skillsTeach')}</h3>
        <p className="text-sm text-(--text-2) mb-4">{t('selectSkillsYouTeach')}</p>

        <SkillList
          skills={skills}
          onDelete={handleDeleteSkill}
          onAddClick={() => setIsAddingTeach(true)}
          variant="teach"
          emptyText="No skills added yet."
          showAddButton={true}
        />

        <SkillModal
          isOpen={isAddingTeach}
          onClose={() => setIsAddingTeach(false)}
          onAddSkill={handleAddSkill}
          existingSkills={skills}
        />
      </div>

      {/* Skills I Want to Learn */}
      <div>
        <h3 className="text-lg font-semibold text-(--text-1) mb-2">{t('skillsLearn')}</h3>
        <p className="text-sm text-(--text-2) mb-4">{t('selectSkillsYouLearn')}</p>

        <SkillList
          skills={wantedSkills}
          onDelete={handleDeleteWantedSkill}
          onAddClick={() => setIsAddingLearn(true)}
          variant="learn"
          emptyText="No wanted skills added yet."
          showAddButton={true}
        />

        <WantedSkillModal
          isOpen={isAddingLearn}
          onClose={() => setIsAddingLearn(false)}
          onAddSkill={handleAddWantedSkill}
          existingSkills={wantedSkills}
        />
      </div>
    </Card>
  )
}
