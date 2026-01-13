import { z } from 'zod'

export const updateProfileSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(50).optional().or(z.literal('')),
    bio: z.string().max(500).nullable().optional(),
    city: z.string().max(100).nullable().optional(),
    image: z.string().url('URL de imagen inválida').nullable().optional().or(z.literal('')),
    image_public_id: z.string().nullable().optional(),
    title: z.string().max(100).nullable().optional(),
    social_links: z.record(z.string(), z.string()).nullable().optional(),
    availability: z.record(z.string(), z.any()).nullable().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const aboutMeSchema = updateProfileSchema.pick({
    name: true,
    bio: true,
    city: true,
    image: true,
    image_public_id: true,
    title: true,
})
