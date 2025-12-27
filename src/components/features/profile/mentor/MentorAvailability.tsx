import { useTranslations } from "next-intl"
import { FiCalendar, FiClock, FiChevronRight } from "react-icons/fi"

interface AvailabilitySlot {
    date: string
    time: string
}

interface MentorAvailabilityProps {
    availability: {
        [key: string]: string
    } | null
    upcomingSlots?: AvailabilitySlot[]
}

export const MentorAvailability = ({ availability, upcomingSlots = [] }: MentorAvailabilityProps) => {
    const t = useTranslations('profile')

    // Generate some example upcoming slots if none provided
    const defaultSlots: AvailabilitySlot[] = [
        { date: 'Mañana, 14 Oct', time: '10:00 - 11:00AM' },
        { date: 'Jueves, 16 Oct', time: '14:00 - 15:00PM' },
    ]

    const slots = upcomingSlots.length > 0 ? upcomingSlots : defaultSlots

    return (
        <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1)">
            <div className="flex items-center gap-2 mb-4">
                <FiCalendar className="text-(--button-1)" size={20} />
                <h2 className="text-lg font-bold text-(--text-1)">{t('nextAvailability')}</h2>
            </div>

            <div className="space-y-3 mb-4">
                {slots.map((slot, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-(--bg-1) rounded-lg border border-(--border-1) hover:border-(--button-1) transition-colors cursor-pointer"
                    >
                        <div>
                            <p className="text-(--text-1) font-medium text-sm">{slot.date}</p>
                            <p className="text-(--text-2) text-xs flex items-center gap-1 mt-1">
                                <FiClock size={12} />
                                {slot.time}
                            </p>
                        </div>
                        <FiChevronRight className="text-(--text-2)" />
                    </div>
                ))}
            </div>

            <button className="w-full text-(--button-1) text-sm font-medium hover:underline flex items-center justify-center gap-1">
                {t('viewFullCalendar')}
                <FiChevronRight size={14} />
            </button>
        </div>
    )
}
