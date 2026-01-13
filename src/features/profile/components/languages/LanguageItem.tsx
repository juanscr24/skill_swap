'use client'
import { Language } from "@/shared/types"
import { FiX } from "react-icons/fi"

interface LanguageItemProps {
    language: Language
    onDelete?: (id: string) => void
    showDelete?: boolean
}

export const LanguageItem = ({ language, onDelete, showDelete = false }: LanguageItemProps) => {
    const getLevelStyles = (level: string) => {
        switch (level.toLowerCase()) {
            case 'native':
                return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
            case 'professional':
                return 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
            case 'intermediate':
                return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
            case 'basic':
                return 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20'
            default:
                return 'bg-(--bg-1) text-(--text-2) border-(--border-1)'
        }
    }

    const getLanguageFlag = (languageName: string): string => {
        const flags: Record<string, string> = {
            'Spanish': '🇪🇸',
            'English': '🇬🇧',
            'French': '🇫🇷',
            'German': '🇩🇪',
            'Italian': '🇮🇹',
            'Portuguese': '🇵🇹',
            'Chinese': '🇨🇳',
            'Japanese': '🇯🇵',
            'Korean': '🇰🇷',
            'Russian': '🇷🇺',
            'Arabic': '🇸🇦',
            'Hindi': '🇮🇳',
            'Dutch': '🇳🇱',
            'Swedish': '🇸🇪',
            'Norwegian': '🇳🇴',
            'Danish': '🇩🇰',
            'Finnish': '🇫🇮',
            'Polish': '🇵🇱',
            'Turkish': '🇹🇷',
            'Greek': '🇬🇷',
        }
        return flags[languageName] || '🌐'
    }

    return (
        <div
            className="flex items-center justify-between p-3 bg-(--bg-1) rounded-xl border border-(--border-1) group hover:border-(--button-1) transition-colors"
        >
            <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{getLanguageFlag(language.name)}</span>
                <div className="flex-1">
                    <p className="font-semibold text-(--text-1)">{language.name}</p>
                    {language.level && (
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-md border ${getLevelStyles(language.level)}`}>
                            {language.level.charAt(0).toUpperCase() + language.level.slice(1)}
                        </span>
                    )}
                </div>
            </div>
            {showDelete && onDelete && (
                <button
                    onClick={() => onDelete(language.id)}
                    className="text-(--text-2) hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <FiX size={16} />
                </button>
            )}
        </div>
    )
}
