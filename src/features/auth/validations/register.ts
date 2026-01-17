import { z } from 'zod'

// Helper para crear el schema con mensajes traducidos
export const createRegisterSchema = (t: (key: string) => string) => {
    const strongPassword = z.string()
        .min(8, t('validation.passwordMin'))
        .max(100, t('validation.passwordMax'))
        .regex(/^(?=.*[a-z])/, t('validation.passwordLowercase'))
        .regex(/^(?=.*[A-Z])/, t('validation.passwordUppercase'))
        .regex(/^(?=.*\d)/, t('validation.passwordNumber'))
        .regex(/^(?=.*[@$!%*?&.#])/, t('validation.passwordSpecial'))

    return z.object({
        name: z.string()
            .min(2, t('validation.nameMin'))
            .max(100, t('validation.nameMax'))
            .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, t('validation.nameLetters'))
            .trim(),
        email: z.string().email(t('validation.emailInvalid')).trim().toLowerCase(),
        password: strongPassword,
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('validation.passwordMismatch'),
        path: ['confirmPassword'],
    })
}

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
