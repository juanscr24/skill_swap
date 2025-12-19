import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'
import { prisma } from '@/lib/prisma'

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
    try {
        // Verificar autenticación
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            )
        }

        // Buscar el usuario para obtener el public_id de la imagen anterior
        const user = await prisma.users.findUnique({
            where: { email: session.user.email },
            select: { id: true, image_public_id: true }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Obtener el archivo del FormData
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No se proporcionó archivo' },
                { status: 400 }
            )
        }

        // Convertir el archivo a base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`

        // Si existe una imagen anterior en Cloudinary, eliminarla
        if (user.image_public_id) {
            try {
                await cloudinary.uploader.destroy(user.image_public_id)
                console.log('Imagen anterior eliminada:', user.image_public_id)
            } catch (deleteError) {
                console.error('Error al eliminar imagen anterior:', deleteError)
                // Continuar aunque falle la eliminación
            }
        }

        // Subir a Cloudinary
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: 'skill-swap/profiles',
            resource_type: 'auto',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            transformation: [
                { width: 500, height: 500, crop: 'fill', gravity: 'face' },
                { quality: 'auto', fetch_format: 'auto' }
            ]
        })

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id
        })

    } catch (error) {
        console.error('Error uploading to Cloudinary:', error)
        return NextResponse.json(
            { error: 'Error al subir la imagen' },
            { status: 500 }
        )
    }
}
