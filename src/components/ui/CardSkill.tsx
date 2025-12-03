import { CardSkillProps } from "@/types"

export const CardSkill = ({ icon, skill }: CardSkillProps) => {
    return (
        <div className="flex items-center gap-4 bg-(--bg-2) p-4 rounded-lg border border-(--border-1) cursor-pointer hover:scale-101 transition-all duration-300">
            <div className="text-(--button-1) bg-(--bg-1)/60 rounded-md p-4">
                {icon}
            </div>
            <span className="text-(--text-1) font-semibold">{skill}</span>
        </div>
    )
}
