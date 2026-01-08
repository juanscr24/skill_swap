import { ReactNode } from "react"

export interface CardProps {
    children: ReactNode
    className?: string
    hover?: boolean
    onClick?: () => void
}

export const Card = ({ children, className = '', hover = false, onClick }: CardProps) => {
    return (
        <div
            onClick={onClick}
            className={`bg-(--bg-2) border border-(--border-1) rounded-lg p-6 max-md:p-4 max-sm:p-3 
                ${hover ? 'hover:scale-102 transition-transform duration-200 cursor-pointer' : ''}
                ${className}`}
        >
            {children}
        </div>
    )
}
