import { z } from 'zod'

const strongPassword = z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es muy larga')
    .regex(/^(?=.*[a-z])/, 'Al menos una minúscula')
    .regex(/^(?=.*[A-Z])/, 'Al menos una mayúscula')
    .regex(/^(?=.*\d)/, 'Al menos un número')
    .regex(/^(?=.*[@$!%*?&.#])/, 'Al menos un carácter especial')

export const registerSchema = z.object({
    name: z.string()
        .min(2, 'Mínimo 2 caracteres')
        .max(100, 'Máximo 100 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo letras y espacios')
        .trim(),
    email: z.string().email('Email inválido').trim().toLowerCase(),
    password: strongPassword,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
})

export type RegisterInput = z.infer<typeof registerSchema>
