'use client'
import { FiX } from "react-icons/fi"

interface SkillItemProps {
    skill: {
        id: string
        name: string | null
        level?: string | null
    }
    onDelete?: (id: string) => void
    variant?: 'teach' | 'learn'
    showDelete?: boolean
}

export const SkillItem = ({
    skill,
    onDelete,
    variant = 'teach',
    showDelete = false
}: SkillItemProps) => {
    const hoverBorderColor = variant === 'teach' ? 'hover:border-[#3B82F6]' : 'hover:border-[#F59E0B]'

    return (
        <div className={`flex items-center justify-between p-3 bg-(--bg-1) rounded-xl border border-(--border-1) group ${hoverBorderColor} transition-colors`}>
            <div className="flex items-center justify-between w-full">
                <p className="font-semibold text-(--text-1)">{skill.name}</p>
                {skill.level && (
                    <span className="text-xs text-(--text-2) uppercase italic tracking-wider">
                        {skill.level}
                    </span>
                )}
            </div>
            {showDelete && onDelete && (
                <button
                    onClick={() => onDelete(skill.id)}
                    className="text-(--text-2) hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <FiX size={16} />
                </button>
            )}
        </div>
    )
}
