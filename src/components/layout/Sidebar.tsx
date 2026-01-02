'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import {
    FiHome,
    FiUser,
    FiUsers,
    FiHeart,
    FiMail,
    FiCalendar,
    FiSend,
    FiSettings,
    FiLogOut
} from "react-icons/fi"
import { useAuth } from "@/hooks/useAuth"
import type { SidebarProps } from '@/types'

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const pathname = usePathname()
    const t = useTranslations('dashboard')
    const { logout } = useAuth()

    const menuItems = [
        { icon: FiHome, label: t('dashboard'), href: '/dashboard' },
        { icon: FiUser, label: t('profile'), href: '/profile' },
        { icon: FiUsers, label: t('mentors'), href: '/mentors' },
        { icon: FiHeart, label: t('matching'), href: '/matching' },
        { icon: FiSend, label: t('requests'), href: '/requests' },
        { icon: FiMail, label: t('chats'), href: '/chats' },
        { icon: FiCalendar, label: t('sessions'), href: '/sessions' },
    ]

    const settingsItem = { icon: FiSettings, label: t('settings'), href: '/settings' }

    const handleLinkClick = () => {
        setIsOpen(false)
    }

    const handleLogout = async () => {
        await logout()
        setIsOpen(false)
    }

    return (
        <>
            {/* Overlay para cerrar el menú en móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden mt-16 max-md:mt-14"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed left-0 top-16 max-md:top-14 z-40 
                w-64 max-md:w-56 max-sm:w-64 
                h-[calc(100vh-4rem)] max-md:h-[calc(100vh-3.5rem)]
                bg-(--bg-2) border-r border-(--border-1) 
                flex flex-col
                transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>

                {/* Menu Items */}
                <nav className="flex-1 p-4 max-md:p-3 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleLinkClick}
                                className={`flex items-center gap-3 max-md:gap-2 px-4 max-md:px-3 py-3 max-md:py-2 rounded-lg transition-colors
                                    ${isActive
                                        ? 'bg-(--button-1) text-(--button-1-text)'
                                        : 'text-(--text-2) hover:bg-(--bg-1) hover:text-(--text-1)'
                                    }`}
                            >
                                <Icon className="w-5 h-5 max-md:w-4 max-md:h-4 shrink-0" />
                                <span className="font-medium max-md:text-sm">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Items */}
                <div className="p-4 max-md:p-3 border-t border-(--border-1) space-y-2">
                    {/* Settings */}
                    <Link
                        href={settingsItem.href}
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 max-md:gap-2 px-4 max-md:px-3 py-3 max-md:py-2 rounded-lg text-(--text-2) hover:bg-(--bg-1) hover:text-(--text-1) transition-colors"
                    >
                        <FiSettings className="w-5 h-5 max-md:w-4 max-md:h-4 shrink-0" />
                        <span className="font-medium max-md:text-sm">{settingsItem.label}</span>
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 max-md:gap-2 px-4 max-md:px-3 py-3 max-md:py-2 rounded-lg text-(--text-2) hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    >
                        <FiLogOut className="w-5 h-5 max-md:w-4 max-md:h-4 shrink-0" />
                        <span className="font-medium max-md:text-sm">{t('logout')}</span>
                    </button>
                </div>
            </aside >
        </>
    )
}
