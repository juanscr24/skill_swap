'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useMentors } from "@/hooks/useMentors"
import { Card } from "@/components/ui/Card"
import { MentorCard } from "@/components/ui/MentorCard"
import { MoreMentorsCard } from "@/components/ui/MoreMentorsCard"
import { SearchBar } from "@/components/ui/SearchBar"
import { Select } from "@/components/ui/Select"
import { FiLoader } from "react-icons/fi"

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
                    <div className="grid grid-cols-5 max-2xl:grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6 max-md:gap-4 max-sm:gap-3">
                        {filteredMentors.length > 0 ? (
                            <>
                                {filteredMentors.map((mentor) => (
                                    <MentorCard
                                        key={mentor.id}
                                        id={mentor.id}
                                        name={mentor.name || 'Sin nombre'}
                                        image={mentor.image}
                                        city={mentor.city}
                                        bio={mentor.bio}
                                        averageRating={mentor.averageRating}
                                        totalReviews={mentor.totalReviews}
                                        skills={mentor.skills}
                                        isAvailable={true}
                                    />
                                ))}
                                {/* More Mentors Coming Soon Card */}
                                <MoreMentorsCard />
                            </>
                        ) : (
                            <div className="col-span-full">
                                <Card className="p-8 text-center">
                                    <p className="text-(--text-2)">
                                        {t('noResults')}
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
