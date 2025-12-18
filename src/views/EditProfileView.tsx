'use client'
import { useState } from "react"
import { useTranslations } from "next-intl"
import { currentUser } from "@/constants/mockUsers"
import { Avatar } from "@/components/ui/Avatar"
import { Card } from "@/components/ui/Card"
import { Button, Input } from "@/components"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { Badge } from "@/components/ui/Badge"
import { FiX, FiPlus } from "react-icons/fi"

export const EditProfileView = () => {
    const t = useTranslations('profile')
    const [skills, setSkills] = useState(currentUser.skills)
    const [wantedSkills, setWantedSkills] = useState(currentUser.wanted_skills)

    const levelOptions = [
        { value: 'Principiante', label: t('beginner') },
        { value: 'Intermedio', label: t('intermediate') },
        { value: 'Avanzado', label: t('advanced') }
    ]

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4 max-w-3xl mx-auto">
            <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1) mb-8 max-md:mb-6 max-sm:mb-4">{t('editProfile')}</h1>

            <form className="space-y-6 max-md:space-y-4 max-sm:space-y-3">
                {/* Profile Photo */}
                <Card>
                    <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-(--text-1) mb-4 max-sm:mb-3">{t('uploadPhoto')}</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-4 max-sm:gap-3">
                        <Avatar src={currentUser.image} alt={currentUser.name} size="xl" />
                        <Button secondary type="button" className="max-sm:w-full max-sm:text-sm">
                            {t('uploadPhoto')}
                        </Button>
                    </div>
                </Card>

                {/* Basic Info */}
                <Card>
                    <div className="space-y-4 max-sm:space-y-3">
                        <Input
                            type="text"
                            label={t('name')}
                            id="name"
                            placeholder="Juan Pérez"
                        />
                        <Input
                            type="text"
                            label={t('city')}
                            id="city"
                            placeholder="Madrid"
                        />
                        <Textarea
                            label={t('bio')}
                            id="bio"
                            placeholder={t('bio')}
                            rows={4}
                        />
                    </div>
                </Card>

                {/* Skills I Teach */}
                <Card>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 max-sm:mb-3 gap-3">
                        <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-(--text-1)">{t('skillsTeach')}</h2>
                        <Button secondary type="button" className="flex items-center gap-2 max-sm:gap-1 max-sm:text-sm max-sm:w-full">
                            <FiPlus className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                            {t('addSkill')}
                        </Button>
                    </div>
                    <div className="space-y-3 max-sm:space-y-2">
                        {skills.map((skill) => (
                            <div key={skill.id} className="flex items-center gap-3 max-sm:gap-2 p-3 max-sm:p-2 bg-(--bg-1) rounded-lg">
                                <div className="flex-1 grid grid-cols-2 max-sm:grid-cols-1 gap-3 max-sm:gap-2">
                                    <Input
                                        type="text"
                                        placeholder={t('skillName')}
                                        value={skill.name}
                                    />
                                    <Select
                                        options={levelOptions}
                                        value={skill.level}
                                        placeholder={t('skillLevel')}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700 max-sm:self-start"
                                >
                                    <FiX className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Skills I Want to Learn */}
                <Card>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 max-sm:mb-3 gap-3">
                        <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-(--text-1)">{t('skillsLearn')}</h2>
                        <Button secondary type="button" className="flex items-center gap-2 max-sm:gap-1 max-sm:text-sm max-sm:w-full">
                            <FiPlus className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                            {t('addSkill')}
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {wantedSkills.map((skill) => (
                            <Badge key={skill.id} variant="warning" className="flex items-center gap-2 max-sm:gap-1">
                                <span className="max-sm:text-xs">{skill.name}</span>
                                <button
                                    type="button"
                                    className="hover:text-red-500"
                                >
                                    <FiX className="w-3 h-3 max-sm:w-2.5 max-sm:h-2.5" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 max-sm:gap-3">
                    <Button primary className="flex-1 py-3 max-sm:py-2">
                        {t('saveChanges')}
                    </Button>
                    <Button secondary className="px-8 max-sm:px-4 py-3 max-sm:py-2">
                        {t('cancel')}
                    </Button>
                </div>
            </form>
        </div>
    )
}
