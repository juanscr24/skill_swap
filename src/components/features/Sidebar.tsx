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

export const Sidebar = () => {
    const pathname = usePathname()
    const t = useTranslations('dashboard')

    const menuItems = [
        { icon: FiHome, label: t('dashboard'), href: '/dashboard' },
        { icon: FiUser, label: t('profile'), href: '/profile' },
        { icon: FiUsers, label: t('mentors'), href: '/mentors' },
        { icon: FiHeart, label: t('matching'), href: '/matching' },
        { icon: FiSend, label: t('requests'), href: '/requests' },
        { icon: FiMail, label: t('chats'), href: '/chats' },
        { icon: FiCalendar, label: t('sessions'), href: '/sessions' },
    ]

    const bottomItems = [
        { icon: FiSettings, label: t('settings'), href: '/settings' },
        { icon: FiLogOut, label: t('logout'), href: '/auth/login' },
    ]

    return (
        <aside className="w-64 bg-(--bg-2) border-r border-(--border-1) h-screen sticky top-0 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-(--border-1)">
                <h1 className="text-2xl font-bold text-(--button-1)">SkillSwap</h1>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                ${isActive 
                                    ? 'bg-(--button-1) text-(--button-1-text)' 
                                    : 'text-(--text-2) hover:bg-(--bg-1) hover:text-(--text-1)'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Items */}
            <div className="p-4 border-t border-(--border-1) space-y-2">
                {bottomItems.map((item) => {
                    const Icon = item.icon
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-(--text-2) hover:bg-(--bg-1) hover:text-(--text-1) transition-colors"
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </aside>
    )
}
