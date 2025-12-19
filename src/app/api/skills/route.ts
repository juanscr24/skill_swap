import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import {
  getUserSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '@/services/skills'

/**
 * GET /api/skills
 * Obtiene todas las skills del usuario autenticado
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

    const skills = await getUserSkills(session.user.id)
    return NextResponse.json(skills)
  } catch (error: any) {
    console.error('Error getting skills:', error)
    return NextResponse.json(
      { message: error.message || 'Error al obtener skills' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/skills
 * Crea una nueva skill para el usuario autenticado
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
    const { name, description, level } = body

    if (!name) {
      return NextResponse.json(
        { message: 'El nombre de la skill es requerido' },
        { status: 400 }
      )
    }

    const skill = await createSkill(session.user.id, {
      name,
      description,
      level,
    })

    return NextResponse.json(skill, { status: 201 })
  } catch (error: any) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { message: error.message || 'Error al crear skill' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/skills
 * Actualiza una skill existente
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, name, description, level } = body

    if (!id) {
      return NextResponse.json(
        { message: 'El ID de la skill es requerido' },
        { status: 400 }
      )
    }

    const skill = await updateSkill(id, session.user.id, {
      name,
      description,
      level,
    })

    return NextResponse.json(skill)
  } catch (error: any) {
    console.error('Error updating skill:', error)
    return NextResponse.json(
      { message: error.message || 'Error al actualizar skill' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/skills
 * Elimina una skill
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
        { message: 'El ID de la skill es requerido' },
        { status: 400 }
      )
    }

    await deleteSkill(id, session.user.id)

    return NextResponse.json({ message: 'Skill eliminada correctamente' })
  } catch (error: any) {
    console.error('Error deleting skill:', error)
    return NextResponse.json(
      { message: error.message || 'Error al eliminar skill' },
      { status: 500 }
    )
  }
}
