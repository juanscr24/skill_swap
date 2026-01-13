import { z } from 'zod'

export const sessionRequestSchema = z.object({
    mentor_id: z.string().uuid('ID de mentor inválido'),
    availability_id: z.string().uuid('ID de disponibilidad inválido'),
    title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(100),
    description: z.string().max(500).optional(),
    duration_minutes: z.number().int().min(30, 'La duración mínima es de 30 minutos').max(120),
})

export type SessionRequestInput = z.infer<typeof sessionRequestSchema>

export const updateSessionStatusSchema = z.object({
    sessionId: z.string().uuid('ID de sesión inválido'),
    status: z.enum(['pending', 'accepted', 'rejected', 'confirmed', 'cancelled', 'completed']),
})
