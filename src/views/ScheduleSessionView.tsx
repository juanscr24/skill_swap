'use client'
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button, Input } from "@/components"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { useMentors } from "@/hooks"
import { FiLoader, FiArrowLeft } from "react-icons/fi"
import Link from "next/link"

export const ScheduleSessionView = () => {
    const t = useTranslations('sessions')
    const router = useRouter()
    const { mentors, isLoading: loadingMentors } = useMentors()

    const [selectedMentor, setSelectedMentor] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [hours, setHours] = useState('1')
    const [minutes, setMinutes] = useState('0')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    // Obtener fecha mínima (hoy)
    const today = new Date().toISOString().split('T')[0]

    const mentorOptions = mentors.map(mentor => ({
        value: mentor.id,
        label: mentor.name || mentor.email
    }))

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
        if (!date || !time) {
            setError('Por favor selecciona fecha y hora')
            return
        }

        // Crear fechas de inicio y fin
        const startDateTime = new Date(`${date}T${time}`)
        const durationInMinutes = parseInt(hours) * 60 + parseInt(minutes)
        const endDateTime = new Date(startDateTime.getTime() + durationInMinutes * 60000)

        // Validar que la fecha sea futura
        if (startDateTime <= new Date()) {
            setError('La fecha y hora deben ser futuras')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    guest_id: selectedMentor,
                    title,
                    description: description.trim() || undefined,
                    start_at: startDateTime.toISOString(),
                    end_at: endDateTime.toISOString(),
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Error al crear la sesión')
            }

            setSuccessMessage('¡Sesión agendada correctamente! Redirigiendo...')
            setTimeout(() => {
                router.push('/sessions')
            }, 1500)

        } catch (err: any) {
            console.error('Error scheduling session:', err)
            setError(err.message || 'Error al agendar la sesión. Intenta de nuevo.')
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
                                    onChange={(e) => setSelectedMentor(e.target.value)}
                                    required
                                />
                                {mentors.length > 0 && (
                                    <p className="mt-2 text-xs text-(--text-2)">
                                        {mentors.length} {mentors.length === 1 ? 'mentor disponible' : 'mentores disponibles'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Input
                                    type="text"
                                    label={t('title')}
                                    id="title"
                                    placeholder="Ej: Introducción a React Hooks"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Textarea
                                    label={t('description')}
                                    id="description"
                                    placeholder={t('description')}
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <p className="mt-2 text-xs text-(--text-2)">Describe brevemente el contenido de la sesión</p>
                            </div>

                            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5 max-sm:gap-4">
                                <Input
                                    type="date"
                                    label={t('date')}
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={today}
                                    required
                                />
                                <Input
                                    type="time"
                                    label={t('time')}
                                    id="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 max-sm:gap-3">
                                <Input
                                    type="number"
                                    label={`${t('duration')} (${t('hours')})`}
                                    id="hours"
                                    placeholder="1"
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                    min="0"
                                    max="8"
                                />
                                <Input
                                    type="number"
                                    label={`${t('duration')} (${t('minutes')})`}
                                    id="minutes"
                                    placeholder="0"
                                    value={minutes}
                                    onChange={(e) => setMinutes(e.target.value)}
                                    min="0"
                                    max="59"
                                    step="15"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 max-sm:gap-3 pt-4 border-t border-(--border-1)">
                                <Button 
                                    primary 
                                    type="submit" 
                                    className="flex-1 py-4 max-sm:py-3 flex items-center justify-center gap-2 font-semibold text-lg max-sm:text-base shadow-lg hover:shadow-xl transition-all"
                                    disabled={isSubmitting || loadingMentors}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FiLoader className="w-5 h-5 animate-spin" />
                                            Agendando...
                                        </>
                                    ) : (
                                        t('schedule')
                                    )}
                                </Button>
                                <Button 
                                    secondary 
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-8 max-sm:px-4 py-4 max-sm:py-3 font-semibold text-lg max-sm:text-base shadow-sm"
                                    disabled={isSubmitting}
                                >
                                    {t('cancel')}
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </Card>
        </div>
    )
}
