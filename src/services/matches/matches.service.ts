import { prisma } from '@/lib'

export interface PotentialMatch {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  city: string | null
  skills: Array<{
    id: string
    name: string
    level: string | null
  }>
}

export const matchesService = {
  async getPotentialMatches(userId: string): Promise<PotentialMatch[]> {
    // Obtener las habilidades que el usuario quiere aprender
    const userWantedSkills = await prisma.skills.findMany({
      where: {
        owner_id: userId,
        level: 'wanted'
      },
      select: {
        name: true
      }
    })

    const wantedSkillNames = userWantedSkills.map((s: any) => s.name)

    // Obtener usuarios que NO son el usuario actual y tienen habilidades que coinciden
    const potentialMatches = await prisma.users.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          {
            skills: {
              some: {
                name: { in: wantedSkillNames },
                level: { not: 'wanted' }
              }
            }
          }
        ]
      },
      include: {
        skills: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      },
      take: 50 // Limitar a 50 usuarios
    })

    return potentialMatches.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.bio,
      city: user.city,
      skills: user.skills
    }))
  },

  async sendMatchRequest(senderId: string, receiverId: string, skill: string): Promise<any> {
    // Verificar si ya existe una solicitud
    const existingMatch = await prisma.matches.findFirst({
      where: {
        OR: [
          { sender_id: senderId, receiver_id: receiverId, skill },
          { sender_id: receiverId, receiver_id: senderId, skill }
        ]
      }
    })

    if (existingMatch) {
      throw new Error('Ya existe una solicitud con este usuario para esta habilidad')
    }

    // Crear nueva solicitud
    const match = await prisma.matches.create({
      data: {
        sender_id: senderId,
        receiver_id: receiverId,
        skill,
        status: 'pending'
      },
      include: {
        users_matches_sender_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        users_matches_receiver_idTousers: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return match
  }
}
