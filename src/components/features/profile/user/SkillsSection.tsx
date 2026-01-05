import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import { useTranslations } from "next-intl"
import { FiPlus, FiBookOpen, FiZap, FiX, FiSearch } from "react-icons/fi"
import { recommendedSkills } from "@/constants/recommendedSkills"
import type { SkillsSectionProps } from '@/types'

export const SkillsSection = ({
    skillsTeach,
    skillsLearn,
    onAddSkill,
    onRemoveSkill,
    onAddWantedSkill,
    onRemoveWantedSkill
}: SkillsSectionProps) => {
    const t = useTranslations('profile')

    const [addingTeach, setAddingTeach] = useState(false)
    const [teachInput, setTeachInput] = useState('')
    const [selectedTeachLevel, setSelectedTeachLevel] = useState('')
    const [showTeachRecommendations, setShowTeachRecommendations] = useState(false)
    const [showTeachLevelSelection, setShowTeachLevelSelection] = useState(false)
    
    const [addingLearn, setAddingLearn] = useState(false)
    const [learnInput, setLearnInput] = useState('')
    const [showLearnRecommendations, setShowLearnRecommendations] = useState(false)

    const teachRef = useRef<HTMLDivElement>(null)
    const learnRef = useRef<HTMLDivElement>(null)

    const skillLevels = [
        { value: 'beginner', label: t('beginner'), color: 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20' },
        { value: 'intermediate', label: t('intermediate'), color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' },
        { value: 'advanced', label: t('advanced'), color: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' },
        { value: 'expert', label: 'Expert', color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' }
    ]

    // Filtrar recomendaciones
    const filteredTeachRecommendations = recommendedSkills.filter(skill =>
        skill.toLowerCase().includes(teachInput.toLowerCase()) &&
        !skillsTeach.some(s => s.name.toLowerCase() === skill.toLowerCase())
    ).slice(0, 8)

    const filteredLearnRecommendations = recommendedSkills.filter(skill =>
        skill.toLowerCase().includes(learnInput.toLowerCase()) &&
        !skillsLearn.some(s => s.name.toLowerCase() === skill.toLowerCase())
    ).slice(0, 8)

    // Cerrar dropdowns al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (teachRef.current && !teachRef.current.contains(event.target as Node)) {
                setShowTeachRecommendations(false)
            }
            if (learnRef.current && !learnRef.current.contains(event.target as Node)) {
                setShowLearnRecommendations(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelectTeachSkill = (skillName: string) => {
        setTeachInput(skillName)
        setShowTeachRecommendations(false)
        setShowTeachLevelSelection(true)
    }

    const handleAddTeach = async () => {
        if (!teachInput.trim() || !selectedTeachLevel || !onAddSkill) return
        await onAddSkill(teachInput.trim(), selectedTeachLevel as 'beginner' | 'intermediate' | 'advanced' | 'expert')
        setTeachInput('')
        setSelectedTeachLevel('')
        setAddingTeach(false)
        setShowTeachLevelSelection(false)
    }

    const handleCancelTeach = () => {
        setAddingTeach(false)
        setTeachInput('')
        setSelectedTeachLevel('')
        setShowTeachRecommendations(false)
        setShowTeachLevelSelection(false)
    }

    const handleAddLearn = async (skillName?: string) => {
        const skillToAdd = skillName || learnInput
        if (!skillToAdd.trim() || !onAddWantedSkill) return
        await onAddWantedSkill(skillToAdd.trim())
        setLearnInput('')
        setAddingLearn(false)
        setShowLearnRecommendations(false)
    }

    const isCustomTeachSkill = teachInput.trim() && 
        filteredTeachRecommendations.length === 0 ||
        !filteredTeachRecommendations.some(skill => skill.toLowerCase() === teachInput.toLowerCase())

    const isCustomLearnSkill = learnInput.trim() && 
        filteredLearnRecommendations.length === 0 ||
        !filteredLearnRecommendations.some(skill => skill.toLowerCase() === learnInput.toLowerCase())

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills I Teach Card */}
            <Card>
                <div className="flex items-center gap-2 mb-4">
                    <FiZap className="text-[#3B82F6]" size={20} />
                    <h3 className="text-lg font-bold text-(--text-1)">{t('skillsTeach')}</h3>
                </div>

                <div className="space-y-3">
                    {/* Existing Skills */}
                    {skillsTeach.map(skill => (
                        <div key={skill.id} className="flex items-center justify-between p-3 bg-(--bg-1) rounded-xl border border-(--border-1) group hover:border-[#3B82F6] transition-colors">
                            <div className="flex items-center justify-between w-full">
                                <p className="font-semibold text-(--text-1)">{skill.name}</p>
                                {skill.level && (
                                    <span className="text-xs text-(--text-2) uppercase italic tracking-wider">{skill.level}</span>
                                )}
                            </div>
                            {onRemoveSkill && (
                                <button
                                    onClick={() => onRemoveSkill(skill.id)}
                                    className="text-(--text-2) hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FiX size={16} />
                                </button>
                            )}
                        </div>
                    ))}

                    {skillsTeach.length === 0 && !addingTeach && (
                        <p className="text-(--text-2) text-sm italic text-center py-4">{t('noSkillsTeach')}</p>
                    )}

                    {/* Add Skill Input */}
                    {addingTeach ? (
                        <div ref={teachRef} className="space-y-3 p-4 bg-(--bg-1) rounded-xl border border-[#3B82F6]">
                            {/* Skill Search Input */}
                            {!showTeachLevelSelection && (
                                <div className="relative">
                                    <div className="relative">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-2)" />
                                        <input
                                            type="text"
                                            value={teachInput}
                                            onChange={(e) => {
                                                setTeachInput(e.target.value)
                                                setShowTeachRecommendations(true)
                                            }}
                                            onFocus={() => setShowTeachRecommendations(true)}
                                            placeholder={t('searchOrAddSkillTeach')}
                                            className="w-full pl-10 pr-10 py-3 bg-(--bg-2) border border-(--border-1) rounded-xl text-(--text-1) placeholder:text-(--text-2) focus:outline-none focus:border-[#3B82F6]"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleCancelTeach}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-2) hover:text-(--text-1)"
                                        >
                                            <FiX size={16} />
                                        </button>
                                    </div>

                                    {/* Recommendations Dropdown */}
                                    {showTeachRecommendations && (teachInput.trim() || filteredTeachRecommendations.length > 0) && (
                                        <div className="absolute z-50 w-full mt-2 bg-(--bg-2) border border-(--border-1) rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                            {filteredTeachRecommendations.map((skill) => (
                                                <button
                                                    key={skill}
                                                    type="button"
                                                    onClick={() => handleSelectTeachSkill(skill)}
                                                    className="w-full px-4 py-3 text-left text-(--text-1) hover:bg-(--bg-1) transition-colors border-b border-(--border-1) last:border-b-0"
                                                >
                                                    {skill}
                                                </button>
                                            ))}
                                            {isCustomTeachSkill && teachInput.trim() && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectTeachSkill(teachInput)}
                                                    className="w-full px-4 py-3 text-left text-(--button-1) hover:bg-(--bg-1) transition-colors flex items-center gap-2 font-medium"
                                                >
                                                    <FiPlus size={16} />
                                                    {t('addCustomSkill')}: "{teachInput}"
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Level Selection */}
                            {showTeachLevelSelection && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-(--text-1)">
                                            Select level for <span className="font-bold text-[#3B82F6]">{teachInput}</span>
                                        </p>
                                        <button
                                            onClick={() => {
                                                setShowTeachLevelSelection(false)
                                                setTeachInput('')
                                            }}
                                            className="text-(--text-2) hover:text-(--text-1)"
                                        >
                                            <FiX size={16} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {skillLevels.map((level) => (
                                            <button
                                                key={level.value}
                                                type="button"
                                                onClick={() => setSelectedTeachLevel(level.value)}
                                                className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                                    selectedTeachLevel === level.value
                                                        ? level.color
                                                        : 'bg-(--bg-2) text-(--text-2) border-(--border-1) hover:border-[#3B82F6]'
                                                }`}
                                            >
                                                {level.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleAddTeach}
                                            disabled={!selectedTeachLevel}
                                            className="flex-1 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                        >
                                            Add Skill
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancelTeach}
                                            className="px-4 py-2 bg-(--bg-2) text-(--text-2) rounded-lg hover:text-(--text-1) border border-(--border-1) transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => setAddingTeach(true)}
                            className="w-full px-4 py-3 rounded-xl border border-dashed border-(--border-1) text-(--text-2) hover:text-[#3B82F6] hover:border-[#3B82F6] transition-all flex items-center justify-center gap-2"
                        >
                            <FiPlus size={16} /> {t('addSkill')}
                        </button>
                    )}
                </div>
            </Card>

            {/* Skills I Want to Learn Card */}
            <Card>
                <div className="flex items-center gap-2 mb-4">
                    <FiBookOpen className="text-[#F59E0B]" size={20} />
                    <h3 className="text-lg font-bold text-(--text-1)">{t('skillsLearn')}</h3>
                </div>

                <div className="space-y-3">
                    {/* Existing Skills */}
                    {skillsLearn.map(skill => (
                        <div key={skill.id} className="flex items-center justify-between p-3 bg-(--bg-1) rounded-xl border border-(--border-1) group hover:border-[#F59E0B] transition-colors">
                            <p className="font-semibold text-(--text-1)">{skill.name}</p>
                            {onRemoveWantedSkill && (
                                <button
                                    onClick={() => onRemoveWantedSkill(skill.id)}
                                    className="text-(--text-2) hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FiX size={16} />
                                </button>
                            )}
                        </div>
                    ))}

                    {skillsLearn.length === 0 && !addingLearn && (
                        <p className="text-(--text-2) text-sm italic text-center py-4">{t('noSkillsLearn')}</p>
                    )}

                    {/* Add Skill Input */}
                    {addingLearn ? (
                        <div ref={learnRef} className="relative">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-2)" />
                                <input
                                    type="text"
                                    value={learnInput}
                                    onChange={(e) => {
                                        setLearnInput(e.target.value)
                                        setShowLearnRecommendations(true)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddLearn()
                                        if (e.key === 'Escape') {
                                            setAddingLearn(false)
                                            setLearnInput('')
                                        }
                                    }}
                                    onFocus={() => setShowLearnRecommendations(true)}
                                    placeholder={t('searchOrAddSkillLearn')}
                                    className="w-full pl-10 pr-10 py-3 bg-(--bg-1) border border-[#F59E0B] rounded-xl text-(--text-1) placeholder:text-(--text-2) focus:outline-none"
                                    autoFocus
                                />
                                <button
                                    onClick={() => {
                                        setAddingLearn(false)
                                        setLearnInput('')
                                        setShowLearnRecommendations(false)
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-2) hover:text-(--text-1)"
                                >
                                    <FiX size={16} />
                                </button>
                            </div>

                            {/* Recommendations Dropdown */}
                            {showLearnRecommendations && (learnInput.trim() || filteredLearnRecommendations.length > 0) && (
                                <div className="absolute z-50 w-full mt-2 bg-(--bg-2) border border-(--border-1) rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                    {filteredLearnRecommendations.map((skill) => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => handleAddLearn(skill)}
                                            className="w-full px-4 py-3 text-left text-(--text-1) hover:bg-(--bg-1) transition-colors border-b border-(--border-1) last:border-b-0"
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                    {isCustomLearnSkill && learnInput.trim() && (
                                        <button
                                            type="button"
                                            onClick={() => handleAddLearn()}
                                            className="w-full px-4 py-3 text-left text-(--button-1) hover:bg-(--bg-1) transition-colors flex items-center gap-2 font-medium"
                                        >
                                            <FiPlus size={16} />
                                            {t('addCustomSkill')}: "{learnInput}"
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => setAddingLearn(true)}
                            className="w-full px-4 py-3 rounded-xl border border-dashed border-(--border-1) text-(--text-2) hover:text-[#F59E0B] hover:border-[#F59E0B] transition-all flex items-center justify-center gap-2"
                        >
                            <FiPlus size={16} /> {t('addSkill')}
                        </button>
                    )}
                </div>
            </Card>
        </div>
    )
}
