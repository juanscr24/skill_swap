'use client'
import { FiPlus } from "react-icons/fi"
import { SkillItem } from "./SkillItem"

interface SkillListProps {
    skills: Array<{
        id: string
        name: string | null
        level?: string | null
    }>
    onDelete?: (id: string) => void
    onAddClick?: () => void
    variant?: 'teach' | 'learn'
    emptyText: string
    showAddButton?: boolean
}

export const SkillList = ({
    skills,
    onDelete,
    onAddClick,
    variant = 'teach',
    emptyText,
    showAddButton = false
}: SkillListProps) => {
    const addButtonColor = variant === 'teach' ? 'hover:text-[#3B82F6] hover:border-[#3B82F6]' : 'hover:text-[#F59E0B] hover:border-[#F59E0B]'

    return (
        <div className="space-y-3">
            {skills.map((skill) => (
                <SkillItem
                    key={skill.id}
                    skill={skill}
                    onDelete={onDelete}
                    variant={variant}
                    showDelete={!!onDelete}
                />
            ))}

            {skills.length === 0 && !showAddButton && (
                <p className="text-(--text-2) text-sm italic text-center py-4">{emptyText}</p>
            )}

            {showAddButton && (
                <button
                    onClick={onAddClick}
                    className={`w-full px-4 py-3 rounded-xl border border-dashed border-(--border-1) text-(--text-2) ${addButtonColor} transition-all flex items-center justify-center gap-2`}
                >
                    <FiPlus size={16} /> Add Skill
                </button>
            )}
        </div>
    )
}
