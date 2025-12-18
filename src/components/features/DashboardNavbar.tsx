'use client'
import { FiMenu, FiX } from "react-icons/fi"

interface DashboardNavbarProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export const DashboardNavbar = ({ isOpen, setIsOpen }: DashboardNavbarProps) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-(--bg-2) border-b border-(--border-1) h-16 max-md:h-14 flex items-center px-6 max-md:px-4 max-sm:px-3">
            <div className="flex items-center gap-4 max-sm:gap-3 w-full">
                {/* Hamburger Button - Solo visible en tablets y móviles */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden p-2 hover:bg-(--bg-1) rounded-lg transition-colors text-(--text-1)"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <FiX className="w-6 h-6 max-sm:w-5 max-sm:h-5" /> : <FiMenu className="w-6 h-6 max-sm:w-5 max-sm:h-5" />}
                </button>

                {/* Logo */}
                <h1 className="text-2xl max-md:text-xl max-sm:text-lg font-bold text-(--button-1)">
                    SkillSwap
                </h1>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Aquí puedes agregar más elementos como notificaciones, perfil, etc. */}
            </div>
        </nav>
    )
}
