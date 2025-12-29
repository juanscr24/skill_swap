import Link from "next/link"
import { useTranslations } from "next-intl"
import { FiUsers } from "react-icons/fi"

export const MoreMentorsCard = () => {
    const t = useTranslations('mentors')

    return (
        <Link href="/matching">
            <div className="bg-(--bg-2) border-2 border-dashed border-(--border-1) rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-(--button-1) cursor-pointer h-full flex flex-col items-center justify-center min-h-[400px] group">
                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-(--bg-1) flex items-center justify-center mb-4 group-hover:bg-(--button-1)/10 transition-colors duration-300">
                    <FiUsers className="w-10 h-10 text-(--text-2) group-hover:text-(--button-1) transition-colors duration-300" />
                </div>

                {/* Text */}
                <h3 className="text-xl font-bold text-(--text-1) text-center mb-2 group-hover:text-(--button-1) transition-colors duration-300">
                    {t('moreMentorsTitle')}
                </h3>

                <p className="text-(--text-2) text-sm text-center">
                    {t('moreMentorsSubtitle')}
                </p>
            </div>
        </Link>
    )
}
