import { Sidebar } from "@/components/features/Sidebar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-(--bg-1)">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
