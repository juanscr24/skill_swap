'use client'

import { useState } from 'react'
import { MentorAvailability } from '@/types/models'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useSessionRequests } from '@/hooks'

interface BookSessionModalProps {
  mentorId: string
  mentorName: string
  availability: MentorAvailability[]
  onClose: () => void
  onSuccess: () => void
  translations: {
    bookSession: string
    selectAvailability: string
    topic: string
    topicPlaceholder: string
    description: string
    descriptionPlaceholder: string
    selectDuration: string
    requestSession: string
    minimumDuration: string
    invalidTimeFormat: string
    sessionRequested: string
    errorRequestingSession: string
    noAvailableSlots: string
    minutes: string
  }
}

export const BookSessionModal = ({
  mentorId,
  mentorName,
  availability,
  onClose,
  onSuccess,
  translations,
}: BookSessionModalProps) => {
  const { createSessionRequest } = useSessionRequests()
  const [selectedAvailability, setSelectedAvailability] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('30')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!selectedAvailability || !title || !duration) {
      setError('Por favor completa todos los campos')
      return
    }

    const durationNum = parseInt(duration)
    if (durationNum < 30) {
      setError(translations.minimumDuration)
      return
    }

    if (durationNum % 10 !== 0) {
      setError(translations.invalidTimeFormat)
      return
    }

    setIsSubmitting(true)

    try {
      await createSessionRequest({
        mentor_id: mentorId,
        availability_id: selectedAvailability,
        title,
        description,
        duration_minutes: durationNum,
      })

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || translations.errorRequestingSession)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAvailableSlots = () => {
    return availability.filter((slot) => !slot.is_booked)
  }

  const availableSlots = getAvailableSlots()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-(--bg-2) rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-(--border-1)">
          <h2 className="text-2xl font-bold text-(--text-1)">
            {translations.bookSession}
          </h2>
          <p className="text-(--text-2) mt-1">con {mentorName}</p>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {availableSlots.length === 0 ? (
          <div className="p-6">
            <p className="text-(--text-2) text-center py-8">
              {translations.noAvailableSlots}
            </p>
            <Button secondary onClick={onClose} className="w-full">
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Availability Selection */}
            <div>
              <label className="font-semibold text-(--text-1) block mb-3">
                {translations.selectAvailability}
              </label>
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
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
                    <p className="font-semibold text-(--text-1)">
                      {formatDate(slot.date)}
                    </p>
                    <p className="text-(--text-2) text-sm">
                      {slot.start_time} - {slot.end_time}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <Input
              type="text"
              label={translations.topic}
              id="title"
              placeholder={translations.topicPlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Description */}
            <Textarea
              label={translations.description}
              id="description"
              placeholder={translations.descriptionPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />

            {/* Duration */}
            <div>
              <label
                htmlFor="duration"
                className="font-semibold text-(--text-1) block mb-2"
              >
                {translations.selectDuration}
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-(--bg-2) border border-(--border-1) text-(--text-1) w-full outline-none px-4 py-4 rounded-md"
              >
                <option value="30">30 {translations.minutes}</option>
                <option value="40">40 {translations.minutes}</option>
                <option value="50">50 {translations.minutes}</option>
                <option value="60">60 {translations.minutes}</option>
                <option value="90">90 {translations.minutes}</option>
                <option value="120">120 {translations.minutes}</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                secondary
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                primary
                disabled={
                  !selectedAvailability || !title || isSubmitting
                }
                className="flex-1"
              >
                {isSubmitting ? 'Solicitando...' : translations.requestSession}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
