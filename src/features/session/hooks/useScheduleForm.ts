import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionRequests } from './useSessionRequests'

export const useScheduleForm = () => {
    const router = useRouter()
    const { createSessionRequest, isCreating, error } = useSessionRequests()

    const [selectedMentor, setSelectedMentor] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [selectedAvailability, setSelectedAvailability] = useState('')
    const [duration, setDuration] = useState('30')
    const [successMessage, setSuccessMessage] = useState('')

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setSelectedAvailability('')
        setDuration('30')
        // We usually keep mentor selected if in a flow, but can reset if needed.
    }

    const handleMentorChange = (mentorId: string) => {
        setSelectedMentor(mentorId)
        setSelectedAvailability('') // Reset availability when mentor changes
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSuccessMessage('')

        const durationNum = parseInt(duration)

        const result = await createSessionRequest({
            mentor_id: selectedMentor,
            availability_id: selectedAvailability,
            title,
            description: description.trim() || undefined,
            duration_minutes: durationNum,
        })

        if (result.success) {
            setSuccessMessage('¡Solicitud de sesión enviada correctamente! Redirigiendo...')
            setTimeout(() => {
                router.push('/sessions')
            }, 1500)
        }
    }

    const isFormValid = !!selectedMentor && !!title && !!selectedAvailability

    return {
        // State
        selectedMentor,
        title,
        description,
        selectedAvailability,
        duration,
        successMessage,
        isCreating,
        error,

        // Setters
        setSelectedMentor: handleMentorChange,
        setTitle,
        setDescription,
        setSelectedAvailability,
        setDuration,

        // Handlers
        handleSubmit,
        isFormValid
    }
}
