'use client'
import { useState, useRef, useEffect } from 'react'
import { FiX, FiPlus, FiSearch } from 'react-icons/fi'
import { Badge } from './Badge'
import type { SkillSelectorProps } from '@/types'

interface SkillSelectorPropsExtended extends SkillSelectorProps {
    recommendations?: string[]
    label?: string
}

export const SkillSelector = ({ 
    onAdd, 
    placeholder = 'Buscar o agregar habilidad...', 
    recommendations = [],
    label
}: SkillSelectorPropsExtended) => {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [customSkill, setCustomSkill] = useState('')
    const [showCustomInput, setShowCustomInput] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Filtrar recomendaciones basadas en la búsqueda
    const filteredRecommendations = recommendations.filter(skill =>
        skill.toLowerCase().includes(search.toLowerCase())
    )

    // Cerrar el dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setShowCustomInput(false)
                setSearch('')
                setCustomSkill('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelectSkill = (skill: string) => {
        onAdd(skill)
        setIsOpen(false)
        setSearch('')
    }

    const handleAddCustomSkill = () => {
        if (customSkill.trim()) {
            onAdd(customSkill.trim())
            setCustomSkill('')
            setShowCustomInput(false)
            setIsOpen(false)
            setSearch('')
        }
    }

    return (
        <div ref={containerRef} className="relative">
            {label && (
                <label className="block text-sm font-medium text-(--text-1) mb-2">
                    {label}
                </label>
            )}
            
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center gap-2 px-4 py-3 bg-(--bg-2) border border-(--border-1) rounded-lg text-(--text-1) hover:border-(--button-1) transition-colors"
                >
                    <FiPlus className="w-4 h-4" />
                    <span>{placeholder}</span>
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-(--bg-2) border border-(--border-1) rounded-lg shadow-lg max-h-80 overflow-y-auto">
                        {/* Search Input */}
                        <div className="p-3 border-b border-(--border-1) sticky top-0 bg-(--bg-2)">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-2)" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar habilidad..."
                                    className="w-full pl-10 pr-4 py-2 bg-(--bg-1) border border-(--border-1) rounded-lg text-(--text-1) placeholder:text-(--text-2) focus:outline-none focus:border-(--button-1)"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Custom Skill Input */}
                        {showCustomInput && (
                            <div className="p-3 border-b border-(--border-1) bg-(--bg-1)">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={customSkill}
                                        onChange={(e) => setCustomSkill(e.target.value)}
                                        placeholder="Nombre de la habilidad"
                                        className="flex-1 px-3 py-2 bg-(--bg-2) border border-(--border-1) rounded-lg text-(--text-1) placeholder:text-(--text-2) focus:outline-none focus:border-(--button-1)"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleAddCustomSkill()
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCustomSkill}
                                        className="px-4 py-2 bg-(--button-1) text-(--button-1-text) rounded-lg hover:opacity-90 transition-opacity font-medium"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Recommendations List */}
                        <div className="p-2">
                            {filteredRecommendations.length > 0 ? (
                                <>
                                    <div className="px-2 py-1 text-xs font-medium text-(--text-2) uppercase">
                                        Recomendaciones
                                    </div>
                                    {filteredRecommendations.map((skill, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleSelectSkill(skill)}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-(--bg-1) text-(--text-1) transition-colors"
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </>
                            ) : search && (
                                <div className="px-3 py-4 text-center text-(--text-2) text-sm">
                                    No se encontraron recomendaciones
                                </div>
                            )}

                            {/* Add Custom Button */}
                            <button
                                type="button"
                                onClick={() => setShowCustomInput(!showCustomInput)}
                                className="w-full mt-2 px-3 py-2 text-left rounded-lg hover:bg-(--bg-1) text-(--button-1) font-medium flex items-center gap-2 transition-colors"
                            >
                                <FiPlus className="w-4 h-4" />
                                {showCustomInput ? 'Cancelar' : 'Agregar habilidad personalizada'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
