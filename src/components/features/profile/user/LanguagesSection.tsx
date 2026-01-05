import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { useTranslations } from "next-intl"
import { FiPlus, FiX, FiSearch, FiGlobe } from "react-icons/fi"
import { recommendedLanguages } from "@/constants/recommendedLanguages"

interface Language {
  id: string
  name: string
  level?: string | null
}

interface LanguagesSectionPropsExtended {
  languages: Language[]
  onAddLanguage?: (data: { name: string; level: string }) => Promise<{ success: boolean }>
  onDeleteLanguage?: (languageId: string) => Promise<{ success: boolean }>
}

export const LanguagesSection = ({ 
  languages,
  onAddLanguage,
  onDeleteLanguage 
}: LanguagesSectionPropsExtended) => {
  const t = useTranslations('profile')
  
  const [isAdding, setIsAdding] = useState(false)
  const [languageInput, setLanguageInput] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [showLevelSelection, setShowLevelSelection] = useState(false)
  const addRef = useRef<HTMLDivElement>(null)

  const languageLevels = [
    { value: 'native', label: 'Native', color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' },
    { value: 'professional', label: 'Professional', color: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' },
    { value: 'basic', label: 'Basic', color: 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20' }
  ]

  // Filtrar recomendaciones
  const filteredLanguages = recommendedLanguages.filter(lang =>
    lang.toLowerCase().includes(languageInput.toLowerCase()) &&
    !languages.some(l => l.name.toLowerCase() === lang.toLowerCase())
  ).slice(0, 8)

  const isCustomLanguage = languageInput.trim() && 
    filteredLanguages.length === 0 ||
    !filteredLanguages.some(lang => lang.toLowerCase() === languageInput.toLowerCase())

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addRef.current && !addRef.current.contains(event.target as Node)) {
        setShowRecommendations(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectLanguage = (languageName: string) => {
    setLanguageInput(languageName)
    setShowRecommendations(false)
    setShowLevelSelection(true)
  }

  const handleAddLanguage = async () => {
    if (!languageInput.trim() || !selectedLevel || !onAddLanguage) return

    const result = await onAddLanguage({
      name: languageInput.trim(),
      level: selectedLevel
    })

    if (result.success) {
      setLanguageInput('')
      setSelectedLevel('')
      setIsAdding(false)
      setShowLevelSelection(false)
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setLanguageInput('')
    setSelectedLevel('')
    setShowRecommendations(false)
    setShowLevelSelection(false)
  }

  const getLevelStyles = (level: string) => {
    switch (level.toLowerCase()) {
      case 'native':
        return 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
      case 'professional':
        return 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
      case 'intermediate':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
      case 'basic':
        return 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20'
      default:
        return 'bg-(--bg-1) text-(--text-2) border-(--border-1)'
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
      'Hindi': '🇮🇳',
      'Dutch': '🇳🇱',
      'Swedish': '🇸🇪',
      'Norwegian': '🇳🇴',
      'Danish': '🇩🇰',
      'Finnish': '🇫🇮',
      'Polish': '🇵🇱',
      'Turkish': '🇹🇷',
      'Greek': '🇬🇷',
    }
    return flags[language] || '🌐'
  }

  if (!languages || languages.length === 0) {
    if (!onAddLanguage) return null
    
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <FiGlobe className="text-(--button-1)" size={20} />
          <h2 className="text-xl font-bold text-(--text-1)">Languages</h2>
        </div>
        
        {!isAdding ? (
          <>
            <p className="text-(--text-2) text-sm italic text-center py-4">No languages added yet.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="w-full px-4 py-3 rounded-xl border border-dashed border-(--border-1) text-(--text-2) hover:text-(--button-1) hover:border-(--button-1) transition-all flex items-center justify-center gap-2"
            >
              <FiPlus size={16} /> Add Language
            </button>
          </>
        ) : (
          <div ref={addRef} className="space-y-3 p-4 bg-(--bg-1) rounded-xl border border-(--button-1)">
            {/* Language Search Input */}
            {!showLevelSelection && (
              <div className="relative">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-2)" />
                  <input
                    type="text"
                    value={languageInput}
                    onChange={(e) => {
                      setLanguageInput(e.target.value)
                      setShowRecommendations(true)
                    }}
                    onFocus={() => setShowRecommendations(true)}
                    placeholder="Search language..."
                    className="w-full pl-10 pr-10 py-3 bg-(--bg-2) border border-(--border-1) rounded-xl text-(--text-1) placeholder:text-(--text-2) focus:outline-none focus:border-(--button-1)"
                    autoFocus
                  />
                  <button
                    onClick={handleCancel}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-2) hover:text-(--text-1)"
                  >
                    <FiX size={16} />
                  </button>
                </div>

                {/* Recommendations Dropdown */}
                {showRecommendations && (languageInput.trim() || filteredLanguages.length > 0) && (
                  <div className="absolute z-50 w-full mt-2 bg-(--bg-2) border border-(--border-1) rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filteredLanguages.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleSelectLanguage(lang)}
                        className="w-full px-4 py-3 text-left text-(--text-1) hover:bg-(--bg-1) transition-colors border-b border-(--border-1) last:border-b-0 flex items-center gap-3"
                      >
                        <span className="text-xl">{getLanguageFlag(lang)}</span>
                        {lang}
                      </button>
                    ))}
                    {isCustomLanguage && languageInput.trim() && (
                      <button
                        type="button"
                        onClick={() => handleSelectLanguage(languageInput)}
                        className="w-full px-4 py-3 text-left text-(--button-1) hover:bg-(--bg-1) transition-colors flex items-center gap-2 font-medium"
                      >
                        <FiPlus size={16} />
                        Add custom: "{languageInput}"
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Level Selection */}
            {showLevelSelection && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-(--text-1)">
                    Select level for <span className="font-bold text-(--button-1)">{languageInput}</span>
                  </p>
                  <button
                    onClick={() => {
                      setShowLevelSelection(false)
                      setLanguageInput('')
                    }}
                    className="text-(--text-2) hover:text-(--text-1)"
                  >
                    <FiX size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {languageLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setSelectedLevel(level.value)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        selectedLevel === level.value
                          ? level.color
                          : 'bg-(--bg-2) text-(--text-2) border-(--border-1) hover:border-(--button-1)'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddLanguage}
                    disabled={!selectedLevel}
                    className="flex-1 px-4 py-2 bg-(--button-1) text-(--button-1-text) rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    Add Language
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-(--bg-2) text-(--text-2) rounded-lg hover:text-(--text-1) border border-(--border-1) transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiGlobe className="text-(--button-1)" size={20} />
          <h2 className="text-xl font-bold text-(--text-1)">Languages</h2>
        </div>
      </div>

      <div className="space-y-3">
        {/* Existing Languages */}
        {languages.map((language) => (
          <div
            key={language.id}
            className="flex items-center justify-between p-3 bg-(--bg-1) rounded-xl border border-(--border-1) group hover:border-(--button-1) transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">{getLanguageFlag(language.name)}</span>
              <div className="flex-1">
                <p className="font-semibold text-(--text-1)">{language.name}</p>
                {language.level && (
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-md border ${getLevelStyles(language.level)}`}>
                    {language.level.charAt(0).toUpperCase() + language.level.slice(1)}
                  </span>
                )}
              </div>
            </div>
            {onDeleteLanguage && (
              <button
                onClick={() => onDeleteLanguage(language.id)}
                className="text-(--text-2) hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        ))}

        {/* Add Language Section */}
        {onAddLanguage && (
          <>
            {isAdding ? (
              <div ref={addRef} className="space-y-3 p-4 bg-(--bg-1) rounded-xl border border-(--button-1)">
                {/* Language Search Input */}
                {!showLevelSelection && (
                  <div className="relative">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-2)" />
                      <input
                        type="text"
                        value={languageInput}
                        onChange={(e) => {
                          setLanguageInput(e.target.value)
                          setShowRecommendations(true)
                        }}
                        onFocus={() => setShowRecommendations(true)}
                        placeholder="Search language..."
                        className="w-full pl-10 pr-10 py-3 bg-(--bg-2) border border-(--border-1) rounded-xl text-(--text-1) placeholder:text-(--text-2) focus:outline-none focus:border-(--button-1)"
                        autoFocus
                      />
                      <button
                        onClick={handleCancel}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-2) hover:text-(--text-1)"
                      >
                        <FiX size={16} />
                      </button>
                    </div>

                    {/* Recommendations Dropdown */}
                    {showRecommendations && (languageInput.trim() || filteredLanguages.length > 0) && (
                      <div className="absolute z-50 w-full mt-2 bg-(--bg-2) border border-(--border-1) rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {filteredLanguages.map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => handleSelectLanguage(lang)}
                            className="w-full px-4 py-3 text-left text-(--text-1) hover:bg-(--bg-1) transition-colors border-b border-(--border-1) last:border-b-0 flex items-center gap-3"
                          >
                            <span className="text-xl">{getLanguageFlag(lang)}</span>
                            {lang}
                          </button>
                        ))}
                        {isCustomLanguage && languageInput.trim() && (
                          <button
                            type="button"
                            onClick={() => handleSelectLanguage(languageInput)}
                            className="w-full px-4 py-3 text-left text-(--button-1) hover:bg-(--bg-1) transition-colors flex items-center gap-2 font-medium"
                          >
                            <FiPlus size={16} />
                            Add custom: "{languageInput}"
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Level Selection */}
                {showLevelSelection && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-(--text-1)">
                        Select level for <span className="font-bold text-(--button-1)">{languageInput}</span>
                      </p>
                      <button
                        onClick={() => {
                          setShowLevelSelection(false)
                          setLanguageInput('')
                        }}
                        className="text-(--text-2) hover:text-(--text-1)"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {languageLevels.map((level) => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setSelectedLevel(level.value)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                            selectedLevel === level.value
                              ? level.color
                              : 'bg-(--bg-2) text-(--text-2) border-(--border-1) hover:border-(--button-1)'
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddLanguage}
                        disabled={!selectedLevel}
                        className="flex-1 px-4 py-2 bg-(--button-1) text-(--button-1-text) rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                      >
                        Add Language
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-(--bg-2) text-(--text-2) rounded-lg hover:text-(--text-1) border border-(--border-1) transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full px-4 py-3 rounded-xl border border-dashed border-(--border-1) text-(--text-2) hover:text-(--button-1) hover:border-(--button-1) transition-all flex items-center justify-center gap-2"
              >
                <FiPlus size={16} /> Add Language
              </button>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
