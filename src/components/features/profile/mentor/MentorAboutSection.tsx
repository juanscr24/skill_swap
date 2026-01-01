import { useTranslations } from "next-intl"
import { FiUser } from "react-icons/fi"
import type { MentorAboutSectionProps } from '@/types'

export const MentorAboutSection = ({ bio }: MentorAboutSectionProps) => {
    const t = useTranslations('profile')

    return (
        <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1)">
            <div className="flex items-center gap-2 mb-4">
                <FiUser className="text-(--button-1)" size={20} />
                <h2 className="text-xl font-bold text-(--text-1)">{t('aboutMe')}</h2>
            </div>
            <p className="text-(--text-2) leading-relaxed whitespace-pre-line">
                {bio || 'No bio provided yet.'}
            </p>
        </div>
    )
}
