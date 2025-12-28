'use client'
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card } from "@/components/ui/Card"
import { Button, Input } from "@/components"
import { Textarea } from "@/components/ui/Textarea"
import { Avatar } from "@/components/ui/Avatar"
import { FiLoader, FiSave, FiUpload } from "react-icons/fi"

interface EditAboutMeSectionProps {
  profile: {
    name: string | null
    title?: string | null
    city?: string | null
    bio?: string | null
    image?: string | null
    image_public_id?: string | null
  }
  onUpdate: (data: Partial<EditAboutMeSectionProps['profile']>) => Promise<{ success: boolean }>
}

export const EditAboutMeSection = ({ profile, onUpdate }: EditAboutMeSectionProps) => {
  const t = useTranslations('profile')
  
  const [name, setName] = useState(profile.name || '')
  const [title, setTitle] = useState(profile.title || '')
  const [city, setCity] = useState(profile.city || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [imageUrl, setImageUrl] = useState(profile.image || '')
  const [imagePublicId, setImagePublicId] = useState(profile.image_public_id || '')
  
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setName(profile.name || '')
    setTitle(profile.title || '')
    setCity(profile.city || '')
    setBio(profile.bio || '')
    setImageUrl(profile.image || '')
    setImagePublicId(profile.image_public_id || '')
  }, [profile])

  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMessage('Name is required')
      return
    }

    setIsSaving(true)
    setSuccessMessage('')
    setErrorMessage('')

    const result = await onUpdate({
      name: name.trim(),
      title: title.trim() || null,
      city: city.trim() || null,
      bio: bio.trim() || null,
      image: imageUrl || null,
      image_public_id: imagePublicId || null
    })

    setIsSaving(false)

    if (result.success) {
      setSuccessMessage('About Me updated successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } else {
      setErrorMessage('Error updating About Me')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please select a valid image (JPG, PNG, WEBP or GIF)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image must not exceed 5MB')
      return
    }

    setIsUploadingImage(true)
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error uploading image')
      }

      setImageUrl(data.url)
      setImagePublicId(data.publicId)
      setSuccessMessage('Image uploaded successfully')
      setTimeout(() => setSuccessMessage(''), 3000)

    } catch (error) {
      console.error('Error uploading image:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Error uploading image')
    } finally {
      setIsUploadingImage(false)
    }
  }

  return (
    <Card>
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-xl text-sm text-green-800 dark:text-green-200">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-xl text-sm text-red-800 dark:text-red-200">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-(--text-2)">
        {/* Photo Section */}
        <div className="md:col-span-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative group mb-3">
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
            <p className="text-xs text-(--text-2) text-center">JPG, PNG or GIF (Max 5MB)</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="md:col-span-2 space-y-4">
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
          <Textarea
            label={t('bio')}
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={6}
            className="resize-none"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          primary
          onClick={handleSave}
          disabled={isSaving || isUploadingImage}
          className="px-6"
        >
          <div className="flex items-center gap-2">
            {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
            {t('saveChanges')}
          </div>
        </Button>
      </div>
    </Card>
  )
}
