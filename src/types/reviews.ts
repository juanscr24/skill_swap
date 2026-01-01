// Tipos para el servicio de reviews

export interface ServiceReview {
  id: string
  authorId: string
  targetId: string
  rating: number
  comment: string | null
  createdAt: Date
  author: {
    id: string
    name: string | null
    image: string | null
  } | null
  target: {
    id: string
    name: string | null
    image: string | null
  } | null
}
