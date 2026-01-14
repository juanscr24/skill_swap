import z from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: 'El email es requerido' })
    .min(1, 'El email es requerido')
    .email('Email inválido')
    .trim()
    .toLowerCase(),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>