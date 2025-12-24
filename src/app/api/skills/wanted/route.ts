import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import {
  getUserWantedSkills,
  createWantedSkill,
  deleteWantedSkill,
} from '@/services/skills'

/**
 * GET /api/skills/wanted
 * Obtiene todas las wanted_skills del usuario autenticado
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

    const wantedSkills = await getUserWantedSkills(session.user.id)
    return NextResponse.json(wantedSkills)
  } catch (error: any) {
    console.error('Error getting wanted skills:', error)
    return NextResponse.json(
      { message: error.message || 'Error al obtener wanted skills' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/skills/wanted
 * Crea una nueva wanted_skill para el usuario autenticado
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
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { message: 'El nombre de la wanted skill es requerido' },
        { status: 400 }
      )
    }

    const wantedSkill = await createWantedSkill(session.user.id, name)

    return NextResponse.json(wantedSkill, { status: 201 })
  } catch (error: any) {
    console.error('Error creating wanted skill:', error)
    return NextResponse.json(
      { message: error.message || 'Error al crear wanted skill' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/skills/wanted
 * Elimina una wanted_skill
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'El ID de la wanted skill es requerido' },
        { status: 400 }
      )
    }

    await deleteWantedSkill(id, session.user.id)

    return NextResponse.json({
      message: 'Wanted skill eliminada correctamente',
    })
  } catch (error: any) {
    console.error('Error deleting wanted skill:', error)
    return NextResponse.json(
      { message: error.message || 'Error al eliminar wanted skill' },
      { status: 500 }
    )
  }
}
