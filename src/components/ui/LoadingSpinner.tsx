import { FiLoader } from 'react-icons/fi'
import type { LoadingSpinnerProps } from '@/types'

interface LoadingSpinnerPropsExtended extends LoadingSpinnerProps {
    fullScreen?: boolean
    className?: string
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
}

export default function LoadingSpinner({ size = 'lg', fullScreen = false, className = '' }: LoadingSpinnerPropsExtended) {
    const spinner = (
        <FiLoader className={`animate-spin text-(--button-1) ${sizeClasses[size]} ${className}`} />
    )

    if (fullScreen) {
        return (
            <div className="flex items-center justify-center h-screen bg-(--bg-1)">
                {spinner}
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center py-12">
            {spinner}
        </div>
    )
}
