'use client'
import { Moon, Sun } from 'lucide-react'
import { ButtonModeProps } from '@/types'
import { useThemeStore } from '@/stores/themeStore'

export const ButtonMode = ({ className }: ButtonModeProps) => {
    const { toggleTheme, theme } = useThemeStore()
    return (
        <button
            className={`hover:scale-101 hover:text-(--text-1) text-(--text-2) transition-all duration-200 cursor-pointer rounded-md ${className}`}
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
            {theme == 'light' ? <Moon /> : <Sun />}
        </button>
    )
}
