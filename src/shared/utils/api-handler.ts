import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

/**
 * Clase personalizada para errores de API
 */
export class ApiError extends Error {
    constructor(public message: string, public status: number = 500) {
        super(message)
        this.name = 'ApiError'
    }
}

/**
 * Wrapper para manejar errores en rutas de API de forma centralizada
 */
export async function withErrorHandler(fn: () => Promise<NextResponse>) {
    try {
        return await fn()
    } catch (error: any) {
        console.error('API Error:', error)

        // Error de validación Zod
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    message: 'Error de validación',
                    errors: error.issues.map((err) => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                },
                { status: 400 }
            )
        }

        // Error de API personalizado
        if (error instanceof ApiError) {
            return NextResponse.json(
                { message: error.message },
                { status: error.status }
            )
        }

        // Errores con código de estado (como los de Prisma si los envolvemos)
        if (error.status) {
            return NextResponse.json(
                { message: error.message },
                { status: error.status }
            )
        }

        // Error genérico
        return NextResponse.json(
            { message: error.message || 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
