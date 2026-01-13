'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { FiPlus } from 'react-icons/fi'
import { Button } from '@/shared/components/ui/Button'

interface AvailabilityFormProps {
    onSubmit: (date: string, startTime: string, endTime: string) => Promise<void>
}

export const AvailabilityForm = ({ onSubmit }: AvailabilityFormProps) => {
    const t = useTranslations('sessions')
    const [newSlot, setNewSlot] = useState({
        date: '',
        startTime: '',
        endTime: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await onSubmit(newSlot.date, newSlot.startTime, newSlot.endTime)
            setNewSlot({ date: '', startTime: '', endTime: '' })
        } catch (error) {
            // Error handled by parent
        }
    }

    return (
        <div className="bg-(--bg-2) border border-(--border-1) rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-lg bg-(--button-1) flex items-center justify-center">
                    <FiPlus className="text-(--button-1-text) text-xl" />
                </div>
                <h2 className="text-xl font-semibold text-(--text-1)">
                    {t('addNewAvailability')}
                </h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm text-(--text-2)">{t('dayOfWeek')}</label>
                        <input
                            type="date"
                            value={newSlot.date}
                            onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-(--bg-1) border border-(--border-1) rounded-lg text-(--text-1) focus:outline-none focus:ring-2 focus:ring-(--button-1) transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-(--text-2)">{t('startTime')}</label>
                        <input
                            type="time"
                            value={newSlot.startTime}
                            onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-(--bg-1) border border-(--border-1) rounded-lg text-(--text-1) focus:outline-none focus:ring-2 focus:ring-(--button-1) transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-(--text-2)">{t('endTime')}</label>
                        <input
                            type="time"
                            value={newSlot.endTime}
                            onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-(--bg-1) border border-(--border-1) rounded-lg text-(--text-1) focus:outline-none focus:ring-2 focus:ring-(--button-1) transition-all"
                        />
                    </div>

                    <div className="flex items-end">
                        <Button
                            type="submit"
                            className="w-full py-3 bg-(--button-1) hover:opacity-90 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                        >
                            <FiPlus className="text-xl" />
                            {t('add')}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
