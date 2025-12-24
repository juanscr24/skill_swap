'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useMentors } from "@/hooks/useMentors"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { Rating } from "@/components/ui/Rating"
import { SearchBar } from "@/components/ui/SearchBar"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components"
import Link from "next/link"
import { FiMapPin, FiLoader } from "react-icons/fi"

export const MentorsView = () => {
    const t = useTranslations('mentors')
    const [search, setSearch] = useState('')
    const [selectedSkill, setSelectedSkill] = useState('')
    const [selectedCity, setSelectedCity] = useState('')

    const { mentors, isLoading, error } = useMentors({
        skill: selectedSkill || undefined,
        city: selectedCity || undefined,
    })

    const skillOptions = [
        { value: '', label: t('allSkills') },
        { value: 'React', label: 'React' },
        { value: 'Python', label: 'Python' },
        { value: 'Figma', label: 'Figma' },
        { value: 'JavaScript', label: 'JavaScript' },
        { value: 'TypeScript', label: 'TypeScript' },
    ]

    const cityOptions = [
        { value: '', label: t('allCities') },
        { value: 'Madrid', label: 'Madrid' },
        { value: 'Barcelona', label: 'Barcelona' },
        { value: 'Valencia', label: 'Valencia' },
        { value: 'Sevilla', label: 'Sevilla' },
    ]

    // Filtrar mentors por búsqueda local (nombre)
    const filteredMentors = mentors.filter((mentor) =>
        mentor.name?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4">
            <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-8 max-md:mb-6 max-sm:mb-4">{t('mentors')}</h1>

            {/* Filters */}
            <Card className="mb-8 max-md:mb-6 max-sm:mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-sm:gap-3">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder={t('search')}
                    />
                    <Select
                        options={skillOptions}
                        placeholder={t('filters')}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        value={selectedSkill}
                    />
                    <Select
                        options={cityOptions}
                        placeholder={t('filters')}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        value={selectedCity}
                    />
                </div>
            </Card>

            {/* Loading state */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <FiLoader className="w-8 h-8 animate-spin text-(--button-1)" />
                </div>
            )}

            {/* Error state */}
            {error && (
                <Card className="p-6 text-center">
                    <p className="text-red-500">{error}</p>
                </Card>
            )}

            {/* Results */}
            {!isLoading && !error && (
                <>
                    {/* Results Count */}
                    <p className="text-(--text-2) mb-4 max-sm:mb-3 max-sm:text-sm">
                        {filteredMentors.length} {t('results')}
                    </p>

                    {/* Mentors Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-md:gap-4 max-sm:gap-3">
                        {filteredMentors.length > 0 ? (
                            filteredMentors.map((mentor) => (
                                <Card key={mentor.id} hover>
                                    <div className="flex flex-col items-center text-center">
                                        <Avatar
                                            src={mentor.image || ''}
                                            alt={mentor.name || 'User'}
                                            size="lg"
                                            className="mb-4 max-sm:mb-3"
                                        />
                                        
                                        <h3 className="text-xl max-md:text-lg max-sm:text-base font-bold text-(--text-1) mb-1">
                                            {mentor.name || 'Sin nombre'}
                                        </h3>
                                        
                                        <div className="flex items-center gap-1 text-(--text-2) mb-3 max-sm:mb-2">
                                            <FiMapPin className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                                            <span className="text-sm max-sm:text-xs">
                                                {mentor.city || 'Sin ubicación'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 max-sm:gap-1 mb-4 max-sm:mb-3">
                                            <Rating value={mentor.averageRating} readonly size="sm" />
                                            <span className="text-sm max-sm:text-xs font-semibold text-(--text-1)">
                                                {mentor.averageRating.toFixed(1)}
                                            </span>
                                            <span className="text-(--text-2) text-xs">
                                                ({mentor.totalReviews})
                                            </span>
                                        </div>

                                        <p className="text-(--text-2) text-sm max-sm:text-xs mb-4 max-sm:mb-3 line-clamp-2">
                                            {mentor.bio || 'Sin descripción'}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4 max-sm:mb-3 justify-center">
                                            {mentor.skills.slice(0, 3).map((skill) => (
                                                <span
                                                    key={skill.id}
                                                    className="px-2 py-1 bg-(--bg-1) text-(--text-2) rounded text-xs"
                                                >
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>

                                        <Link href={`/profile/${mentor.id}`} className="w-full">
                                            <Button primary className="w-full max-sm:text-sm">
                                                {t('viewProfile')}
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full">
                                <Card className="p-8 text-center">
                                    <p className="text-(--text-2)">
                                        No se encontraron mentores con los filtros seleccionados
                                    </p>
                                </Card>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
