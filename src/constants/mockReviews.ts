import { Review } from "@/types/models"
import { mockUsers } from "./mockUsers"

export const mockReviews: Review[] = [
    {
        id: '1',
        author: mockUsers[1],
        target: mockUsers[0],
        rating: 5,
        comment: 'Excelente mentora! Explica muy bien los conceptos de React y tiene mucha paciencia.',
        created_at: new Date('2024-12-10T16:00:00')
    },
    {
        id: '2',
        author: mockUsers[3],
        target: mockUsers[0],
        rating: 5,
        comment: 'María es increíble! Aprendí mucho sobre TypeScript en una sola sesión.',
        created_at: new Date('2024-12-08T14:30:00')
    },
    {
        id: '3',
        author: mockUsers[4],
        target: mockUsers[0],
        rating: 4,
        comment: 'Muy buena experiencia. La sesión fue productiva y clara.',
        created_at: new Date('2024-12-05T11:00:00')
    },
    {
        id: '4',
        author: mockUsers[5],
        target: mockUsers[0],
        rating: 5,
        comment: 'Recomendada al 100%. Sabe mucho y lo transmite de forma sencilla.',
        created_at: new Date('2024-12-01T09:00:00')
    },
    {
        id: '5',
        author: mockUsers[0],
        target: mockUsers[1],
        rating: 5,
        comment: 'Carlos es un diseñador excepcional. Aprendí muchísimo sobre UI/UX.',
        created_at: new Date('2024-11-28T17:00:00')
    },
    {
        id: '6',
        author: mockUsers[0],
        target: mockUsers[2],
        rating: 5,
        comment: 'Ana explica Machine Learning de forma muy clara. Totalmente recomendable!',
        created_at: new Date('2024-11-25T15:30:00')
    },
    {
        id: '7',
        author: mockUsers[2],
        target: mockUsers[1],
        rating: 5,
        comment: 'Increíble! Ahora entiendo mucho mejor los principios de diseño.',
        created_at: new Date('2024-11-20T10:00:00')
    },
    {
        id: '8',
        author: mockUsers[5],
        target: mockUsers[6],
        rating: 5,
        comment: 'Elena es una chef espectacular! Las recetas son deliciosas.',
        created_at: new Date('2024-11-15T19:00:00')
    }
]
