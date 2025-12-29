import { prisma } from '@/lib/prisma'

/**
 * Obtiene todas las skills de un usuario
 */
export async function getUserSkills(userId: string) {
  return prisma.skills.findMany({
    where: { owner_id: userId },
    select: {
      id: true,
      name: true,
      description: true,
      level: true,
      created_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  })
}

/**
 * Obtiene todas las wanted_skills de un usuario
 */
export async function getUserWantedSkills(userId: string) {
  return prisma.wanted_skills.findMany({
    where: { user_id: userId },
    select: {
      id: true,
      name: true,
      created_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  })
}

/**
 * Crea una nueva skill para un usuario
 */
export async function createSkill(
  userId: string,
  data: {
    name: string
    description?: string
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  }
) {
  // Promover usuario a MENTOR si no lo es
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  if (user && user.role !== 'MENTOR' && user.role !== 'ADMIN') {
    await prisma.users.update({
      where: { id: userId },
      data: { role: 'MENTOR' },
    })
  }

  return prisma.skills.create({
    data: {
      owner_id: userId,
      name: data.name,
      description: data.description,
      level: data.level,
    },
    select: {
      id: true,
      name: true,
      description: true,
      level: true,
      created_at: true,
    },
  })
}

/**
 * Crea una nueva wanted_skill para un usuario
 */
export async function createWantedSkill(userId: string, name: string) {
  return prisma.wanted_skills.create({
    data: {
      user_id: userId,
      name,
    },
    select: {
      id: true,
      name: true,
      created_at: true,
    },
  })
}

/**
 * Elimina una skill
 */
export async function deleteSkill(skillId: string, userId: string) {
  // Verificar que la skill pertenece al usuario
  const skill = await prisma.skills.findFirst({
    where: {
      id: skillId,
      owner_id: userId,
    },
  })

  if (!skill) {
    throw new Error('Skill no encontrada o no tienes permiso para eliminarla')
  }

  return prisma.skills.delete({
    where: { id: skillId },
  })
}

/**
 * Elimina una wanted_skill
 */
export async function deleteWantedSkill(wantedSkillId: string, userId: string) {
  // Verificar que la wanted_skill pertenece al usuario
  const wantedSkill = await prisma.wanted_skills.findFirst({
    where: {
      id: wantedSkillId,
      user_id: userId,
    },
  })

  if (!wantedSkill) {
    throw new Error(
      'Wanted skill no encontrada o no tienes permiso para eliminarla'
    )
  }

  return prisma.wanted_skills.delete({
    where: { id: wantedSkillId },
  })
}

/**
 * Actualiza una skill
 */
export async function updateSkill(
  skillId: string,
  userId: string,
  data: {
    name?: string
    description?: string
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  }
) {
  // Verificar que la skill pertenece al usuario
  const skill = await prisma.skills.findFirst({
    where: {
      id: skillId,
      owner_id: userId,
    },
  })

  if (!skill) {
    throw new Error('Skill no encontrada o no tienes permiso para actualizarla')
  }

  return prisma.skills.update({
    where: { id: skillId },
    data,
    select: {
      id: true,
      name: true,
      description: true,
      level: true,
      created_at: true,
    },
  })
}
