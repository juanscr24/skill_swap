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
import { SkillSelector } from "@/components/ui/SkillSelector"
import { recommendedSkills } from "@/constants/recommendedSkills"
import { FiX, FiPlus, FiLoader, FiSave, FiArrowLeft, FiUpload } from "react-icons/fi"
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
    const [imagePublicId, setImagePublicId] = useState('')

    // New skill states (solo nivel para skills que enseño)
    const [newSkillLevel, setNewSkillLevel] = useState('')
    const [skillToAddWithLevel, setSkillToAddWithLevel] = useState('')

    // Loading states
    const [isSaving, setIsSaving] = useState(false)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
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
            image: imageUrl,
            image_public_id: imagePublicId
        })

        setIsSaving(false)

        if (result.success) {
            setSuccessMessage('Perfil actualizado correctamente')
            setTimeout(() => {
                router.push('/profile')
            }, 1500)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        if (!validTypes.includes(file.type)) {
            alert('Por favor selecciona una imagen válida (JPG, PNG, WEBP o GIF)')
            return
        }

        // Validar tamaño (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen no debe superar los 5MB')
            return
        }

        setIsUploadingImage(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al subir la imagen')
            }

            setImageUrl(data.url)
            setImagePublicId(data.publicId)
            setSuccessMessage('Imagen subida correctamente')
            setTimeout(() => setSuccessMessage(''), 3000)

        } catch (error) {
            console.error('Error uploading image:', error)
            alert(error instanceof Error ? error.message : 'Error al subir la imagen. Intenta de nuevo.')
        } finally {
            setIsUploadingImage(false)
        }
    }

    const handleAddSkill = async (skillName: string) => {
        if (!skillName.trim()) return

        // Guardar el nombre de la skill y esperar que el usuario seleccione el nivel
        setSkillToAddWithLevel(skillName)
    }

    const handleConfirmAddSkill = async () => {
        if (!skillToAddWithLevel || !newSkillLevel) return

        const result = await addSkill({
            name: skillToAddWithLevel.trim(),
            level: newSkillLevel as 'beginner' | 'intermediate' | 'advanced' | 'expert'
        })

        if (result.success) {
            setSkillToAddWithLevel('')
            setNewSkillLevel('')
        }
    }

    const handleAddWantedSkill = async (skillName: string) => {
        if (!skillName.trim()) return

        const result = await addWantedSkill(skillName.trim())

        if (!result.success) {
            alert('Error al agregar la habilidad')
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
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 font-medium">{successMessage}</p>
                </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6 max-md:space-y-4 max-sm:space-y-3">
                {/* Profile Photo */}
                <Card>
                    <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-(--text-1) mb-4 max-sm:mb-3">
                        {t('uploadPhoto')}
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center gap-6 max-sm:gap-4">
                        <div className="relative">
                            <Avatar src={imageUrl} alt={name} size="xl" />
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-(--button-1) rounded-full flex items-center justify-center shadow-lg">
                                <FiUpload className="w-4 h-4 text-(--button-1-text)" />
                            </div>
                        </div>
                        <div className="flex-1 w-full space-y-3">
                            {/* Subir desde PC */}
                            <div>
                                <label 
                                    htmlFor="file-upload" 
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-(--button-1) text-(--button-1-text) rounded-lg cursor-pointer hover:opacity-90 transition-opacity font-medium shadow-sm"
                                >
                                    {isUploadingImage ? (
                                        <>
                                            <FiLoader className="w-4 h-4 animate-spin" />
                                            Subiendo...
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload className="w-4 h-4" />
                                            Subir desde PC
                                        </>
                                    )}
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={isUploadingImage}
                                />
                                <p className="text-xs text-(--text-2) mt-2">
                                    JPG, PNG, WEBP o GIF (máx. 5MB)
                                </p>
                            </div>

                            {/* O ingresar URL */}
                            <div>
                                <Input
                                    type="text"
                                    label="O ingresa una URL"
                                    id="imageUrl"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://ejemplo.com/tu-foto.jpg"
                                />
                            </div>
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
                    <div className="mb-6">
                        <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-(--text-1) mb-2">
                            {t('skillsTeach')}
                        </h2>
                        <p className="text-sm text-(--text-2)">
                            Selecciona las habilidades que puedes enseñar a otros
                        </p>
                    </div>

                    {/* Skill Selector */}
                    <SkillSelector
                        onAdd={handleAddSkill}
                        placeholder="Buscar o agregar habilidad que enseñas..."
                        recommendations={recommendedSkills}
                    />

                    {/* Level Selection (aparece cuando se selecciona una skill) */}
                    {skillToAddWithLevel && (
                        <div className="mt-4 p-4 bg-(--bg-1) border-2 border-(--button-1) rounded-lg">
                            <p className="text-sm font-medium text-(--text-1) mb-3">
                                Selecciona tu nivel en: <span className="text-(--button-1)">{skillToAddWithLevel}</span>
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {levelOptions.filter(opt => opt.value).map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setNewSkillLevel(option.value)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                            newSkillLevel === option.value
                                                ? 'bg-(--button-1) text-(--button-1-text) scale-105'
                                                : 'bg-(--bg-2) text-(--text-1) border border-(--border-1) hover:border-(--button-1)'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-3">
                                <Button
                                    type="button"
                                    onClick={handleConfirmAddSkill}
                                    disabled={!newSkillLevel}
                                    className="flex-1"
                                    primary
                                >
                                    Confirmar
                                </Button>
                                <Button
                                    secondary
                                    type="button"
                                    onClick={() => {
                                        setSkillToAddWithLevel('')
                                        setNewSkillLevel('')
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Skills List */}
                    <div className="mt-6 space-y-3 max-sm:space-y-2">
                        {skills.length === 0 ? (
                            <div className="text-center py-8 px-4 bg-(--bg-1) rounded-lg border-2 border-dashed border-(--border-1)">
                                <p className="text-(--text-2) text-sm">
                                    No tienes habilidades agregadas. Usa el selector para añadir habilidades que puedes enseñar.
                                </p>
                            </div>
                        ) : (
                            skills.map((skill) => (
                                <div key={skill.id} className="flex items-center gap-3 max-sm:gap-2 p-4 max-sm:p-3 bg-(--bg-1) rounded-lg border border-(--border-1) hover:border-(--button-1) transition-colors group">
                                    <div className="flex-1">
                                        <p className="font-semibold text-(--text-1) text-lg max-sm:text-base">{skill.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="warning" className="text-xs">
                                                {skill.level || 'No especificado'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSkill(skill.id)}
                                        className="text-(--text-2) hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
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
                    <div className="mb-6">
                        <h2 className="text-xl max-md:text-lg max-sm:text-base font-bold text-(--text-1) mb-2">
                            {t('skillsLearn')}
                        </h2>
                        <p className="text-sm text-(--text-2)">
                            Selecciona las habilidades que quieres aprender de otros
                        </p>
                    </div>

                    {/* Skill Selector */}
                    <SkillSelector
                        onAdd={handleAddWantedSkill}
                        placeholder="Buscar o agregar habilidad que quieres aprender..."
                        recommendations={recommendedSkills}
                    />

                    {/* Wanted Skills List */}
                    <div className="mt-6 flex flex-wrap gap-3 max-sm:gap-2">
                        {wantedSkills.length === 0 ? (
                            <div className="w-full text-center py-8 px-4 bg-(--bg-1) rounded-lg border-2 border-dashed border-(--border-1)">
                                <p className="text-(--text-2) text-sm">
                                    No tienes habilidades que quieras aprender. Usa el selector para añadir habilidades que te interesan.
                                </p>
                            </div>
                        ) : (
                            wantedSkills.map((skill) => (
                                <Badge 
                                    key={skill.id} 
                                    variant="warning" 
                                    className="flex items-center gap-2 max-sm:gap-1 px-4 py-2 text-base max-sm:text-sm group hover:scale-105 transition-transform cursor-pointer"
                                >
                                    <span className="font-medium">{skill.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteWantedSkill(skill.id)}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <FiX className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
                                    </button>
                                </Badge>
                            ))
                        )}
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 max-sm:gap-3 pt-4">
                    <Button 
                        primary 
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 py-4 max-sm:py-3 flex items-center justify-center gap-2 font-semibold text-lg max-sm:text-base shadow-lg hover:shadow-xl transition-all"
                    >
                        {isSaving ? (
                            <>
                                <FiLoader className="w-5 h-5 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <FiSave className="w-5 h-5" />
                                {t('saveChanges')}
                            </>
                        )}
                    </Button>
                    <Link href="/profile" className="sm:w-auto w-full">
                        <Button secondary className="w-full px-8 max-sm:px-4 py-4 max-sm:py-3 font-semibold text-lg max-sm:text-base">
                            {t('cancel')}
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    )
}
