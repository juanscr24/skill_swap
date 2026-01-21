import z from "zod";

// Helper para crear el schema con mensajes traducidos
export const createForgotPasswordSchema = (t: (key: string) => string) => {
  return z.object({
    email: z
      .string({ message: t('validation.emailRequired') })
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid'))
      .trim()
      .toLowerCase(),
  })
}

// Schema por defecto (español) para mantener compatibilidad
export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: 'El email es requerido' })
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .trim()
    .toLowerCase(),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>