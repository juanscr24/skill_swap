import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import type { RegisterInput } from '@/validations/auth'

const SALT_ROUNDS = 10

/**
 * Hashea una contraseña usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compara una contraseña en texto plano con su hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Crea un nuevo usuario en la base de datos
 */
export async function createUser(data: RegisterInput) {
  const { name, email, password } = data

  // Verificar si el usuario ya existe
  const existingUser = await prisma.users.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('El email ya está registrado')
  }

  // Hashear la contraseña
  const hashedPassword = await hashPassword(password)

  // Crear el usuario
  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
    },
  })

  return user
}

/**
 * Obtiene un usuario por email
 */
export async function getUserByEmail(email: string) {
  return prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      image: true,
      bio: true,
      city: true,
      email_verified: true,
    },
  })
}

/**
 * Obtiene un usuario por ID
 */
export async function getUserById(id: string) {
  return prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      bio: true,
      city: true,
      email_verified: true,
      created_at: true,
      updated_at: true,
    },
  })
}

/**
 * Actualiza la fecha de verificación de email
 */
export async function verifyUserEmail(userId: string) {
  return prisma.users.update({
    where: { id: userId },
    data: {
      email_verified: new Date(),
    },
  })
}

/**
 * Actualiza la contraseña de un usuario
 */
export async function updateUserPassword(userId: string, newPassword: string) {
  const hashedPassword = await hashPassword(newPassword)
  
  return prisma.users.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  })
}

/**
 * Crea o actualiza un usuario desde OAuth (Google, GitHub, etc.)
 */
export async function createUserFromOAuth(profile: {
  email: string
  name?: string | null
  image?: string | null
}) {
  const { email, name, image } = profile

  // Buscar usuario existente
  let user = await prisma.users.findUnique({
    where: { email },
  })

  // Si el usuario no existe, crearlo
  if (!user) {
    user = await prisma.users.create({
      data: {
        email,
        name: name || email.split('@')[0],
        image,
        email_verified: new Date(), // OAuth ya verifica el email
        role: 'USER',
      },
    })
  } else {
    // Si existe pero no tiene imagen, actualizar
    if (!user.image && image) {
      user = await prisma.users.update({
        where: { id: user.id },
        data: { image },
      })
    }
    
    // Si no tiene email_verified, marcar como verificado
    if (!user.email_verified) {
      user = await prisma.users.update({
        where: { id: user.id },
        data: { email_verified: new Date() },
      })
    }
  }

  return user
}
