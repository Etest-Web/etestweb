import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardGate } from "@/components/dashboard/dashboard-gate"
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function DashboardLayout({ children }: LayoutProps) {
    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <div className="md:ml-56 h-full">
                <DashboardGate>{children}</DashboardGate>
            </div>
        </div>
    )
}