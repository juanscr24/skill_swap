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
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-(--text-1) mb-8">{t('scheduleSessions')}</h1>

            <Card>
                <form className="space-y-6">
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

                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="flex gap-4">
                        <Button primary className="flex-1 py-3">
                            {t('schedule')}
                        </Button>
                        <Button secondary className="px-8 py-3">
                            {t('cancel')}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
