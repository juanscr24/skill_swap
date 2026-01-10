import { prisma } from '@/lib'
import type { UserWithRelations, PotentialMatch } from '@/types'

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

    const wantedSkillNames = userWantedSkills.map(s => s.name)

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
    existingMatches.forEach(match => {
      if (match.sender_id && match.sender_id !== userId) excludedUserIds.add(match.sender_id)
      if (match.receiver_id && match.receiver_id !== userId) excludedUserIds.add(match.receiver_id)
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
        },
        wanted_skills: {
          select: {
            id: true,
            name: true
          }
        },
        languages: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      },
      take: 50 // Limitar a 50 usuarios
    }) as UserWithRelations[]

    return potentialMatches.map(user => ({
      id: user.id,
      name: user.name,
      wantedSkills: user.wanted_skills || [],
      email: user.email,
      image: user.image,
      bio: user.bio,
      city: user.city,
      title: user.title || null,
      skills: (user.skills || []).map(s => ({
        id: s.id,
        name: s.name,
        level: s.level || null
      })),
      languages: (user.languages || []).map(l => ({
        id: l.id,
        name: l.name,
        level: l.level || null
      }))
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

    // Si existe solicitud inversa y está pendiente, aceptar automáticamente
    if (inverseMatch && inverseMatch.status === 'pending') {
      // Solo actualizar la solicitud inversa a accepted
      // NO crear una nueva solicitud
      const acceptedMatch = await prisma.matches.update({
        where: { id: inverseMatch.id },
        data: {
          status: 'accepted',
          updated_at: new Date()
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

      return acceptedMatch
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
