'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components"
import { Badge } from "@/components/ui/Badge"
import { SkillSelector } from "@/components/ui/SkillSelector"
import { recommendedSkills } from "@/constants/recommendedSkills"
import { FiX } from "react-icons/fi"
import type { EditSkillsSectionProps, Skill } from '@/types'

export const EditSkillsSection = ({
  skills,
  wantedSkills,
  onAddSkill,
  onDeleteSkill,
  onAddWantedSkill,
  onDeleteWantedSkill
}: EditSkillsSectionProps) => {
  const t = useTranslations('profile')

  const [newSkillLevel, setNewSkillLevel] = useState('')
  const [skillToAddWithLevel, setSkillToAddWithLevel] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const levelOptions = [
    { value: 'beginner', label: t('beginner') },
    { value: 'intermediate', label: t('intermediate') },
    { value: 'advanced', label: t('advanced') },
    { value: 'expert', label: 'Expert' }
  ]

  const handleAddSkill = async (skillName: string) => {
    if (!skillName.trim()) return
    setSkillToAddWithLevel(skillName)
  }

  const handleConfirmAddSkill = async () => {
    if (!skillToAddWithLevel || !newSkillLevel) return

    setSuccessMessage('')
    setErrorMessage('')

    const result = await onAddSkill({
      name: skillToAddWithLevel.trim(),
      level: newSkillLevel as 'beginner' | 'intermediate' | 'advanced' | 'expert'
    })

    if (result.success) {
      setSkillToAddWithLevel('')
      setNewSkillLevel('')
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
    if (!skillName.trim()) return

    setSuccessMessage('')
    setErrorMessage('')

    const result = await onAddWantedSkill(skillName.trim())

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

        <SkillSelector
          onAdd={handleAddSkill}
          placeholder={t('searchOrAddSkillTeach')}
          recommendations={recommendedSkills}
        />

        {skillToAddWithLevel && (
          <div className="mt-4 p-4 bg-(--bg-1) rounded-xl border border-(--border-1) animate-in fade-in slide-in-from-top-2">
            <p className="text-sm font-medium text-(--text-1) mb-3">
              Select level for <span className="font-bold text-(--button-1)">{skillToAddWithLevel}</span>
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {levelOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setNewSkillLevel(option.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    newSkillLevel === option.value
                      ? 'bg-(--button-1) text-(--button-1-text)'
                      : 'bg-(--bg-2) text-(--text-2) border border-(--border-1) hover:border-(--button-1)'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleConfirmAddSkill}
                disabled={!newSkillLevel}
                primary
                className="text-sm py-1.5"
              >
                Confirm
              </Button>
              <Button
                secondary
                type="button"
                onClick={() => {
                  setSkillToAddWithLevel('')
                  setNewSkillLevel('')
                }}
                className="text-sm py-1.5"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-2">
          {skills.length === 0 ? (
            <p className="text-(--text-2) text-sm italic">No skills added yet.</p>
          ) : (
            skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-3 bg-(--bg-1) rounded-xl border border-(--border-1)">
                <div>
                  <p className="font-semibold text-(--text-1)">{skill.name}</p>
                  {skill.level && (
                    <span className="text-xs text-(--text-2) uppercase tracking-wider">{skill.level}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="text-(--text-2) hover:text-red-500 p-2"
                >
                  <FiX />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Skills I Want to Learn */}
      <div>
        <h3 className="text-lg font-semibold text-(--text-1) mb-2">{t('skillsLearn')}</h3>
        <p className="text-sm text-(--text-2) mb-4">{t('selectSkillsYouLearn')}</p>

        <SkillSelector
          onAdd={handleAddWantedSkill}
          placeholder={t('searchOrAddSkillLearn')}
          recommendations={recommendedSkills}
        />

        <div className="mt-6 flex flex-wrap gap-2">
          {wantedSkills.length === 0 ? (
            <p className="text-(--text-2) text-sm italic">No wanted skills added yet.</p>
          ) : (
            wantedSkills.map((skill) => (
              <Badge
                key={skill.id}
                variant="warning"
                className="pl-3 pr-1 py-1.5 flex items-center gap-1 group bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => handleDeleteWantedSkill(skill.id)}
                  className="p-1 hover:text-red-500 rounded-full transition-colors"
                >
                  <FiX size={14} />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>
    </Card>
  )
}
