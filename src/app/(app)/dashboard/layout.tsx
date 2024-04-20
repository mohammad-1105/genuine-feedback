
interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({children}: DashboardLayoutProps){
    return (
        <div className="min-h-screen">
            {children}
        </div>
    )
}