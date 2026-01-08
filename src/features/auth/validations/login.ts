import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string({ message: 'El email es requerido' })
        .min(1, 'El email es requerido')
        .email('Email inválido')
        .trim()
        .toLowerCase(),
    password: z.string({ message: 'La contraseña es requerida' })
        .min(1, 'La contraseña es requerida'),
})

export type LoginInput = z.infer<typeof loginSchema>
