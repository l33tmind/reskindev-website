"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { User, ShoppingBag, Heart, Settings } from "lucide-react";

export default function ProfileLayout({ children }) {
  const { user, dbUser, loading } = useAuth();
  const pathname = usePathname();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);


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
                  onClick={() => setShowRoleModal(true)}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow-md"
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

      {/* Role Switch Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#00C6A2]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#00C6A2]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            
            <h3 className="text-xl font-black text-center mb-2">
              Switch to {dbUser?.role === "buyer" ? "Seller" : "Buyer"} Account
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              You will be redirected to your {dbUser?.role === "buyer" ? "freelancer dashboard" : "buyer profile"}.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowRoleModal(false)}
                disabled={switchingRole}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setSwitchingRole(true);
                  const newRole = dbUser?.role === "buyer" ? "freelancer" : "buyer";
                  try {
                    const { doc, updateDoc } = await import("firebase/firestore");
                    const { db } = await import("@/lib/firebase");
                    await updateDoc(doc(db, "users", user.uid), { role: newRole });
                    
                    // Artificial delay for smooth loading UX
                    setTimeout(() => {
                      if (newRole === "freelancer") {
                        window.location.href = "/freelancer";
                      } else {
                        window.location.href = "/profile";
                      }
                    }, 800);
                  } catch(e) {
                    console.error(e);
                    alert("Failed to switch role");
                    setSwitchingRole(false);
                    setShowRoleModal(false);
                  }
                }}
                disabled={switchingRole}
                className="flex-1 py-3 bg-[#00C6A2] hover:bg-[#00b08f] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-80 neon-glow"
              >
                {switchingRole ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Switching...
                  </>
                ) : (
                  "Yes, Switch"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

