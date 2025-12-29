import { ReactNode } from "react"
import { IconType } from "react-icons"

interface SettingsSectionProps {
    title: string
    description?: string
    icon?: IconType
    children: ReactNode
    className?: string
}

export const SettingsSection = ({ title, description, icon: Icon, children, className = "" }: SettingsSectionProps) => {
    return (
        <section className={`bg-(--bg-2) rounded-xl border border-(--border-1) overflow-hidden ${className}`}>
            <div className="p-6 max-sm:p-4 border-b border-(--border-1)">
                <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-5 h-5 text-(--button-1)" />}
                    <h2 className="text-lg font-semibold text-(--text-1)">{title}</h2>
                </div>
                {description && (
                    <p className="mt-1 text-sm text-(--text-2) ml-8 max-sm:ml-0">{description}</p>
                )}
            </div>
            <div className="p-6 max-sm:p-4">
                {children}
            </div>
        </section>
    )
}
