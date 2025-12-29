'use client'
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button, Input } from "@/components"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { useMentors, useAvailability } from "@/hooks"
import { FiLoader, FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi"
import Link from "next/link"

export const ScheduleSessionView = () => {
    const t = useTranslations('sessions')
    const router = useRouter()
    const { mentors, isLoading: loadingMentors } = useMentors({})

    const [selectedMentor, setSelectedMentor] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [selectedAvailability, setSelectedAvailability] = useState('')
    const [duration, setDuration] = useState('30')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const { availability, isLoading: loadingAvailability } = useAvailability(selectedMentor || undefined)

    const mentorOptions = mentors.map(mentor => ({
        value: mentor.id,
        label: mentor.name || mentor.email
    }))

    const availableSlots = availability.filter(slot => !slot.is_booked)

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')

        // Validaciones
        if (!selectedMentor) {
            setError('Por favor selecciona un mentor')
            return
        }
        if (!title.trim()) {
            setError('Por favor ingresa un título')
            return
        }
        if (!selectedAvailability) {
            setError('Por favor selecciona un horario disponible')
            return
        }

        const durationNum = parseInt(duration)
        if (durationNum < 30) {
            setError(t('minimumDuration'))
            return
        }

        if (durationNum % 10 !== 0) {
            setError(t('invalidTimeFormat'))
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/sessions/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mentor_id: selectedMentor,
                    availability_id: selectedAvailability,
                    title,
                    description: description.trim() || undefined,
                    duration_minutes: durationNum,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Error al solicitar la sesión')
            }

            setSuccessMessage('¡Solicitud de sesión enviada correctamente! Redirigiendo...')
            setTimeout(() => {
                router.push('/sessions')
            }, 1500)

        } catch (err: any) {
            console.error('Error scheduling session:', err)
            setError(err.message || 'Error al solicitar la sesión. Intenta de nuevo.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        router.push('/sessions')
    }

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 max-md:mb-6 max-sm:mb-4 gap-4">
                <h1 className="text-4xl max-md:text-3xl max-sm:text-2xl font-bold text-(--text-1)">{t('scheduleSessions')}</h1>
                <Link href="/sessions">
                    <Button secondary className="flex items-center gap-2 max-sm:gap-1 shadow-sm">
                        <FiArrowLeft className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                        {t('back')}
                    </Button>
                </Link>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded-lg shadow-sm">
                    <p className="text-green-800 dark:text-green-200 font-semibold">{successMessage}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg shadow-sm">
                    <p className="text-red-800 dark:text-red-200 font-semibold">{error}</p>
                </div>
            )}

            <Card className="shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6 max-md:space-y-5 max-sm:space-y-4">
                    {loadingMentors ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <FiLoader className="w-8 h-8 animate-spin text-(--button-1)" />
                            <span className="text-(--text-2) font-medium">Cargando mentores...</span>
                        </div>
                    ) : mentors.length === 0 ? (
                        <div className="text-center py-8 px-4 bg-(--bg-1) rounded-lg border-2 border-dashed border-(--border-1)">
                            <p className="text-(--text-2) font-medium mb-2">No hay mentores disponibles</p>
                            <p className="text-(--text-2) text-sm">Intenta de nuevo más tarde</p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <Select
                                    label={t('selectMentor')}
                                    options={[
                                        { value: '', label: t('selectMentor') },
                                        ...mentorOptions
                                    ]}
                                    value={selectedMentor}
                                    onChange={(e) => {
                                        setSelectedMentor(e.target.value)
                                        setSelectedAvailability('') // Reset availability when mentor changes
                                    }}
                                    required
                                />
                                {mentors.length > 0 && (
                                    <p className="mt-2 text-xs text-(--text-2)">
                                        {mentors.length} {mentors.length === 1 ? 'mentor disponible' : 'mentores disponibles'}
                                    </p>
                                )}
                            </div>

                            {selectedMentor && (
                                <>
                                    <div>
                                        <Input
                                            type="text"
                                            label={t('topic')}
                                            id="title"
                                            placeholder={t('topicPlaceholder')}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Textarea
                                            label={t('description')}
                                            id="description"
                                            placeholder={t('descriptionPlaceholder')}
                                            rows={4}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>

                                    {/* Availability Selection */}
                                    <div>
                                        <label className="font-semibold text-(--text-1) block mb-3 max-sm:text-sm">
                                            {t('selectAvailability')}
                                        </label>
                                        
                                        {loadingAvailability ? (
                                            <div className="flex items-center justify-center py-8">
                                                <FiLoader className="w-6 h-6 animate-spin text-(--button-1)" />
                                            </div>
                                        ) : availableSlots.length === 0 ? (
                                            <div className="text-center py-8 px-4 bg-(--bg-1) rounded-lg border-2 border-dashed border-(--border-1)">
                                                <FiCalendar className="w-12 h-12 mx-auto mb-3 text-(--text-2)" />
                                                <p className="text-(--text-2) font-medium">{t('noAvailableSlots')}</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                                                {availableSlots.map((slot) => (
                                                    <button
                                                        key={slot.id}
                                                        type="button"
                                                        onClick={() => setSelectedAvailability(slot.id)}
                                                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                                                            selectedAvailability === slot.id
                                                                ? 'border-(--button-1) bg-(--button-1)/10'
                                                                : 'border-(--border-1) hover:border-(--button-1)/50'
                                                        }`}
                                                    >
                                                        <p className="font-semibold text-(--text-1) mb-1 flex items-center gap-2">
                                                            <FiCalendar className="w-4 h-4" />
                                                            {formatDate(slot.date)}
                                                        </p>
                                                        <p className="text-(--text-2) text-sm flex items-center gap-2">
                                                            <FiClock className="w-4 h-4" />
                                                            {slot.start_time} - {slot.end_time}
                                                        </p>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Duration Selection */}
                                    {selectedAvailability && (
                                        <div>
                                            <label
                                                htmlFor="duration"
                                                className="font-semibold text-(--text-1) block mb-2 max-sm:text-sm"
                                            >
                                                {t('selectDuration')}
                                            </label>
                                            <select
                                                id="duration"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                className="bg-(--bg-2) border border-(--border-1) text-(--text-1) w-full outline-none px-4 py-4 max-sm:py-3 max-sm:text-sm rounded-md"
                                            >
                                                <option value="30">30 {t('minutes')}</option>
                                                <option value="40">40 {t('minutes')}</option>
                                                <option value="50">50 {t('minutes')}</option>
                                                <option value="60">60 {t('minutes')}</option>
                                                <option value="90">90 {t('minutes')}</option>
                                                <option value="120">120 {t('minutes')}</option>
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 max-sm:gap-3 pt-4">
                                <Button
                                    type="button"
                                    secondary
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    primary
                                    disabled={!selectedMentor || !title || !selectedAvailability || isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <FiLoader className="w-4 h-4 animate-spin" />
                                            Solicitando...
                                        </span>
                                    ) : (
                                        t('requestSession')
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </Card>
        </div>
    )
}
