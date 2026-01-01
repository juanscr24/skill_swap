'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card } from "@/components/ui/Card"
import { Button, Input } from "@/components"
import { FiX, FiPlus } from "react-icons/fi"
import type { EditLanguagesSectionProps, Language } from '@/types'

export const EditLanguagesSection = ({
  languages,
  onAddLanguage,
  onDeleteLanguage
}: EditLanguagesSectionProps) => {
  const t = useTranslations('profile')

  const [newLanguage, setNewLanguage] = useState('')
  const [newLanguageLevel, setNewLanguageLevel] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const languageLevels = [
    { value: 'native', label: 'Native' },
    { value: 'professional', label: 'Professional' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'basic', label: 'Basic' }
  ]

  const handleAddLanguage = async () => {
    if (!newLanguage.trim() || !newLanguageLevel) {
      setErrorMessage('Please fill in all fields')
      return
    }

    setSuccessMessage('')
    setErrorMessage('')

    const result = await onAddLanguage({
      name: newLanguage.trim(),
      level: newLanguageLevel
    })

    if (result.success) {
      setNewLanguage('')
      setNewLanguageLevel('')
      setSuccessMessage('Language added successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      setErrorMessage('Error adding language')
    }
  }

  const handleDeleteLanguage = async (languageId: string) => {
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

  const getLevelStyles = (level: string) => {
    switch (level.toLowerCase()) {
      case 'native':
        return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 text-(--text-1)'
      case 'professional':
        return 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20 text-(--text-1)'
      case 'intermediate':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20 text-(--text-1)'
      case 'basic':
        return 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20 text-(--text-1)'
      default:
        return 'bg-(--bg-1) text-(--text-2) border-(--border-1) text-(--text-1)'
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

      {/* Add Language Form */}
      <div className="mb-6 p-4 bg-(--bg-1) rounded-xl border border-(--border-1)">
        <h3 className="text-sm font-semibold text-(--text-1) mb-4">Add Language</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-(--text-1)">
          <Input
            label="Language"
            id="new-language"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder="e.g. Spanish, English..."
          />
          <div>
            <label className="block text-sm font-medium text-(--text-1) mb-2">
              Level
            </label>
            <div className="flex flex-wrap gap-2">
              {languageLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setNewLanguageLevel(level.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    newLanguageLevel === level.value
                      ? 'bg-(--button-1) text-(--button-1-text)'
                      : 'bg-(--bg-2) text-(--text-2) border border-(--border-1) hover:border-(--button-1)'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button
          primary
          onClick={handleAddLanguage}
          disabled={!newLanguage.trim() || !newLanguageLevel}
          className="mt-4"
        >
          <div className="flex items-center gap-2">
            <FiPlus />
            Add Language
          </div>
        </Button>
      </div>

      {/* Languages List */}
      <div className="space-y-2">
        {languages.length === 0 ? (
          <p className="text-(--text-2) text-sm italic">No languages added yet.</p>
        ) : (
          languages.map((language) => (
            <div
              key={language.id}
              className="flex items-center justify-between px-4 py-3 bg-(--bg-1) text-(--text-1) rounded-xl border border-(--border-1)"
            >
              <div className="flex items-center gap-5">
                <span className="text-2xl">{getLanguageFlag(language.name)}</span>
                <div>
                  <p className="font-semibold text-(--text-1)">{language.name}</p>
                  {language.level && (
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-md border ${getLevelStyles(language.level)}`}>
                      {language.level.charAt(0).toUpperCase() + language.level.slice(1)}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteLanguage(language.id)}
                className="text-(--text-2) hover:text-red-500 p-2"
              >
                <FiX />
              </button>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

// Helper function to get flag emoji (optional)
function getLanguageFlag(language: string): string {
  const flags: Record<string, string> = {
    'Spanish': '🇪🇸',
    'English': '🇬🇧',
    'French': '🇫🇷',
    'German': '🇩🇪',
    'Italian': '🇮🇹',
    'Portuguese': '🇵🇹',
    'Chinese': '🇨🇳',
    'Japanese': '🇯🇵',
    'Korean': '🇰🇷',
    'Russian': '🇷🇺',
    'Arabic': '🇸🇦',
  }
  return flags[language] || '🌐'
}
