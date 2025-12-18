import { Match } from "@/types/models"
import { mockUsers } from "./mockUsers"

export const mockMatches: Match[] = [
    {
        id: '1',
        sender: mockUsers[1],
        receiver: mockUsers[0],
        skill: 'React',
        status: 'accepted',
        created_at: new Date('2024-12-10T12:00:00')
    },
    {
        id: '2',
        sender: mockUsers[2],
        receiver: mockUsers[0],
        skill: 'TypeScript',
        status: 'pending',
        created_at: new Date('2024-12-14T09:30:00')
    },
    {
        id: '3',
        sender: mockUsers[3],
        receiver: mockUsers[0],
        skill: 'Node.js',
        status: 'pending',
        created_at: new Date('2024-12-15T14:20:00')
    },
    {
        id: '4',
        sender: mockUsers[0],
        receiver: mockUsers[1],
        skill: 'Figma',
        status: 'accepted',
        created_at: new Date('2024-12-09T11:00:00')
    },
    {
        id: '5',
        sender: mockUsers[0],
        receiver: mockUsers[2],
        skill: 'Python',
        status: 'accepted',
        created_at: new Date('2024-12-11T10:00:00')
    },
    {
        id: '6',
        sender: mockUsers[4],
        receiver: mockUsers[0],
        skill: 'React',
        status: 'rejected',
        created_at: new Date('2024-12-05T16:00:00')
    }
]
