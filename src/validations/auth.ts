import { z } from 'zod'

// Schema de validación para login
export const loginSchema = z.object({
  email: z
    .string({ message: 'El email es requerido' })
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .trim()
    .toLowerCase(),
  password: z
    .string({ message: 'La contraseña es requerida' })
    .min(1, 'La contraseña es requerida'),
})

// Schema de validación para registro
export const registerSchema = z.object({
  name: z
    .string({ message: 'El nombre es requerido' })
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es muy largo (máximo 100 caracteres)')
    .trim()
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  email: z
    .string({ message: 'El email es requerido' })
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .trim()
    .toLowerCase(),
  password: z
    .string({ message: 'La contraseña es requerida' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es muy larga (máximo 100 caracteres)')
    .regex(
      /^(?=.*[a-z])/,
      'La contraseña debe contener al menos una letra minúscula'
    )
    .regex(
      /^(?=.*[A-Z])/,
      'La contraseña debe contener al menos una letra mayúscula'
    )
    .regex(
      /^(?=.*\d)/,
      'La contraseña debe contener al menos un número'
    )
    .regex(
      /^(?=.*[@$!%*?&.#])/,
      'La contraseña debe contener al menos un carácter especial (@$!%*?&.#)'
    ),
  confirmPassword: z
    .string({ message: 'Confirma tu contraseña' })
    .min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// Schema para recuperación de contraseña
export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: 'El email es requerido' })
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .trim()
    .toLowerCase(),
})

// Schema para resetear contraseña
export const resetPasswordSchema = z.object({
  password: z
    .string({ message: 'La contraseña es requerida' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es muy larga (máximo 100 caracteres)')
    .regex(
      /^(?=.*[a-z])/,
      'La contraseña debe contener al menos una letra minúscula'
    )
    .regex(
      /^(?=.*[A-Z])/,
      'La contraseña debe contener al menos una letra mayúscula'
    )
    .regex(
      /^(?=.*\d)/,
      'La contraseña debe contener al menos un número'
    )
    .regex(
      /^(?=.*[@$!%*?&.#])/,
      'La contraseña debe contener al menos un carácter especial (@$!%*?&.#)'
    ),
  confirmPassword: z
    .string({ message: 'Confirma tu contraseña' })
    .min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// Tipos TypeScript derivados de los schemas
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
