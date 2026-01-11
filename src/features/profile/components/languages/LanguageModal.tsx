'use client'
import { useState, useRef, useEffect } from "react"
import { Modal } from "@/shared/components/feedback/Modal"
import { FiPlus, FiX, FiSearch } from "react-icons/fi"
import { recommendedLanguages } from "@/shared/constants/recommendedLanguages"

interface LanguageModalProps {
    isOpen: boolean
    onClose: () => void
    onAddLanguage: (data: { name: string; level: string }) => Promise<{ success: boolean }>
    existingLanguages: { name: string }[]
}

export const LanguageModal = ({
    isOpen,
    onClose,
    onAddLanguage,
    existingLanguages
}: LanguageModalProps) => {
    const [languageInput, setLanguageInput] = useState('')
    const [selectedLevel, setSelectedLevel] = useState('')
    const [showRecommendations, setShowRecommendations] = useState(false)
    const [showLevelSelection, setShowLevelSelection] = useState(false)
    const recommendationsRef = useRef<HTMLDivElement>(null)

    const languageLevels = [
        { value: 'native', label: 'Native', color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' },
        { value: 'professional', label: 'Professional', color: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' },
        { value: 'intermediate', label: 'Intermediate', color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' },
        { value: 'basic', label: 'Basic', color: 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20' }
    ]

    const filteredLanguages = recommendedLanguages.filter(lang =>
        lang.toLowerCase().includes(languageInput.toLowerCase()) &&
        !existingLanguages.some(l => l.name.toLowerCase() === lang.toLowerCase())
    ).slice(0, 8)

    const isCustomLanguage = languageInput.trim() &&
        filteredLanguages.length === 0 ||
        !filteredLanguages.some(lang => lang.toLowerCase() === languageInput.toLowerCase())

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (recommendationsRef.current && !recommendationsRef.current.contains(event.target as Node)) {
                setShowRecommendations(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelectLanguage = (languageName: string) => {
        setLanguageInput(languageName)
        setShowRecommendations(false)
        setShowLevelSelection(true)
    }

    const handleAdd = async () => {
        if (!languageInput.trim() || !selectedLevel) return
        const result = await onAddLanguage({
            name: languageInput.trim(),
            level: selectedLevel
        })
        if (result.success) {
            handleCancel()
        }
    }

    const handleCancel = () => {
        setLanguageInput('')
        setSelectedLevel('')
        setShowRecommendations(false)
        setShowLevelSelection(false)
        onClose()
    }

    const getLanguageFlag = (language: string): string => {
        const flags: Record<string, string> = {
            'Spanish': '🇪🇸', 'English': '🇬🇧', 'French': '🇫🇷', 'German': '🇩🇪',
            'Italian': '🇮🇹', 'Portuguese': '🇵🇹', 'Chinese': '🇨🇳', 'Japanese': '🇯🇵',
            'Korean': '🇰🇷', 'Russian': '🇷🇺', 'Arabic': '🇸🇦', 'Hindi': '🇮🇳',
            'Dutch': '🇳🇱', 'Swedish': '🇸🇪', 'Norwegian': '🇳🇴', 'Danish': '🇩🇰',
            'Finnish': '🇫🇮', 'Polish': '🇵🇱', 'Turkish': '🇹🇷', 'Greek': '🇬🇷',
        }
        return flags[language] || '🌐'
    }

    return (
        <Modal isOpen={isOpen} onClose={handleCancel} title="Add Language">
            <div className="space-y-4 p-1">
                {!showLevelSelection ? (
                    <div className="relative" ref={recommendationsRef}>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-2)" />
                            <input
                                type="text"
                                value={languageInput}
                                onChange={(e) => {
                                    setLanguageInput(e.target.value)
                                    setShowRecommendations(true)
                                }}
                                onFocus={() => setShowRecommendations(true)}
                                placeholder="Search language..."
                                className="w-full pl-10 pr-10 py-3 bg-(--bg-2) border border-(--border-1) rounded-xl text-(--text-1) placeholder:text-(--text-2) focus:outline-none focus:border-(--button-1)"
                                autoFocus
                            />
                        </div>

                        {showRecommendations && (languageInput.trim() || filteredLanguages.length > 0) && (
                            <div className="absolute z-50 w-full mt-2 bg-(--bg-2) border border-(--border-1) rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {filteredLanguages.map((lang) => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => handleSelectLanguage(lang)}
                                        className="w-full px-4 py-3 text-left text-(--text-1) hover:bg-(--bg-1) transition-colors border-b border-(--border-1) last:border-b-0 flex items-center gap-3"
                                    >
                                        <span className="text-xl">{getLanguageFlag(lang)}</span>
                                        {lang}
                                    </button>
                                ))}
                                {isCustomLanguage && languageInput.trim() && (
                                    <button
                                        type="button"
                                        onClick={() => handleSelectLanguage(languageInput)}
                                        className="w-full px-4 py-3 text-left text-(--button-1) hover:bg-(--bg-1) transition-colors flex items-center gap-2 font-medium"
                                    >
                                        <FiPlus size={16} />
                                        Add custom: "{languageInput}"
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-(--text-1)">
                                Select level for <span className="font-bold text-(--button-1)">{languageInput}</span>
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {languageLevels.map((level) => (
                                <button
                                    key={level.value}
                                    type="button"
                                    onClick={() => setSelectedLevel(level.value)}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${selectedLevel === level.value
                                        ? level.color
                                        : 'bg-(--bg-2) text-(--text-2) border-(--border-1) hover:border-(--button-1)'
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
                                className="flex-1 px-4 py-2 bg-(--button-1) text-(--button-1-text) rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium"
                            >
                                Add Language
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowLevelSelection(false)}
                                className="px-4 py-2 bg-(--bg-2) text-(--text-2) rounded-lg hover:text-(--text-1) border border-(--border-1) transition-colors"
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
