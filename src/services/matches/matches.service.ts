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
    // Obtener las habilidades que el usuario quiere aprender (de wanted_skills)
    const userWantedSkills = await prisma.wanted_skills.findMany({
      where: {
        user_id: userId
      },
      select: {
        name: true
      }
    })

    const wantedSkillNames = userWantedSkills.map((s: any) => s.name)

    // Si el usuario no tiene habilidades que quiere aprender, retornar vacío
    if (wantedSkillNames.length === 0) {
      return []
    }

    // Obtener IDs de usuarios con los que ya tiene solicitudes (pendientes o aceptadas)
    const existingMatches = await prisma.matches.findMany({
      where: {
        OR: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      select: {
        sender_id: true,
        receiver_id: true
      }
    })

    // Crear lista de IDs a excluir
    const excludedUserIds = new Set<string>()
    existingMatches.forEach((match: any) => {
      if (match.sender_id !== userId) excludedUserIds.add(match.sender_id)
      if (match.receiver_id !== userId) excludedUserIds.add(match.receiver_id)
    })

    // Obtener usuarios que NO son el usuario actual y tienen habilidades que coinciden
    const potentialMatches = await prisma.users.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          { id: { notIn: Array.from(excludedUserIds) } }, // Excluir usuarios con match existente
          {
            skills: {
              some: {
                name: { in: wantedSkillNames }
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
    // Verificar si ya existe una solicitud del sender al receiver
    const existingMatch = await prisma.matches.findFirst({
      where: {
        sender_id: senderId,
        receiver_id: receiverId,
        skill
      }
    })

    if (existingMatch) {
      throw new Error('Ya existe una solicitud con este usuario para esta habilidad')
    }

    // Verificar si existe una solicitud inversa (del receiver al sender)
    const inverseMatch = await prisma.matches.findFirst({
      where: {
        sender_id: receiverId,
        receiver_id: senderId,
        skill
      }
    })

    // Si existe solicitud inversa y está pendiente, aceptar ambas automáticamente
    if (inverseMatch && inverseMatch.status === 'pending') {
      // Actualizar la solicitud inversa a accepted
      await prisma.matches.update({
        where: { id: inverseMatch.id },
        data: { 
          status: 'accepted',
          updated_at: new Date()
        }
      })

      // Crear la nueva solicitud directamente como accepted
      const match = await prisma.matches.create({
        data: {
          sender_id: senderId,
          receiver_id: receiverId,
          skill,
          status: 'accepted'
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

    // Si no existe solicitud inversa, crear solicitud normal como pending
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
