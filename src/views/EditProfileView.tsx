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
import { Badge } from "@/components/ui/Badge"
import { SkillSelector } from "@/components/ui/SkillSelector"
import { recommendedSkills } from "@/constants/recommendedSkills"
import { FiX, FiLoader, FiSave, FiArrowLeft, FiUpload, FiCheck } from "react-icons/fi"
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
    const [title, setTitle] = useState('')
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
            setTitle(profile.title || '')
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
            title,
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
            <div className="p-8 max-md:p-6 max-sm:p-4 max-w-7xl mx-auto">
                <div className="flex items-center justify-center min-h-100">
                    <FiLoader className="w-8 h-8 animate-spin text-(--button-1)" />
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="p-8 max-md:p-6 max-sm:p-4 max-w-7xl mx-auto">
                <Card className="p-6 text-center">
                    <p className="text-red-500">Error al cargar el perfil</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="px-30 max-2xl:px-14 max-lg:px-10 max-md:px-6 max-sm:px-4 py-8 max-md:py-6 max-sm:py-4 mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-(--text-1)">Edit Profile</h1>
                    <p className="text-(--text-2)">Update your personal details and skills.</p>
                </div>
                <Link href="/profile">
                    <Button secondary className="flex items-center gap-2">
                        <FiArrowLeft />
                        {t('back')}
                    </Button>
                </Link>
            </div>

            {successMessage && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-xl flex items-center gap-2 text-green-800 dark:text-green-200">
                    <FiCheck /> {successMessage}
                </div>
            )}

            <form onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Basic Info & Photo */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card>
                            <div className="flex flex-col items-center text-center">
                                <div className="relative group mb-4">
                                    <Avatar src={imageUrl} alt={name} size="xl" className="w-32 h-32 ring-4 ring-(--bg-1)" />
                                    <label
                                        htmlFor="photo-upload"
                                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                                    >
                                        <FiUpload className="text-white w-6 h-6" />
                                    </label>
                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={isUploadingImage}
                                    />
                                </div>
                                {isUploadingImage && <p className="text-xs text-(--button-1) mb-2">Uploading...</p>}
                                <p className="text-xs text-(--text-2)">JPG, PNG or GIF (Max 5MB)</p>
                            </div>

                            <div className="mt-6 space-y-4">
                                <Input
                                    label={t('name')}
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                    required
                                />
                                <Input
                                    label="Title / Role"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Senior Developer"
                                />
                                <Input
                                    label={t('city')}
                                    id="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="e.g. New York"
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Bio & Skills */}
                    <div className="lg:col-span-8 space-y-6">
                        <Card>
                            <h2 className="text-xl font-bold text-(--text-1) mb-4">About Me</h2>
                            <Textarea
                                label={t('bio')}
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself..."
                                rows={6}
                                className="resize-none"
                            />
                        </Card>

                        <Card>
                            <h2 className="text-xl font-bold text-(--text-1) mb-2">{t('skillsTeach')}</h2>
                            <p className="text-sm text-(--text-2) mb-6">{t('selectSkillsYouTeach')}</p>

                            <SkillSelector
                                onAdd={handleAddSkill}
                                placeholder={t('searchOrAddSkillTeach')}
                                recommendations={recommendedSkills}
                            />

                            {skillToAddWithLevel && (
                                <div className="mt-4 p-4 bg-(--bg-1) rounded-xl border border-(--border-1) animate-in fade-in slide-in-from-top-2">
                                    <p className="text-sm font-medium text-(--text-1) mb-3">
                                        Select level for <span className="font-bold text-(--button-1)">{skillToAddWithLevel}</span>
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {levelOptions.filter(opt => opt.value).map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setNewSkillLevel(option.value)}
                                                className={`px-3 py-1.5 text-sm rounded-lg transition-all ${newSkillLevel === option.value
                                                    ? 'bg-(--button-1) text-(--button-1-text)'
                                                    : 'bg-(--bg-2) text-(--text-2) border border-(--border-1) hover:border-(--button-1)'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            onClick={handleConfirmAddSkill}
                                            disabled={!newSkillLevel}
                                            primary
                                            className="text-sm py-1.5"
                                        >
                                            Confirm
                                        </Button>
                                        <Button
                                            secondary
                                            type="button"
                                            onClick={() => {
                                                setSkillToAddWithLevel('')
                                                setNewSkillLevel('')
                                            }}
                                            className="text-sm py-1.5"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 space-y-2">
                                {skills.length === 0 ? (
                                    <p className="text-(--text-2) text-sm italic">No skills added yet.</p>
                                ) : (
                                    skills.map((skill) => (
                                        <div key={skill.id} className="flex items-center justify-between p-3 bg-(--bg-1) rounded-xl border border-(--border-1)">
                                            <div>
                                                <p className="font-semibold text-(--text-1)">{skill.name}</p>
                                                <span className="text-xs text-(--text-2) uppercase tracking-wider">{skill.level}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSkill(skill.id)}
                                                className="text-(--text-2) hover:text-red-500 p-2"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-xl font-bold text-(--text-1) mb-2">{t('skillsLearn')}</h2>
                            <p className="text-sm text-(--text-2) mb-6">{t('selectSkillsYouLearn')}</p>

                            <SkillSelector
                                onAdd={handleAddWantedSkill}
                                placeholder={t('searchOrAddSkillLearn')}
                                recommendations={recommendedSkills}
                            />

                            <div className="mt-6 flex flex-wrap gap-2">
                                {wantedSkills.length === 0 ? (
                                    <p className="text-(--text-2) text-sm italic">No wanted skills added yet.</p>
                                ) : (
                                    wantedSkills.map((skill) => (
                                        <Badge
                                            key={skill.id}
                                            variant="warning"
                                            className="pl-3 pr-1 py-1.5 flex items-center gap-1 group bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                                        >
                                            {skill.name}
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteWantedSkill(skill.id)}
                                                className="p-1 hover:text-red-500 rounded-full transition-colors"
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </Badge>
                                    ))
                                )}
                            </div>
                        </Card>

                        <div className="flex gap-4 pt-4">
                            <Button
                                primary
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 py-3 text-lg"
                            >
                                <div className="flex items-center justify-center gap-4">
                                    {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
                                    {t('saveChanges')}
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
