"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { User, ShoppingBag, Heart, Settings } from "lucide-react";

export default function ProfileLayout({ children }) {
  const { user, dbUser, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10 text-center mt-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">You need to sign in</h2>
          <p className="text-gray-500 dark:text-gray-400">Please click the Sign In button to view your profile.</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: "Overview", icon: User, path: "/profile" },
    { name: "My Orders", icon: ShoppingBag, path: "/profile/orders" },
    { name: "Saved Services", icon: Heart, path: "/profile/saved" },
    { name: "Settings", icon: Settings, path: "/profile/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F6] dark:bg-gray-950">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex flex-col items-center text-center">
              <img 
                src={user.photoURL || "https://ui-avatars.com/api/?name=User"} 
                className="w-20 h-20 rounded-full mb-3 object-cover border-4 border-gray-50 dark:border-gray-800" 
                alt="Avatar" 
              />
              <h2 className="font-bold text-gray-900 dark:text-white">{user.displayName || "Client User"}</h2>
              {dbUser?.username && (
                <p className="text-[11px] font-bold text-[#00C6A2] mb-1">@{dbUser.username}</p>
              )}
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4 truncate w-full">{user.email}</p>
              
              {dbUser?.role !== "admin" && (
                <button 
                  onClick={async () => {
                    const newRole = dbUser?.role === "buyer" ? "freelancer" : "buyer";
                    const confirmSwitch = window.confirm(`Switch to ${newRole} account?`);
                    if (!confirmSwitch) return;
                    try {
                      const { doc, updateDoc } = await import("firebase/firestore");
                      const { db } = await import("@/lib/firebase");
                      await updateDoc(doc(db, "users", user.uid), { role: newRole });
                      if (newRole === "freelancer") {
                        window.location.href = "/freelancer";
                      }
                    } catch(e) {
                      console.error(e);
                      alert("Failed to switch role");
                    }
                  }}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95"
                >
                  Switch to {dbUser?.role === "buyer" ? "Seller" : "Buyer"}
                </button>
              )}
            </div>
            
            <nav className="p-3 flex flex-col gap-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={item.name} 
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      isActive 
                        ? "bg-[#E6F9F5] dark:bg-[#00C6A2]/10 text-[#00C6A2]" 
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

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
