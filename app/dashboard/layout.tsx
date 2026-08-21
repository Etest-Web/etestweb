import { Sidebar } from "@/components/dashboard/sidebar"
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
            {children}
        </div>
    )
}