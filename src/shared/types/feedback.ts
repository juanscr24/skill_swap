import { ReactNode } from "react"

export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    color?: string
}

export interface RatingProps {
    value?: number
    onChange?: (value: number) => void
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    title?: string
    className?: string
}