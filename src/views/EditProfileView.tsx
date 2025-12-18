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
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-(--text-1) mb-8">{t('editProfile')}</h1>

            <form className="space-y-6">
                {/* Profile Photo */}
                <Card>
                    <h2 className="text-xl font-bold text-(--text-1) mb-4">{t('uploadPhoto')}</h2>
                    <div className="flex items-center gap-4">
                        <Avatar src={currentUser.image} alt={currentUser.name} size="xl" />
                        <Button secondary type="button">
                            {t('uploadPhoto')}
                        </Button>
                    </div>
                </Card>

                {/* Basic Info */}
                <Card>
                    <div className="space-y-4">
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
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-(--text-1)">{t('skillsTeach')}</h2>
                        <Button secondary type="button" className="flex items-center gap-2">
                            <FiPlus className="w-4 h-4" />
                            {t('addSkill')}
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {skills.map((skill) => (
                            <div key={skill.id} className="flex items-center gap-3 p-3 bg-(--bg-1) rounded-lg">
                                <div className="flex-1 grid grid-cols-2 gap-3">
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
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Skills I Want to Learn */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-(--text-1)">{t('skillsLearn')}</h2>
                        <Button secondary type="button" className="flex items-center gap-2">
                            <FiPlus className="w-4 h-4" />
                            {t('addSkill')}
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {wantedSkills.map((skill) => (
                            <Badge key={skill.id} variant="warning" className="flex items-center gap-2">
                                {skill.name}
                                <button
                                    type="button"
                                    className="hover:text-red-500"
                                >
                                    <FiX className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <Button primary className="flex-1 py-3">
                        {t('saveChanges')}
                    </Button>
                    <Button secondary className="px-8 py-3">
                        {t('cancel')}
                    </Button>
                </div>
            </form>
        </div>
    )
}
