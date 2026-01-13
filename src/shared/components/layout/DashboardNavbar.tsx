'use client'
import { useState } from "react"
import { FiMenu, FiX, FiBell } from "react-icons/fi"
import { SkillSwapLogo } from "../ui/SkillSwapLogo"
import { DashboardNavbarProps } from "@/shared/types"
import { NotificationPanel } from "@/features/activity/components/NotificationPanel"

export const DashboardNavbar = ({ isOpen, setIsOpen }: DashboardNavbarProps) => {
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const unreadCount = 3 // Esto debería venir de una API real

    return (
        <>
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
                    <SkillSwapLogo className="w-40 max-xl:w-35 max-md:w-30" />
                    
                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Notifications Button */}
                    <button
                        onClick={() => setNotificationsOpen(true)}
                        className="relative p-2 hover:bg-(--bg-1) rounded-lg transition-colors text-(--text-1)"
                        aria-label="Notificaciones"
                    >
                        <FiBell className="w-6 h-6 max-sm:w-5 max-sm:h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-(--button-1) rounded-full ring-2 ring-(--bg-2)"></span>
                        )}
                    </button>

                    {/* User Avatar - Puedes agregar esto después */}
                    {/* <UserMenu /> */}
                </div>
            </nav>

            {/* Notification Panel */}
            <NotificationPanel
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
            />
        </>
    )
}
