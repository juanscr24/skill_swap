'use client'
import { Language } from "@/shared/types"
import { LanguageItem } from "./LanguageItem"
import { FiPlus } from "react-icons/fi"

interface LanguageListProps {
    languages: Language[]
    onDelete?: (id: string) => void
    onAddClick?: () => void
    showAddButton?: boolean
}

export const LanguageList = ({
    languages,
    onDelete,
    onAddClick,
    showAddButton = false
}: LanguageListProps) => {
    if (languages.length === 0) {
        return (
            <div className="space-y-3">
                <p className="text-(--text-2) text-sm italic text-center py-4">No languages added yet.</p>
                {showAddButton && (
                    <button
                        onClick={onAddClick}
                        className="w-full px-4 py-3 rounded-xl border border-dashed border-(--border-1) text-(--text-2) hover:text-(--button-1) hover:border-(--button-1) transition-all flex items-center justify-center gap-2"
                    >
                        <FiPlus size={16} /> Add Language
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {languages.map((language) => (
                <LanguageItem
                    key={language.id}
                    language={language}
                    onDelete={onDelete}
                    showDelete={!!onDelete}
                />
            ))}
            {showAddButton && (
                <button
                    onClick={onAddClick}
                    className="w-full px-4 py-3 rounded-xl border border-dashed border-(--border-1) text-(--text-2) hover:text-(--button-1) hover:border-(--button-1) transition-all flex items-center justify-center gap-2"
                >
                    <FiPlus size={16} /> Add Language
                </button>
            )}
        </div>
    )
}
