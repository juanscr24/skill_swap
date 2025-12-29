import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { getUserLanguages, createLanguage, deleteLanguage } from '@/services/languages'

/**
 * GET /api/languages
 * Get all languages for the authenticated user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      )
    }

    const languages = await getUserLanguages(session.user.id)

    return NextResponse.json(languages)
  } catch (error: any) {
    console.error('Error getting languages:', error)
    return NextResponse.json(
      { message: error.message || 'Error al obtener idiomas' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/languages
 * Create a new language for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, level } = body

    if (!name) {
      return NextResponse.json(
        { message: 'El nombre del idioma es requerido' },
        { status: 400 }
      )
    }

    const language = await createLanguage(session.user.id, { name, level })

    return NextResponse.json(language, { status: 201 })
  } catch (error: any) {
    console.error('Error creating language:', error)
    return NextResponse.json(
      { message: error.message || 'Error al crear idioma' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/languages
 * Delete a language for the authenticated user
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const languageId = searchParams.get('id')

    if (!languageId) {
      return NextResponse.json(
        { message: 'ID del idioma es requerido' },
        { status: 400 }
      )
    }

    await deleteLanguage(session.user.id, languageId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting language:', error)
    return NextResponse.json(
      { message: error.message || 'Error al eliminar idioma' },
      { status: 500 }
    )
  }
}
