'use client'
import { PresenceIndicatorProps } from "../types"

export const PresenceIndicator = ({
  isOnline,
  size = 'md',
  showOffline = false,
  className = '',
}: PresenceIndicatorProps) => {
  if (!isOnline && !showOffline) return null

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  const bgColor = isOnline ? 'bg-green-500' : 'bg-gray-400'

  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} rounded-full border-2 border-white dark:border-gray-800 ${className}`}
      title={isOnline ? 'Online' : 'Offline'}
    />
  )
}
