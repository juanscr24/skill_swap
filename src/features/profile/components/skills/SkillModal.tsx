'use client'
import { useState, useRef, useEffect } from "react"
import { FiSearch, FiPlus } from "react-icons/fi"
import { Modal } from "@/shared/components"
import { useTranslations } from "next-intl"
import { recommendedSkills } from "@/shared/constants/recommendedSkills"

interface SkillModalProps {
    isOpen: boolean
    onClose: () => void
    onAddSkill: (name: string, level: 'beginner' | 'intermediate' | 'advanced' | 'expert') => Promise<void>
    existingSkills: Array<{ name: string | null }>
}

export const SkillModal = ({
    isOpen,
    onClose,
    onAddSkill,
    existingSkills
}: SkillModalProps) => {
    const t = useTranslations('profile')
    const [skillInput, setSkillInput] = useState('')
    const [selectedLevel, setSelectedLevel] = useState('')
    const [showRecommendations, setShowRecommendations] = useState(false)
    const [showLevelSelection, setShowLevelSelection] = useState(false)
    const modalRef = useRef<HTMLDivElement>(null)

    const skillLevels = [
        { value: 'beginner', label: t('beginner'), color: 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20' },
        { value: 'intermediate', label: t('intermediate'), color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' },
        { value: 'advanced', label: t('advanced'), color: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' },
        { value: 'expert', label: 'Expert', color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' }
    ]

    const filteredRecommendations = recommendedSkills.filter(skill =>
        skill.toLowerCase().includes(skillInput.toLowerCase()) &&
        !existingSkills.some(s => s.name?.toLowerCase() === skill.toLowerCase())
    ).slice(0, 8)

    const isCustomSkill = skillInput.trim() &&
        filteredRecommendations.length === 0 ||
        !filteredRecommendations.some(skill => skill.toLowerCase() === skillInput.toLowerCase())

    const handleSelectSkill = (name: string) => {
        setSkillInput(name)
        setShowRecommendations(false)
        setShowLevelSelection(true)
    }

    const handleAdd = async () => {
        if (!skillInput.trim() || !selectedLevel) return
        await onAddSkill(skillInput.trim(), selectedLevel as any)
        handleCancel()
    }

    const handleCancel = () => {
        setSkillInput('')
        setSelectedLevel('')
        setShowRecommendations(false)
        setShowLevelSelection(false)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleCancel} title="Add Skill to Teach">
            <div className="space-y-4 p-1">
                {!showLevelSelection ? (
                    <div className="space-y-4">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-2)" />
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => {
                                    setSkillInput(e.target.value)
                                    setShowRecommendations(true)
                                }}
                                onFocus={() => setShowRecommendations(true)}
                                placeholder={t('searchOrAddSkillTeach')}
                                className="w-full pl-10 pr-4 py-3 bg-(--bg-1) border border-(--border-1) rounded-xl text-(--text-1) placeholder:text-(--text-2) focus:outline-none focus:border-[#3B82F6]"
                                autoFocus
                            />
                        </div>

                        {showRecommendations && (skillInput.trim() || filteredRecommendations.length > 0) && (
                            <div className="bg-(--bg-1) border border-(--border-1) rounded-xl overflow-hidden">
                                {filteredRecommendations.map((skill) => (
                                    <button
                                        key={skill}
                                        onClick={() => handleSelectSkill(skill)}
                                        className="w-full px-4 py-3 text-left text-(--text-1) hover:bg-(--bg-2) transition-colors border-b border-(--border-1) last:border-b-0"
                                    >
                                        {skill}
                                    </button>
                                ))}
                                {isCustomSkill && skillInput.trim() && (
                                    <button
                                        onClick={() => handleSelectSkill(skillInput)}
                                        className="w-full px-4 py-3 text-left text-(--button-1) hover:bg-(--bg-2) transition-colors flex items-center gap-2 font-medium"
                                    >
                                        <FiPlus size={16} />
                                        {t('addCustomSkill')}: "{skillInput}"
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <p className="text-sm font-medium text-(--text-1)">
                            Select level for <span className="font-bold text-[#3B82F6]">{skillInput}</span>
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {skillLevels.map((level) => (
                                <button
                                    key={level.value}
                                    type="button"
                                    onClick={() => setSelectedLevel(level.value)}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${selectedLevel === level.value
                                        ? level.color
                                        : 'bg-(--bg-1) text-(--text-2) border-(--border-1) hover:border-[#3B82F6]'
                                        }`}
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={handleAdd}
                                disabled={!selectedLevel}
                                className="flex-1 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                            >
                                Add Skill
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowLevelSelection(false)}
                                className="px-4 py-2 bg-(--bg-1) text-(--text-2) rounded-lg hover:text-(--text-1) border border-(--border-1) transition-colors"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}
