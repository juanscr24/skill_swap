'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { mockUsers } from "@/constants/mockUsers"
import { Card } from "@/components/ui/Card"
import { Avatar } from "@/components/ui/Avatar"
import { Rating } from "@/components/ui/Rating"
import { SearchBar } from "@/components/ui/SearchBar"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components"
import Link from "next/link"
import { FiMapPin } from "react-icons/fi"

export const MentorsView = () => {
    const t = useTranslations('mentors')
    const [search, setSearch] = useState('')

    const mentors = mockUsers.filter(user => user.role === 'MENTOR' || user.role === 'STUDENT')

    const skillOptions = [
        { value: '', label: t('allSkills') },
        { value: 'React', label: 'React' },
        { value: 'Python', label: 'Python' },
        { value: 'Figma', label: 'Figma' }
    ]

    const cityOptions = [
        { value: '', label: t('allCities') },
        { value: 'Madrid', label: 'Madrid' },
        { value: 'Barcelona', label: 'Barcelona' },
        { value: 'Valencia', label: 'Valencia' }
    ]

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-(--text-1) mb-8">{t('mentors')}</h1>

            {/* Filters */}
            <Card className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder={t('search')}
                    />
                    <Select options={skillOptions} placeholder={t('filters')} />
                    <Select options={cityOptions} placeholder={t('filters')} />
                </div>
            </Card>

            {/* Results Count */}
            <p className="text-(--text-2) mb-4">{mentors.length} {t('results')}</p>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                    <Card key={mentor.id} hover>
                        <div className="flex flex-col items-center text-center">
                            <Avatar src={mentor.image} alt={mentor.name} size="lg" className="mb-4" />
                            
                            <h3 className="text-xl font-bold text-(--text-1) mb-1">{mentor.name}</h3>
                            
                            <div className="flex items-center gap-1 text-(--text-2) mb-3">
                                <FiMapPin className="w-4 h-4" />
                                <span className="text-sm">{mentor.city}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <Rating value={mentor.rating} readonly size="sm" />
                                <span className="text-sm font-semibold text-(--text-1)">{mentor.rating}</span>
                            </div>

                            <p className="text-(--text-2) text-sm mb-4 line-clamp-2">{mentor.bio}</p>

                            <div className="flex flex-wrap gap-2 mb-4 justify-center">
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
                                <Button primary className="w-full">
                                    {t('viewProfile')}
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
