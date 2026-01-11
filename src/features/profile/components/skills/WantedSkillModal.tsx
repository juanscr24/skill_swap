'use client'
import { useState } from "react"
import { FiSearch, FiPlus } from "react-icons/fi"
import { Modal } from "@/shared/components"
import { useTranslations } from "next-intl"
import { recommendedSkills } from "@/shared/constants/recommendedSkills"

interface WantedSkillModalProps {
    isOpen: boolean
    onClose: () => void
    onAddSkill: (name: string) => Promise<void>
    existingSkills: Array<{ name: string | null }>
}

export const WantedSkillModal = ({
    isOpen,
    onClose,
    onAddSkill,
    existingSkills
}: WantedSkillModalProps) => {
    const t = useTranslations('profile')
    const [skillInput, setSkillInput] = useState('')
    const [showRecommendations, setShowRecommendations] = useState(false)

    const filteredRecommendations = recommendedSkills.filter(skill =>
        skill.toLowerCase().includes(skillInput.toLowerCase()) &&
        !existingSkills.some(s => s.name?.toLowerCase() === skill.toLowerCase())
    ).slice(0, 8)

    const isCustomSkill = skillInput.trim() &&
        filteredRecommendations.length === 0 ||
        !filteredRecommendations.some(skill => skill.toLowerCase() === skillInput.toLowerCase())

    const handleAdd = async (name?: string) => {
        const skillToAdd = name || skillInput
        if (!skillToAdd.trim()) return
        await onAddSkill(skillToAdd.trim())
        handleCancel()
    }

    const handleCancel = () => {
        setSkillInput('')
        setShowRecommendations(false)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleCancel} title="Add Skill to Learn">
            <div className="space-y-4 p-1">
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAdd()
                        }}
                        placeholder={t('searchOrAddSkillLearn')}
                        className="w-full pl-10 pr-4 py-3 bg-(--bg-1) border border-(--border-1) rounded-xl text-(--text-1) placeholder:text-(--text-2) focus:outline-none focus:border-[#F59E0B]"
                        autoFocus
                    />
                </div>

                {showRecommendations && (skillInput.trim() || filteredRecommendations.length > 0) && (
                    <div className="bg-(--bg-1) border border-(--border-1) rounded-xl overflow-hidden">
                        {filteredRecommendations.map((skill) => (
                            <button
                                key={skill}
                                onClick={() => handleAdd(skill)}
                                className="w-full px-4 py-3 text-left text-(--text-1) hover:bg-(--bg-2) transition-colors border-b border-(--border-1) last:border-b-0"
                            >
                                {skill}
                            </button>
                        ))}
                        {isCustomSkill && skillInput.trim() && (
                            <button
                                onClick={() => handleAdd()}
                                className="w-full px-4 py-3 text-left text-(--button-1) hover:bg-(--bg-2) transition-colors flex items-center gap-2 font-medium"
                            >
                                <FiPlus size={16} />
                                {t('addCustomSkill')}: "{skillInput}"
                            </button>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    )
}
