import { FiCheckCircle, FiFilter, FiMessageCircle, FiStar, FiUsers } from "react-icons/fi"

export const ACTIVITY_TYPES = [
    { value: 'all', label: 'Todas', icon: FiFilter },
    { value: 'message', label: 'Mensajes', icon: FiMessageCircle },
    { value: 'match', label: 'Matches', icon: FiUsers },
    { value: 'review', label: 'Reseñas', icon: FiStar },
    { value: 'session', label: 'Sesiones', icon: FiCheckCircle }
] as const

export const ACTIVITY_COLORS: Record<string, string> = {
    message: 'text-[#3B82F6] bg-[#3B82F6]/10',
    match: 'text-[#8B5CF6] bg-[#8B5CF6]/10',
    review: 'text-[#F59E0B] bg-[#F59E0B]/10',
    session: 'text-[#10B981] bg-[#10B981]/10'
} as const
