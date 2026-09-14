"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Bell, Menu, LogOut, X, MessageSquare } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";

export default function Navbar() {
  const pathname = usePathname();
  const isFirstSnapshot = useRef(true);
  const { user, dbUser, loginWithGoogle, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    
    // Listen to Unread Chats
    const qChats = query(collection(db, "conversations"), where("participants", "array-contains", user.uid));
    const unsubChats = onSnapshot(qChats, (snap) => {
      let total = 0;
      snap.forEach(doc => {
        const data = doc.data();
        if (data.unreadCount && data.unreadCount[user.uid]) {
          total += data.unreadCount[user.uid];
        }
      });
      
      if (isFirstSnapshot.current) {
        isFirstSnapshot.current = false;
        setUnreadTotal(total);
      } else {
        setUnreadTotal(prev => {
          if (total > prev) {
            // New message received!
            try {
              const audio = new Audio('/notification.wav');
              audio.play().catch(e => console.log('Audio blocked by browser:', e));
              if (pathname !== '/inbox') {
                toast.success('New message received!', { icon: '💬' });
              }
            } catch(e) {
              console.error(e);
            }
          }
          return total;
        });
      }
    });

    // Listen to Notifications
    const qNotifs = query(collection(db, "notifications"), where("userId", "==", user.uid));
    const unsubNotifs = onSnapshot(qNotifs, (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
    });

    return () => {
      unsubChats();
      unsubNotifs();
    };
  }, [user]);

  const markAllRead = async () => {
    try {
      const unreadNotifs = notifications.filter(n => !n.read);
      for (const n of unreadNotifs) {
        await updateDoc(doc(db, "notifications", n.id), { read: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="h-[64px] bg-white/80 dark:bg-black/70 backdrop-blur-md border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
      <Link href="/" className="font-extrabold text-xl text-gray-900 dark:text-white flex items-center gap-2">
        <img src="/logo.png" className="h-7" alt="Logo" />
        reskindev
      </Link>
      
      {/* Desktop Nav Items */}
      <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
        <Link href="/account-delete" className="hover:text-green-600">account delete</Link>
        <Link href="/terms" className="hover:text-green-600">terms</Link>
        <Link href="/contact" className="hover:text-green-600">contact</Link>
        <Link href="/privacy-policy" className="hover:text-green-600">Privacy Policy</Link>
        <ThemeToggle />
        {user ? (
          <>
            {dbUser?.role === "admin" && (
              <Link href="/admin" className="bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-full hover:bg-gray-200 dark:bg-gray-700">Admin</Link>
            )}
            {dbUser?.role === "freelancer" && (
              <Link href="/freelancer" className="bg-[#00C6A2]/10 text-[#00C6A2] px-4 py-1.5 rounded-full hover:bg-[#00C6A2]/20 font-bold">Dashboard</Link>
            )}
            
            <div className="relative">
              <Link href="/inbox" className="text-gray-600 dark:text-gray-400 hover:text-black transition-colors relative">
                <MessageSquare size={20} />
                {unreadTotal > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-900 animate-pulse">
                    {unreadTotal}
                  </span>
                )}
              </Link>
            </div>

            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="text-gray-600 dark:text-gray-400 hover:text-black relative">
                <Bell size={20} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-900 animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <button onClick={markAllRead} className="text-xs text-[#00C6A2] font-semibold hover:underline">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-4 border-b border-gray-50 dark:border-white/5 flex gap-3 ${!n.read ? 'bg-orange-50 dark:bg-orange-900/10' : ''}`}>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 dark:text-gray-200">{n.message}</p>
                            <span className="text-[10px] text-gray-500 mt-1 block">
                              {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleDateString() : 'Just now'}
                            </span>
                          </div>
                          {!n.read && <div className="w-2 h-2 bg-orange-500 rounded-full mt-1 shrink-0"></div>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link href="/profile" className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 pl-2 pr-4 py-1 rounded-full cursor-pointer hover:bg-gray-200 dark:bg-gray-700">
              <img src={user.photoURL || "https://ui-avatars.com/api/?name=User"} className="w-6 h-6 rounded-full" alt="Avatar" />
              <span>{user.displayName || "User"}</span>
            </Link>
            <button onClick={logout} className="text-red-500 hover:text-red-700" title="Logout">
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <Link href="/login" className="bg-gray-900 text-white px-5 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors">
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Nav Button */}
      <div className="md:hidden flex items-center gap-4">
        <ThemeToggle />
        {user && (
           <Link href="/profile" className="flex items-center gap-2">
             <img src={user.photoURL || "https://ui-avatars.com/api/?name=User"} className="w-8 h-8 rounded-full border border-gray-200" alt="Avatar" />
           </Link>
        )}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 dark:text-gray-300">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-[64px] left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 shadow-xl md:hidden flex flex-col p-4 z-50">
          <Link href="/account-delete" className="py-3 border-b border-gray-50 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>account delete</Link>
          <Link href="/terms" className="py-3 border-b border-gray-50 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>terms</Link>
          <Link href="/contact" className="py-3 border-b border-gray-50 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>contact</Link>
          <Link href="/privacy-policy" className="py-3 border-b border-gray-50 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Privacy Policy</Link>
          
          {user ? (
            <div className="pt-4 flex flex-col gap-3">
              {dbUser?.role === "admin" && (
                <Link href="/admin" className="bg-gray-100 dark:bg-gray-800 text-center py-3 rounded-xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
              )}
              {dbUser?.role === "freelancer" && (
                <Link href="/freelancer" className="bg-[#00C6A2]/10 text-[#00C6A2] text-center py-3 rounded-xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>Seller Dashboard</Link>
              )}
              <Link href="/inbox" className="bg-gray-100 dark:bg-gray-800 text-center py-3 rounded-xl font-bold flex justify-center items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                Messages
                {unreadTotal > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadTotal}</span>}
              </Link>
              <Link href="/profile" className="bg-gray-900 text-white text-center py-3 rounded-xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-500 font-bold py-3 text-center border border-red-100 rounded-xl bg-red-50">Logout</button>
            </div>
          ) : (
            <div className="pt-4">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex justify-center">Sign In</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
