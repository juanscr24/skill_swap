'use client'
import { useState } from "react"
import { Sidebar } from "@/components/features/Sidebar"
import { DashboardNavbar } from "@/components/features/DashboardNavbar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="bg-(--bg-1) min-h-screen">
            <DashboardNavbar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <main className="
                pt-16 max-md:pt-14
                lg:pl-64 lg:ml-0
                min-h-screen
                transition-all duration-300
            ">
                {children}
            </main>
        </div>
    )
}
