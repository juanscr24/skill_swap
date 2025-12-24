import { User } from "@/types/models"

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'María García',
        email: 'maria@example.com',
        image: 'https://randomuser.me/api/portraits/women/1.jpg',
        bio: 'Desarrolladora full-stack con 5 años de experiencia. Me apasiona enseñar y aprender nuevas tecnologías.',
        city: 'Madrid',
        role: 'MENTOR',
        created_at: new Date('2024-01-15'),
        rating: 4.8,
        totalReviews: 24,
        hoursTeaching: 120,
        classesTaken: 15,
        classesGiven: 45,
        skills: [
            { id: '1', name: 'React', description: 'Desarrollo de aplicaciones web', level: 'Avanzado' },
            { id: '2', name: 'Node.js', description: 'Backend development', level: 'Intermedio' },
            { id: '3', name: 'TypeScript', level: 'Avanzado' }
        ],
        wanted_skills: [
            { id: '1', name: 'Python' },
            { id: '2', name: 'Machine Learning' }
        ]
    },
    {
        id: '2',
        name: 'Carlos Rodríguez',
        email: 'carlos@example.com',
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
        bio: 'Diseñador UI/UX especializado en crear experiencias digitales memorables.',
        city: 'Barcelona',
        role: 'MENTOR',
        created_at: new Date('2024-02-20'),
        rating: 4.9,
        totalReviews: 31,
        hoursTeaching: 85,
        classesTaken: 8,
        classesGiven: 28,
        skills: [
            { id: '4', name: 'Figma', description: 'Diseño de interfaces', level: 'Avanzado' },
            { id: '5', name: 'Adobe XD', level: 'Intermedio' }
        ],
        wanted_skills: [
            { id: '3', name: 'Animación' },
            { id: '4', name: 'Motion Design' }
        ]
    },
    {
        id: '3',
        name: 'Ana Martínez',
        email: 'ana@example.com',
        image: 'https://randomuser.me/api/portraits/women/3.jpg',
        bio: 'Data Scientist apasionada por el análisis de datos y la inteligencia artificial.',
        city: 'Valencia',
        role: 'MENTOR',
        created_at: new Date('2024-03-10'),
        rating: 4.7,
        totalReviews: 18,
        hoursTeaching: 60,
        classesTaken: 12,
        classesGiven: 22,
        skills: [
            { id: '6', name: 'Python', description: 'Data Science y ML', level: 'Avanzado' },
            { id: '7', name: 'Machine Learning', level: 'Avanzado' },
            { id: '8', name: 'SQL', level: 'Intermedio' }
        ],
        wanted_skills: [
            { id: '5', name: 'Deep Learning' },
            { id: '6', name: 'TensorFlow' }
        ]
    },
    {
        id: '4',
        name: 'David López',
        email: 'david@example.com',
        image: 'https://randomuser.me/api/portraits/men/4.jpg',
        bio: 'Fotógrafo profesional especializado en retratos y fotografía de producto.',
        city: 'Sevilla',
        role: 'MENTOR',
        created_at: new Date('2024-04-05'),
        rating: 4.9,
        totalReviews: 27,
        hoursTeaching: 95,
        classesTaken: 5,
        classesGiven: 35,
        skills: [
            { id: '9', name: 'Fotografía', description: 'Retratos y producto', level: 'Avanzado' },
            { id: '10', name: 'Lightroom', level: 'Avanzado' },
            { id: '11', name: 'Photoshop', level: 'Intermedio' }
        ],
        wanted_skills: [
            { id: '7', name: 'Edición de Video' },
            { id: '8', name: 'Premiere Pro' }
        ]
    },
    {
        id: '5',
        name: 'Laura Sánchez',
        email: 'laura@example.com',
        image: 'https://randomuser.me/api/portraits/women/5.jpg',
        bio: 'Marketing digital y estrategias de contenido para redes sociales.',
        city: 'Bilbao',
        role: 'MENTOR',
        created_at: new Date('2024-05-12'),
        rating: 4.6,
        totalReviews: 15,
        hoursTeaching: 48,
        classesTaken: 20,
        classesGiven: 18,
        skills: [
            { id: '12', name: 'Marketing Digital', level: 'Avanzado' },
            { id: '13', name: 'SEO', description: 'Optimización para motores de búsqueda', level: 'Intermedio' },
            { id: '14', name: 'Social Media', level: 'Avanzado' }
        ],
        wanted_skills: [
            { id: '9', name: 'Google Ads' },
            { id: '10', name: 'Analytics' }
        ]
    },
    {
        id: '6',
        name: 'Miguel Torres',
        email: 'miguel@example.com',
        image: 'https://randomuser.me/api/portraits/men/6.jpg',
        bio: 'Músico y productor musical con experiencia en géneros electrónicos.',
        city: 'Madrid',
        role: 'STUDENT',
        created_at: new Date('2024-06-18'),
        rating: 4.5,
        totalReviews: 10,
        hoursTeaching: 25,
        classesTaken: 30,
        classesGiven: 8,
        skills: [
            { id: '15', name: 'Producción Musical', level: 'Intermedio' },
            { id: '16', name: 'Ableton Live', level: 'Intermedio' }
        ],
        wanted_skills: [
            { id: '11', name: 'Mezcla' },
            { id: '12', name: 'Masterización' }
        ]
    },
    {
        id: '7',
        name: 'Elena Jiménez',
        email: 'elena@example.com',
        image: 'https://randomuser.me/api/portraits/women/7.jpg',
        bio: 'Chef profesional especializada en cocina mediterránea y repostería.',
        city: 'Barcelona',
        role: 'MENTOR',
        created_at: new Date('2024-07-22'),
        rating: 5.0,
        totalReviews: 42,
        hoursTeaching: 150,
        classesTaken: 3,
        classesGiven: 52,
        skills: [
            { id: '17', name: 'Cocina', description: 'Cocina mediterránea', level: 'Avanzado' },
            { id: '18', name: 'Repostería', level: 'Avanzado' }
        ],
        wanted_skills: [
            { id: '13', name: 'Cocina Asiática' },
            { id: '14', name: 'Sushi' }
        ]
    },
    {
        id: '8',
        name: 'Javier Ruiz',
        email: 'javier@example.com',
        image: 'https://randomuser.me/api/portraits/men/8.jpg',
        bio: 'Profesor de yoga y meditación con certificación internacional.',
        city: 'Valencia',
        role: 'MENTOR',
        created_at: new Date('2024-08-30'),
        rating: 4.8,
        totalReviews: 33,
        hoursTeaching: 110,
        classesTaken: 6,
        classesGiven: 40,
        skills: [
            { id: '19', name: 'Yoga', description: 'Hatha y Vinyasa', level: 'Avanzado' },
            { id: '20', name: 'Meditación', level: 'Avanzado' }
        ],
        wanted_skills: [
            { id: '15', name: 'Nutrición' },
            { id: '16', name: 'Pilates' }
        ]
    }
]

export const currentUser: User = mockUsers[0]
