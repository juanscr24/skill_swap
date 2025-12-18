'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card } from "@/components/ui/Card"
import { Button, Input } from "@/components"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { mockUsers } from "@/constants/mockUsers"

export const ScheduleSessionView = () => {
    const t = useTranslations('sessions')
    const [selectedMentor, setSelectedMentor] = useState('')

    const mentors = mockUsers.filter(user => user.role === 'MENTOR')
    const mentorOptions = mentors.map(mentor => ({
        value: mentor.id,
        label: mentor.name
    }))

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4 max-w-3xl mx-auto">
            <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-8 max-md:mb-6 max-sm:mb-4">{t('scheduleSessions')}</h1>

            <Card>
                <form className="space-y-6 max-md:space-y-4 max-sm:space-y-3">
                    <Select
                        label={t('selectMentor')}
                        options={mentorOptions}
                        placeholder={t('selectMentor')}
                        value={selectedMentor}
                        onChange={(e) => setSelectedMentor(e.target.value)}
                    />

                    <Input
                        type="text"
                        label={t('title')}
                        id="title"
                        placeholder="Ej: Introducción a React Hooks"
                    />

                    <Textarea
                        label={t('description')}
                        id="description"
                        placeholder={t('description')}
                        rows={4}
                    />

                    <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 max-sm:gap-3">
                        <Input
                            type="date"
                            label={t('date')}
                            id="date"
                        />
                        <Input
                            type="time"
                            label={t('time')}
                            id="time"
                        />
                    </div>

                    <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 max-sm:gap-3">
                        <Input
                            type="number"
                            label={`${t('duration')} (${t('hours')})`}
                            id="hours"
                            placeholder="1"
                        />
                        <Input
                            type="number"
                            label={`${t('duration')} (${t('minutes')})`}
                            id="minutes"
                            placeholder="30"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 max-sm:gap-3">
                        <Button primary className="flex-1 py-3 max-sm:py-2">
                            {t('schedule')}
                        </Button>
                        <Button secondary className="px-8 max-sm:px-4 py-3 max-sm:py-2">
                            {t('cancel')}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
