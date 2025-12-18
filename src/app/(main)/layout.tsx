'use client'
import { useState } from "react"
import { Sidebar } from "@/components/features/Sidebar"
import { DashboardNavbar } from "@/components/features/DashboardNavbar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="bg-(--bg-1) min-h-screen">
            <DashboardNavbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex pt-16 max-md:pt-14">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                <main className="flex-1 overflow-y-auto w-full max-lg:w-full min-h-[calc(100vh-4rem)] max-md:min-h-[calc(100vh-3.5rem)]">
                    {children}
                </main>
            </div>
        </div>
    )
}
