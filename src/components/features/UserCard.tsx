// Componente ejemplo de cómo integrar el botón de chat en un perfil de usuario

'use client'

import { StartChatButton } from '@/components/features/StartChatButton'
import { Avatar } from '@/components/ui/Avatar'

interface UserCardProps {
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    bio?: string | null
  }
  currentUserId?: string
}

export const UserCard = ({ user, currentUserId }: UserCardProps) => {
  const isOwnProfile = currentUserId === user.id

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex items-start gap-4">
        <Avatar src={user.image || undefined} alt={user.name || 'User'} size="lg" />
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {user.name || 'Usuario'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          
          {user.bio && (
            <p className="mt-2 text-gray-700 dark:text-gray-300">{user.bio}</p>
          )}
        </div>

        {!isOwnProfile && (
          <StartChatButton 
            userId={user.id} 
            userName={user.name || undefined}
            variant="primary"
            size="md"
          />
        )}
      </div>
    </div>
  )
}
