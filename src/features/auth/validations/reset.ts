import z from "zod";

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

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>