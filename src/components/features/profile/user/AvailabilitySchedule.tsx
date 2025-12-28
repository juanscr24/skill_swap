import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/Badge"

interface AvailabilityScheduleProps {
    availability: {
        [key: string]: string
    } | null
}

export const AvailabilitySchedule = ({ availability }: AvailabilityScheduleProps) => {
    const t = useTranslations('profile')

    const days = ['mon', 'tue', 'wed', 'thu', 'fri']

    // Mock default availability if none provided for visualization
    const schedule = availability || {
        mon: '6pm - 9pm',
        tue: 'Busy',
        wed: '6pm - 8pm',
        thu: 'Busy',
        fri: '4pm - 6pm'
    }

    const isBusy = (time: string) => time.toLowerCase() === 'busy'

    return (
        <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1)">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-(--text-1)">{t('weeklyAvailability')}</h2>
                <Badge variant="success" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs font-bold px-3 py-1 uppercase tracking-wider">
                    {t('acceptingRequests')}
                </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {days.map((day) => {
                    const time = schedule[day] || 'Busy'
                    const busy = isBusy(time)

                    return (
                        <div key={day} className={`rounded-xl p-4 border text-center flex flex-col items-center justify-center min-h-[100px] ${busy ? 'bg-(--bg-1) border-(--border-1) opacity-50' : 'bg-[#3B82F6]/5 border-[#3B82F6]/20'}`}>
                            <span className={`text-xs font-bold uppercase mb-2 ${busy ? 'text-(--text-2)' : 'text-[#3B82F6]'}`}>
                                {t(`days.${day}`)}
                            </span>
                            <span className={`text-sm font-medium ${busy ? 'text-(--text-2)' : 'text-(--text-1)'}`}>
                                {time}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
