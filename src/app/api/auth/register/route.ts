import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/validations/auth'
import { createUser } from '@/services/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validar los datos de entrada
    const validatedData = registerSchema.parse(body)

    // Crear el usuario
    const user = await createUser(validatedData)

    return NextResponse.json(
      {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error en registro:', error)

    // Error de validación de Zod
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Datos inválidos',
          errors: error.errors,
        },
        { status: 400 }
      )
    }

    // Error de usuario duplicado
    if (error.message === 'El email ya está registrado') {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 409 }
      )
    }

    // Error genérico
    return NextResponse.json(
      {
        success: false,
        message: 'Error al registrar usuario',
      },
      { status: 500 }
    )
  }
}
