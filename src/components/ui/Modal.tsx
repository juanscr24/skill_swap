import { ReactNode } from "react"

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    title?: string
    className?: string
}

export const Modal = ({ isOpen, onClose, children, title, className = '' }: ModalProps) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className={`relative bg-(--bg-2) rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto ${className}`}>
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-(--border-1)">
                        <h2 className="text-2xl font-bold text-(--text-1)">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-(--text-2) hover:text-(--text-1) transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
