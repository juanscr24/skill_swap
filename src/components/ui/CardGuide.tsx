import { CardGuideProps } from "@/types"

export const CardGuide = ({ icon, title, description }: CardGuideProps) => {
    return (
        <div className="flex flex-col justify-center items-center gap-3 max-sm:gap-2 bg-(--bg-2) px-6 max-md:px-4 max-sm:px-3 py-8 max-md:py-6 max-sm:py-4 rounded-lg border border-(--border-1) hover:scale-101 transition-all duration-300 cursor-pointer">
            <div className="max-sm:[&>svg]:w-5 max-sm:[&>svg]:h-5">
                {icon}
            </div>
            <h3 className="text-(--text-1) text-xl max-md:text-lg max-sm:text-base font-semibold mt-2 max-sm:mt-1 text-center">{title}</h3>
            <p className="text-(--text-2) text-center text-sm max-sm:text-xs">{description}</p>
        </div>
    )
}
