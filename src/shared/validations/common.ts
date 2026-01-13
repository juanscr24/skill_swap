import { z } from 'zod'

export const commonSchemas = {
    id: z.string().uuid('ID inválido'),
    email: z.string()
        .min(1, 'El email es requerido')
        .email('Email inválido')
        .trim()
        .toLowerCase(),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    name: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre es demasiado largo'),
    nonEmptyString: (field: string) => z.string().min(1, `${field} es requerido`),
}

export const loginSchema = z.object({
    email: commonSchemas.email,
    password: z.string().min(1, 'La contraseña es requerida'),
})

export type LoginInput = z.infer<typeof loginSchema>
