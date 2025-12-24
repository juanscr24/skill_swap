import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { requestsService } from '@/services'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params

    await requestsService.cancelRequest(id, session.user.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error al cancelar solicitud:', error)
    return NextResponse.json(
      { error: error.message || 'Error al cancelar solicitud' },
      { status: 500 }
    )
  }
}
