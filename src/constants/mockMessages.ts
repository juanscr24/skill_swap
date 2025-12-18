import { Message, ChatConversation } from "@/types/models"
import { mockUsers } from "./mockUsers"

export const mockMessages: Message[] = [
    {
        id: '1',
        sender: mockUsers[1],
        receiver: mockUsers[0],
        content: '¡Hola María! ¿Podríamos agendar una sesión de React para la próxima semana?',
        read: true,
        created_at: new Date('2024-12-15T10:30:00')
    },
    {
        id: '2',
        sender: mockUsers[0],
        receiver: mockUsers[1],
        content: '¡Claro Carlos! ¿Qué tal el viernes a las 10am?',
        read: true,
        created_at: new Date('2024-12-15T10:45:00')
    },
    {
        id: '3',
        sender: mockUsers[1],
        receiver: mockUsers[0],
        content: 'Perfecto, nos vemos entonces. Gracias!',
        read: true,
        created_at: new Date('2024-12-15T10:50:00')
    },
    {
        id: '4',
        sender: mockUsers[2],
        receiver: mockUsers[0],
        content: 'Hola, me interesaría aprender sobre TypeScript avanzado',
        read: false,
        created_at: new Date('2024-12-16T14:20:00')
    },
    {
        id: '5',
        sender: mockUsers[3],
        receiver: mockUsers[0],
        content: 'Gracias por la sesión de ayer, fue muy útil!',
        read: false,
        created_at: new Date('2024-12-16T09:15:00')
    },
    {
        id: '6',
        sender: mockUsers[4],
        receiver: mockUsers[0],
        content: '¿Tienes disponibilidad para esta semana?',
        read: false,
        created_at: new Date('2024-12-16T11:00:00')
    }
]

export const mockConversations: ChatConversation[] = [
    {
        id: '1',
        user: mockUsers[1],
        lastMessage: mockMessages[2],
        unreadCount: 0
    },
    {
        id: '2',
        user: mockUsers[2],
        lastMessage: mockMessages[3],
        unreadCount: 1
    },
    {
        id: '3',
        user: mockUsers[3],
        lastMessage: mockMessages[4],
        unreadCount: 1
    },
    {
        id: '4',
        user: mockUsers[4],
        lastMessage: mockMessages[5],
        unreadCount: 1
    }
]
