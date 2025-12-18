import { Session } from "@/types/models"
import { mockUsers } from "./mockUsers"

export const mockSessions: Session[] = [
    {
        id: '1',
        host: mockUsers[0],
        guest: mockUsers[1],
        title: 'Introducción a React Hooks',
        description: 'Aprenderemos los conceptos básicos de useState, useEffect y useContext',
        start_at: new Date('2024-12-20T10:00:00'),
        end_at: new Date('2024-12-20T11:30:00'),
        status: 'scheduled',
        created_at: new Date('2024-12-10')
    },
    {
        id: '2',
        host: mockUsers[1],
        guest: mockUsers[0],
        title: 'Principios de Diseño UI/UX',
        description: 'Fundamentos de diseño de interfaces y experiencia de usuario',
        start_at: new Date('2024-12-18T15:00:00'),
        end_at: new Date('2024-12-18T16:00:00'),
        status: 'scheduled',
        created_at: new Date('2024-12-08')
    },
    {
        id: '3',
        host: mockUsers[2],
        guest: mockUsers[0],
        title: 'Machine Learning Básico',
        description: 'Introducción a algoritmos de ML con Python',
        start_at: new Date('2024-12-15T14:00:00'),
        end_at: new Date('2024-12-15T15:30:00'),
        status: 'completed',
        created_at: new Date('2024-12-01')
    },
    {
        id: '4',
        host: mockUsers[0],
        guest: mockUsers[3],
        title: 'TypeScript Avanzado',
        description: 'Tipos genéricos y patrones avanzados en TypeScript',
        start_at: new Date('2024-12-22T11:00:00'),
        end_at: new Date('2024-12-22T12:30:00'),
        status: 'scheduled',
        created_at: new Date('2024-12-12')
    },
    {
        id: '5',
        host: mockUsers[6],
        guest: mockUsers[5],
        title: 'Cocina Mediterránea',
        description: 'Recetas tradicionales españolas paso a paso',
        start_at: new Date('2024-12-25T18:00:00'),
        end_at: new Date('2024-12-25T20:00:00'),
        status: 'scheduled',
        created_at: new Date('2024-12-14')
    },
    {
        id: '6',
        host: mockUsers[7],
        guest: mockUsers[4],
        title: 'Yoga para Principiantes',
        description: 'Posturas básicas y técnicas de respiración',
        start_at: new Date('2024-12-19T09:00:00'),
        end_at: new Date('2024-12-19T10:00:00'),
        status: 'scheduled',
        created_at: new Date('2024-12-11')
    }
]
