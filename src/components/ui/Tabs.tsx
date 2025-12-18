'use client'
import { useState, ReactNode } from "react"

export interface Tab {
    id: string
    label: string
    content: ReactNode
}

export interface TabsProps {
    tabs: Tab[]
    defaultTab?: string
    className?: string
}

export const Tabs = ({ tabs, defaultTab, className = '' }: TabsProps) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

    return (
        <div className={className}>
            {/* Tab Headers */}
            <div className="flex border-b border-(--border-1) gap-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 font-semibold transition-colors relative
                            ${activeTab === tab.id
                                ? 'text-(--button-1)'
                                : 'text-(--text-2) hover:text-(--text-1)'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--button-1)" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {tabs.find(tab => tab.id === activeTab)?.content}
            </div>
        </div>
    )
}
