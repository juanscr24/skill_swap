import { CardGuideProps } from "@/types"

export const CardGuide = ({ icon, title, description }: CardGuideProps) => {
    return (
        <div className="flex flex-col justify-center items-center gap-3 bg-(--bg-2) px-6 py-8 rounded-lg border border-(--border-1) hover:scale-101 transition-all duration-300 cursor-pointer">
            {icon}
            <h3 className="text-(--text-1) text-xl font-semibold mt-2">{title}</h3>
            <p className="text-(--text-2) text-center">{description}</p>
        </div>
    )
}
