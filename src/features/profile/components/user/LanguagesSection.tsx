'use client'
import { useState } from "react"
import { Card } from "@/shared/components/ui/Card"
import { FiGlobe } from "react-icons/fi"
import { LanguageList } from "../languages/LanguageList"
import { LanguageModal } from "../languages/LanguageModal"

interface Language {
  id: string
  name: string
  level?: string | null
}

interface LanguagesSectionProps {
  languages: Language[]
  onAddLanguage?: (data: { name: string; level: string }) => Promise<{ success: boolean }>
  onDeleteLanguage?: (languageId: string) => Promise<{ success: boolean }>
}

export const LanguagesSection = ({
  languages,
  onAddLanguage,
  onDeleteLanguage
}: LanguagesSectionProps) => {
  const [isAdding, setIsAdding] = useState(false)

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiGlobe className="text-(--button-1)" size={20} />
          <h2 className="text-xl font-bold text-(--text-1)">Languages</h2>
        </div>
      </div>

      <LanguageList
        languages={languages}
        onDelete={onDeleteLanguage}
        onAddClick={() => setIsAdding(true)}
        showAddButton={!!onAddLanguage}
      />

      {onAddLanguage && (
        <LanguageModal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          onAddLanguage={onAddLanguage}
          existingLanguages={languages}
        />
      )}
    </Card>
  )
}
