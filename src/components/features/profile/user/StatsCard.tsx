import { IconType } from "react-icons"

interface StatsCardProps {
    icon: IconType
    value: number
    label: string
    color: string
    bgColor: string
}

export const StatsCard = ({ icon: Icon, value, label, color, bgColor }: StatsCardProps) => {
    return (
        <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1) flex flex-col items-start gap-4 flex-1">
            <div className={`p-3 rounded-full ${bgColor}`}>
                <Icon size={24} className={color} />
            </div>
            <div>
                <h4 className="text-3xl font-bold text-(--text-1) mb-1">{value}</h4>
                <p className="text-(--text-2) text-xs font-bold uppercase tracking-wider">{label}</p>
            </div>
        </div>
    )
}
