"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ListOrdered, 
  Users, 
  Settings, 
  Briefcase, 
  FileText, 
  Tag,
  Bell,
  ArrowLeft,
  MessageSquare,
  DollarSign
} from "lucide-react";

export default function AdminLayout({ children }) {
  const { user, dbUser, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // Protect Admin Route
  if (!user || dbUser?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">You do not have Admin privileges.</p>
        <Link href="/" className="text-blue-500 underline">Return Home</Link>
      </div>
    );
  }

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/admin" },
    { name: "All Orders", icon: ListOrdered, path: "/admin/orders" },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Manage Services", icon: Briefcase, path: "/admin/services" },
    { name: "Messages", icon: MessageSquare,
  DollarSign, path: "/admin/messages" },
    { name: "Manage Pages", icon: FileText, path: "/admin/pages" },
    { name: "Coupons", icon: Tag, path: "/admin/coupons" },
    { name: "Withdrawals", icon: DollarSign, path: "/admin/withdrawals" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F6] dark:bg-gray-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-white/10 flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/10">
          <Link href="/" className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <img src="/logo.png" className="h-6" alt="Logo" />
            Reskindev Admin
          </Link>
        </div>
        <div className="py-6">
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.name} 
                  href={item.path}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-semibold transition-colors ${
                    isActive 
                      ? "bg-[#E6F9F5] dark:bg-[#00C6A2]/10 text-[#00C6A2] border-r-4 border-[#00C6A2]" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon size={18} className={isActive ? "text-[#00C6A2]" : "text-gray-400"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex-1" />
          <div className="flex items-center gap-6">
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white">
              <Bell size={20} />
            </button>
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white">
              <ArrowLeft size={16} /> Back to Website
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
