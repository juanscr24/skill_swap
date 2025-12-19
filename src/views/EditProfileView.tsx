'use client'
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useProfile } from "@/hooks/useProfile"
import { useSkills } from "@/hooks/useSkills"
import { Avatar } from "@/components/ui/Avatar"
import { Card } from "@/components/ui/Card"
import { Button, Input } from "@/components"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { Badge } from "@/components/ui/Badge"
import { FiX, FiPlus, FiLoader, FiSave, FiArrowLeft } from "react-icons/fi"
import Link from "next/link"

export const EditProfileView = () => {
    const t = useTranslations('profile')
    const router = useRouter()
    const { profile, isLoading: isLoadingProfile, updateProfile } = useProfile()
    const { 
        skills, 
        wantedSkills, 
        isLoading: isLoadingSkills,
        addSkill,
        deleteSkill,
        addWantedSkill,
        deleteWantedSkill
    } = useSkills()

    // Form states
    const [name, setName] = useState('')
    const [city, setCity] = useState('')
    const [bio, setBio] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    // New skill states
    const [newSkillName, setNewSkillName] = useState('')
    const [newSkillLevel, setNewSkillLevel] = useState('')
    const [newWantedSkill, setNewWantedSkill] = useState('')
    const [showAddSkill, setShowAddSkill] = useState(false)
    const [showAddWantedSkill, setShowAddWantedSkill] = useState(false)

    // Loading states
    const [isSaving, setIsSaving] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    // Cargar datos del perfil cuando esté disponible
    useEffect(() => {
        if (profile) {
            setName(profile.name || '')
            setCity(profile.city || '')
            setBio(profile.bio || '')
            setImageUrl(profile.image || '')
        }
    }, [profile])

    const levelOptions = [
        { value: '', label: t('skillLevel') },
        { value: 'beginner', label: t('beginner') },
        { value: 'intermediate', label: t('intermediate') },
        { value: 'advanced', label: t('advanced') },
        { value: 'expert', label: 'Expert' }
    ]

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setSuccessMessage('')

        const result = await updateProfile({
            name,
            city,
            bio,
            image: imageUrl
        })

        setIsSaving(false)

        if (result.success) {
            setSuccessMessage('Perfil actualizado correctamente')
            setTimeout(() => {
                router.push('/profile')
            }, 1500)
        }
    }

    const handleAddSkill = async () => {
        if (!newSkillName.trim()) return

        const result = await addSkill({
            name: newSkillName.trim(),
            level: newSkillLevel as 'beginner' | 'intermediate' | 'advanced' | 'expert'
        })

        if (result.success) {
            setNewSkillName('')
            setNewSkillLevel('')
            setShowAddSkill(false)
        }
    }

    const handleAddWantedSkill = async () => {
        if (!newWantedSkill.trim()) return

        const result = await addWantedSkill(newWantedSkill.trim())

        if (result.success) {
            setNewWantedSkill('')
            setShowAddWantedSkill(false)
        }
    }

    const handleDeleteSkill = async (skillId: string) => {
        if (confirm('¿Estás seguro de eliminar esta skill?')) {
            await deleteSkill(skillId)
        }
    }

    const handleDeleteWantedSkill = async (wantedSkillId: string) => {
        if (confirm('¿Estás seguro de eliminar esta skill?')) {
            await deleteWantedSkill(wantedSkillId)
        }
    }

    if (isLoadingProfile || isLoadingSkills) {
        return (
            <div className="p-8 max-md:p-6 max-sm:p-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-center min-h-[400px]">
                    <FiLoader className="w-8 h-8 animate-spin text-(--button-1)" />
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="p-8 max-md:p-6 max-sm:p-4 max-w-3xl mx-auto">
                <Card className="p-6 text-center">
                    <p className="text-red-500">Error al cargar el perfil</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-8 max-md:p-6 max-sm:p-4 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 max-md:mb-6 max-sm:mb-4">
                <h1 className="text-3xl max-md:text-2xl max-sm:text-xl font-bold text-(--text-1)">
                    {t('editProfile')}
                </h1>
                <Link href="/profile">
                    <Button secondary className="flex items-center gap-2">
                        <FiArrowLeft className="w-4 h-4" />
                        {t('back') || 'Volver'}
                    </Button>
                </Link>
            </div>

            {/* Success Message */}
            {successMessage && (
                <Card className="mb-6 bg-green-50 border-green-500">
                    <p className="text-green-700 font-medium">{successMessage}</p>
                </Card>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6 max-md:space-y-4 max-sm:space-y-3">
                {/* Profile Photo */}
                <Card>
                    <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-(--text-1) mb-4 max-sm:mb-3">
                        {t('uploadPhoto')}
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center gap-4 max-sm:gap-3">
                        <Avatar src={imageUrl} alt={name} size="xl" />
                        <div className="flex-1 w-full">
                            <Input
                                type="text"
                                label="URL de la imagen"
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://ejemplo.com/tu-foto.jpg"
                            />
                            <p className="text-xs text-(--text-2) mt-1">
                                Por ahora ingresa la URL de tu imagen. Pronto podrás subir archivos.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Basic Info */}
                <Card>
                    <div className="space-y-4 max-sm:space-y-3">
                        <Input
                            type="text"
                            label={t('name')}
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Juan Pérez"
                            required
                        />
                        <Input
                            type="text"
                            label={t('city')}
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Madrid"
                        />
                        <Textarea
                            label={t('bio')}
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder={t('bio')}
                            rows={4}
                        />
                    </div>
                </Card>

                {/* Skills I Teach */}
                <Card>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 max-sm:mb-3 gap-3">
                        <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-(--text-1)">
                            {t('skillsTeach')}
                        </h2>
                        <Button 
                            secondary 
                            type="button" 
                            onClick={() => setShowAddSkill(!showAddSkill)}
                            className="flex items-center gap-2 max-sm:gap-1 max-sm:text-sm max-sm:w-full"
                        >
                            <FiPlus className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                            {t('addSkill')}
                        </Button>
                    </div>

                    {/* Add New Skill Form */}
                    {showAddSkill && (
                        <div className="mb-4 p-4 bg-(--bg-1) rounded-lg border border-(--border-1)">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <Input
                                    type="text"
                                    placeholder={t('skillName')}
                                    value={newSkillName}
                                    onChange={(e) => setNewSkillName(e.target.value)}
                                />
                                <Select
                                    options={levelOptions}
                                    value={newSkillLevel}
                                    onChange={(e) => setNewSkillLevel(e.target.value)}
                                    placeholder={t('skillLevel')}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    type="button" 
                                    onClick={handleAddSkill}
                                    disabled={!newSkillName.trim()}
                                    className="flex-1"
                                >
                                    Agregar
                                </Button>
                                <Button 
                                    secondary 
                                    type="button" 
                                    onClick={() => {
                                        setShowAddSkill(false)
                                        setNewSkillName('')
                                        setNewSkillLevel('')
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Skills List */}
                    <div className="space-y-3 max-sm:space-y-2">
                        {skills.length === 0 ? (
                            <p className="text-(--text-2) text-sm text-center py-4">
                                No tienes skills agregadas. Haz clic en "Agregar Skill" para añadir una.
                            </p>
                        ) : (
                            skills.map((skill) => (
                                <div key={skill.id} className="flex items-center gap-3 max-sm:gap-2 p-3 max-sm:p-2 bg-(--bg-1) rounded-lg border border-(--border-1)">
                                    <div className="flex-1">
                                        <p className="font-medium text-(--text-1)">{skill.name}</p>
                                        <p className="text-sm text-(--text-2)">
                                            Nivel: {skill.level || 'No especificado'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSkill(skill.id)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                    >
                                        <FiX className="w-5 h-5 max-sm:w-4 max-sm:h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Skills I Want to Learn */}
                <Card>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 max-sm:mb-3 gap-3">
                        <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-(--text-1)">
                            {t('skillsLearn')}
                        </h2>
                        <Button 
                            secondary 
                            type="button" 
                            onClick={() => setShowAddWantedSkill(!showAddWantedSkill)}
                            className="flex items-center gap-2 max-sm:gap-1 max-sm:text-sm max-sm:w-full"
                        >
                            <FiPlus className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                            {t('addSkill')}
                        </Button>
                    </div>

                    {/* Add New Wanted Skill Form */}
                    {showAddWantedSkill && (
                        <div className="mb-4 p-4 bg-(--bg-1) rounded-lg border border-(--border-1)">
                            <Input
                                type="text"
                                placeholder="Nombre de la skill que quieres aprender"
                                value={newWantedSkill}
                                onChange={(e) => setNewWantedSkill(e.target.value)}
                                className="mb-3"
                            />
                            <div className="flex gap-2">
                                <Button 
                                    type="button" 
                                    onClick={handleAddWantedSkill}
                                    disabled={!newWantedSkill.trim()}
                                    className="flex-1"
                                >
                                    Agregar
                                </Button>
                                <Button 
                                    secondary 
                                    type="button" 
                                    onClick={() => {
                                        setShowAddWantedSkill(false)
                                        setNewWantedSkill('')
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Wanted Skills List */}
                    <div className="flex flex-wrap gap-2">
                        {wantedSkills.length === 0 ? (
                            <p className="text-(--text-2) text-sm text-center py-4 w-full">
                                No tienes skills que quieras aprender. Haz clic en "Agregar Skill" para añadir una.
                            </p>
                        ) : (
                            wantedSkills.map((skill) => (
                                <Badge key={skill.id} variant="warning" className="flex items-center gap-2 max-sm:gap-1">
                                    <span className="max-sm:text-xs">{skill.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteWantedSkill(skill.id)}
                                        className="hover:text-red-500"
                                    >
                                        <FiX className="w-3 h-3 max-sm:w-2.5 max-sm:h-2.5" />
                                    </button>
                                </Badge>
                            ))
                        )}
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 max-sm:gap-3">
                    <Button 
                        primary 
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 py-3 max-sm:py-2 flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <FiLoader className="w-4 h-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <FiSave className="w-4 h-4" />
                                {t('saveChanges')}
                            </>
                        )}
                    </Button>
                    <Link href="/profile" className="sm:w-auto w-full">
                        <Button secondary className="w-full px-8 max-sm:px-4 py-3 max-sm:py-2">
                            {t('cancel')}
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    )
}
