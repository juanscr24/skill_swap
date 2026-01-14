import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body = await request.json()
    const { confirmPassword } = body

    if (!confirmPassword) {
      return NextResponse.json(
        { error: 'Se requiere confirmación de contraseña' },
        { status: 400 }
      )
    }

    // Obtener usuario
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, password: true, email: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Si tiene contraseña, verificarla
    if (user.password) {
      const bcrypt = require('bcrypt')
      const isValid = await bcrypt.compare(confirmPassword, user.password)

      if (!isValid) {
        return NextResponse.json(
          { error: 'Contraseña incorrecta' },
          { status: 400 }
        )
      }
    }

    // Eliminar usuario y todas sus relaciones (Prisma hará el cascade delete)
    await prisma.users.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: 'Cuenta eliminada correctamente'
    })
  } catch (error) {
    console.error('Error en POST /api/settings/delete-account:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la cuenta' },
      { status: 500 }
    )
  }
}
