export interface BadgeProps {
    children: React.ReactNode
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
    className?: string
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
    const variants = {
        default: 'bg-(--button-2) text-(--text-1) border border-(--border-1)',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    }

    return (
        <span className={`px-3 max-sm:px-2 py-1 max-sm:py-0.5 rounded-full text-xs max-sm:text-[10px] font-semibold ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}
