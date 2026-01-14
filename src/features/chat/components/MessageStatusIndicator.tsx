'use client'
import { FiCheck } from 'react-icons/fi'
import { MessageStatus } from '../types'

interface MessageStatusIndicatorProps {
  status: MessageStatus
  className?: string
}

/**
 * Componente para mostrar el estado de un mensaje
 * - ✓ (gris) = Enviado (sent)
 * - ✓✓ (gris) = Entregado (delivered)
 * - ✓✓ (azul) = Leído (read)
 */
export const MessageStatusIndicator = ({ status, className = '' }: MessageStatusIndicatorProps) => {
  if (status === 'sending') {
    return (
      <span className={`inline-flex items-center gap-0.5 text-gray-400 ${className}`}>
        <svg
          className="w-3 h-3 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </span>
    )
  }

  if (status === 'sent') {
    return (
      <span className={`inline-flex items-center text-gray-400 ${className}`}>
        <FiCheck className="w-3 h-3" strokeWidth={3} />
      </span>
    )
  }

  if (status === 'delivered') {
    return (
      <span className={`inline-flex items-center text-gray-400 ${className}`}>
        <FiCheck className="w-3 h-3 -mr-1.5" strokeWidth={3} />
        <FiCheck className="w-3 h-3" strokeWidth={3} />
      </span>
    )
  }

  if (status === 'read') {
    return (
      <span className={`inline-flex items-center text-blue-500 ${className}`}>
        <FiCheck className="w-3 h-3 -mr-1.5" strokeWidth={3} />
        <FiCheck className="w-3 h-3" strokeWidth={3} />
      </span>
    )
  }

  return null
}
