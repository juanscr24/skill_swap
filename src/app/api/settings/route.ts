import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib'
import { prisma } from '@/lib/prisma'

// GET - Obtener configuración del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Buscar o crear configuración del usuario
    let userSettings = await prisma.user_settings.findUnique({
      where: { user_id: userId }
    })

    // Si no existe, crear con valores por defecto
    if (!userSettings) {
      userSettings = await prisma.user_settings.create({
        data: {
          user_id: userId
        }
      })
    }

    return NextResponse.json({
      notifications: {
        email: userSettings.email_notifications,
        push: userSettings.push_notifications,
        news: userSettings.news_notifications,
        security: userSettings.security_notifications,
        mentors: userSettings.mentors_notifications,
        messages: userSettings.messages_notifications
      },
      privacy: {
        visibility: userSettings.profile_visibility,
        messagesPrivacy: userSettings.messages_privacy
      }
    })
  } catch (error) {
    console.error('Error en GET /api/settings:', error)
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar configuración del usuario
export async function PUT(request: NextRequest) {
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

    const { notifications, privacy } = body

    // Actualizar o crear configuración
    const userSettings = await prisma.user_settings.upsert({
      where: { user_id: userId },
      update: {
        ...(notifications && {
          email_notifications: notifications.email,
          push_notifications: notifications.push,
          news_notifications: notifications.news,
          security_notifications: notifications.security,
          mentors_notifications: notifications.mentors,
          messages_notifications: notifications.messages
        }),
        ...(privacy && {
          profile_visibility: privacy.visibility,
          messages_privacy: privacy.messagesPrivacy
        }),
        updated_at: new Date()
      },
      create: {
        user_id: userId,
        email_notifications: notifications?.email ?? true,
        push_notifications: notifications?.push ?? true,
        news_notifications: notifications?.news ?? false,
        security_notifications: notifications?.security ?? true,
        mentors_notifications: notifications?.mentors ?? true,
        messages_notifications: notifications?.messages ?? true,
        profile_visibility: privacy?.visibility ?? 'public',
        messages_privacy: privacy?.messagesPrivacy ?? 'everyone'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Configuración actualizada correctamente'
    })
  } catch (error) {
    console.error('Error en PUT /api/settings:', error)
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    )
  }
}
