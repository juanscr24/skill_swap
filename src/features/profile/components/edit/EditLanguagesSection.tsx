'use client'
import { useState } from "react"
import { Card } from "@/shared/components/ui/Card"
import { LanguageList } from "../languages/LanguageList"
import { LanguageModal } from "../languages/LanguageModal"
import type { EditLanguagesSectionProps } from '@/types'

export const EditLanguagesSection = ({
  languages,
  onAddLanguage,
  onDeleteLanguage
}: EditLanguagesSectionProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleAdd = async (data: { name: string; level: string }) => {
    setSuccessMessage('')
    setErrorMessage('')

    const result = await onAddLanguage(data)

    if (result.success) {
      setSuccessMessage('Language added successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
      setIsAdding(false)
      return { success: true }
    } else {
      setErrorMessage('Error adding language')
      return { success: false }
    }
  }

  const handleDelete = async (languageId: string) => {
    if (!confirm('Are you sure you want to remove this language?')) return

    setSuccessMessage('')
    setErrorMessage('')

    const result = await onDeleteLanguage(languageId)

    if (result.success) {
      setSuccessMessage('Language removed successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      setErrorMessage('Error removing language')
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-bold text-(--text-1) mb-6">Languages</h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-xl text-sm text-green-800 dark:text-green-200">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-xl text-sm text-red-800 dark:text-red-200">
          {errorMessage}
        </div>
      )}

      <LanguageList
        languages={languages}
        onDelete={handleDelete}
        onAddClick={() => setIsAdding(true)}
        showAddButton={true}
      />

      <LanguageModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onAddLanguage={handleAdd}
        existingLanguages={languages}
      />
    </Card>
  )
}
