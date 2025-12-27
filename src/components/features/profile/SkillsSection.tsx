import { useState } from "react"
import { Badge } from "@/components/ui/Badge"
import { useTranslations } from "next-intl"
import { FiPlus, FiBookOpen, FiZap, FiX, FiCheck } from "react-icons/fi"
import { useProfile } from "@/hooks/useProfile"

interface Skill {
    id: string
    name: string
    level?: string | null
}

interface SkillsSectionProps {
    skillsTeach: Skill[]
    skillsLearn: Skill[]
    onAddSkill: (name: string, level?: string) => Promise<any>
    onRemoveSkill: (id: string) => Promise<any>
    onAddWantedSkill: (name: string) => Promise<any>
    onRemoveWantedSkill: (id: string) => Promise<any>
}

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
    const [addingLearn, setAddingLearn] = useState(false)
    const [learnInput, setLearnInput] = useState('')

    const handleAddTeach = async () => {
        if (!teachInput.trim()) return
        await onAddSkill(teachInput)
        setTeachInput('')
        setAddingTeach(false)
    }

    const handleAddLearn = async () => {
        if (!learnInput.trim()) return
        await onAddWantedSkill(learnInput)
        setLearnInput('')
        setAddingLearn(false)
    }

    return (
        <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1) mb-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-(--text-1)">{t('skillsExpertise')}</h2>
            </div>

            <div className="mb-8">
                <h3 className="text-sm font-bold text-(--text-2) uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiZap className="text-(--text-2)" />
                    {t('skillsTeach')}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {skillsTeach.length > 0 &&
                        skillsTeach.map(skill => (
                            <Badge key={skill.id} variant="info" className="px-3 py-1.5 bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20 hover:bg-[#3B82F6]/20 transition-colors cursor-default flex items-center gap-1 group">
                                {skill.name} {skill.level ? `• ${skill.level}` : ''}
                                <button
                                    onClick={() => onRemoveSkill(skill.id)}
                                    className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                >
                                    <FiX size={12} />
                                </button>
                            </Badge>
                        ))
                    }

                    {addingTeach ? (
                        <div className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
                            <input
                                type="text"
                                value={teachInput}
                                onChange={(e) => setTeachInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTeach()}
                                placeholder="Skill name..."
                                className="bg-(--bg-1) text-(--text-1) text-xs rounded-full px-3 py-1.5 border border-[#3B82F6] focus:outline-none w-32"
                                autoFocus
                            />
                            <button onClick={handleAddTeach} className="text-[#3B82F6] hover:text-[#2563EB] p-1"><FiCheck size={14} /></button>
                            <button onClick={() => setAddingTeach(false)} className="text-(--text-2) hover:text-(--text-1) p-1"><FiX size={14} /></button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setAddingTeach(true)}
                            className="px-3 py-1.5 rounded-full border border-dashed border-(--border-1) text-(--text-2) text-sm hover:text-(--text-1) hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all flex items-center gap-1"
                        >
                            <FiPlus size={14} /> {t('add')}
                        </button>
                    )}
                </div>
                {skillsTeach.length === 0 && !addingTeach && (
                    <p className="text-(--text-2) text-sm italic mt-2">{t('noSkillsTeach')}</p>
                )}
            </div>

            <div>
                <h3 className="text-sm font-bold text-(--text-2) uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiBookOpen className="text-(--text-2)" />
                    {t('skillsLearn')}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {skillsLearn.length > 0 &&
                        skillsLearn.map(skill => (
                            <Badge key={skill.id} variant="warning" className="px-3 py-1.5 bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20 hover:bg-[#F59E0B]/20 transition-colors cursor-default flex items-center gap-1 group">
                                {skill.name}
                                <button
                                    onClick={() => onRemoveWantedSkill(skill.id)}
                                    className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                >
                                    <FiX size={12} />
                                </button>
                            </Badge>
                        ))
                    }

                    {addingLearn ? (
                        <div className="flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200">
                            <input
                                type="text"
                                value={learnInput}
                                onChange={(e) => setLearnInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddLearn()}
                                placeholder="Skill name..."
                                className="bg-(--bg-1) text-(--text-1) text-xs rounded-full px-3 py-1.5 border border-[#F59E0B] focus:outline-none w-32"
                                autoFocus
                            />
                            <button onClick={handleAddLearn} className="text-[#F59E0B] hover:text-[#D97706] p-1"><FiCheck size={14} /></button>
                            <button onClick={() => setAddingLearn(false)} className="text-(--text-2) hover:text-(--text-1) p-1"><FiX size={14} /></button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setAddingLearn(true)}
                            className="px-3 py-1.5 rounded-full border border-dashed border-(--border-1) text-(--text-2) text-sm hover:text-(--text-1) hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all flex items-center gap-1"
                        >
                            <FiPlus size={14} /> {t('add')}
                        </button>
                    )}
                </div>
                {skillsLearn.length === 0 && !addingLearn && (
                    <p className="text-(--text-2) text-sm italic mt-2">{t('noSkillsLearn')}</p>
                )}
            </div>
        </div>
    )
}
