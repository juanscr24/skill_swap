'use client'

import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { ReactNode } from 'react'

interface FilterAccordionProps {
    title: string
    icon: ReactNode
    isOpen: boolean
    onToggle: () => void
    children: ReactNode
}

export const FilterAccordion = ({
    title,
    icon,
    isOpen,
    onToggle,
    children
}: FilterAccordionProps) => {
    return (
        <div className="bg-(--bg-2) rounded-lg border border-(--border-1) overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-(--bg-1) transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-(--button-1)">{icon}</span>
                    <span className="font-semibold text-(--text-1)">{title}</span>
                </div>
                {isOpen ? (
                    <FiChevronUp className="w-5 h-5 text-(--text-2)" />
                ) : (
                    <FiChevronDown className="w-5 h-5 text-(--text-2)" />
                )}
            </button>

            {isOpen && (
                <div className="p-4 pt-0 space-y-3">
                    {children}
                </div>
            )}
        </div>
    )
}
