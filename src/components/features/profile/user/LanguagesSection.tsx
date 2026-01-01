import { Card } from "@/components/ui/Card"
import type { LanguagesSectionProps, Language } from '@/types'

export const LanguagesSection = ({ languages }: LanguagesSectionProps) => {
  if (!languages || languages.length === 0) {
    return null
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

  const getLanguageFlag = (language: string): string => {
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

  return (
    <div className="bg-(--bg-2) rounded-2xl p-6 border border-(--border-1) text-(--text-1)">
      <h2 className="text-xl font-bold text-(--text-1) mb-4">Languages</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {languages.map((language) => (
          <div
            key={language.id}
            className="flex items-center gap-3 p-3 bg-(--bg-1) rounded-xl border border-(--border-1)"
          >
            <span className="text-2xl">{getLanguageFlag(language.name)}</span>
            <div className="flex-1">
              <p className="font-semibold text-(--text-1) text-sm">{language.name}</p>
              {language.level && (
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-md border ${getLevelStyles(language.level)}`}>
                  {language.level.charAt(0).toUpperCase() + language.level.slice(1)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
