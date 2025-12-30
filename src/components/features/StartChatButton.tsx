'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateConversation } from '@/hooks/useConversations'
import { FiMessageCircle } from 'react-icons/fi'

interface StartChatButtonProps {
  userId: string
  userName?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const StartChatButton = ({
  userId,
  userName,
  variant = 'primary',
  size = 'md',
  className = '',
}: StartChatButtonProps) => {
  const router = useRouter()
  const { mutate: createConversation, isPending } = useCreateConversation()
  const [error, setError] = useState<string | null>(null)

  const handleStartChat = () => {
    createConversation(userId, {
      onSuccess: (data) => {
        // Redirigir al chat con la conversación seleccionada
        router.push(`/chats?conversation=${data.conversationId}`)
      },
      onError: (err) => {
        console.error('Error creating conversation:', err)
        setError('No se pudo iniciar el chat. Intenta de nuevo.')
        setTimeout(() => setError(null), 3000)
      },
    })
  }

  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
    ghost: 'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <div className="relative">
      <button
        onClick={handleStartChat}
        disabled={isPending}
        className={`
          inline-flex items-center gap-2 rounded-lg font-medium
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        title={userName ? `Enviar mensaje a ${userName}` : 'Enviar mensaje'}
      >
        <FiMessageCircle className="w-5 h-5" />
        {isPending ? 'Iniciando...' : 'Enviar mensaje'}
      </button>

      {error && (
        <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-red-500 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  )
}
