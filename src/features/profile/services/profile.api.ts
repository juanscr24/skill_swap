import { UserProfile } from "../hooks/useProfile"

interface UpdateProfileData {
    name?: string | null
    bio?: string | null
    city?: string | null
    image?: string | null
    image_public_id?: string | null
    title?: string | null
    social_links?: any
    availability?: any
}

export const getProfile = async (): Promise<UserProfile> => {
    const response = await fetch('/api/users/profile')
    if (!response.ok) throw new Error('Error fetching profile')
    return response.json()
}

export const updateProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
    const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al actualizar el perfil')
    }
    return response.json()
}

export const updateAboutMe = async (data: UpdateProfileData): Promise<UserProfile> => {
    const response = await fetch('/api/users/profile/about-me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al actualizar About Me')
    }
    return response.json()
}
