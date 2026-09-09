"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Bell, Menu, LogOut, X } from "lucide-react";

export default function Navbar() {
  const { user, dbUser, loginWithGoogle, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
      <Link href="/" className="font-extrabold text-xl text-gray-900 flex items-center gap-2">
        <img src="https://reskindev.com/favicon.png" className="h-7" alt="Logo" />
        reskindev
      </Link>
      
      {/* Desktop Nav Items */}
      <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
        <Link href="/account-delete" className="hover:text-green-600">account delete</Link>
        <Link href="/terms" className="hover:text-green-600">terms</Link>
        <Link href="/contact" className="hover:text-green-600">contact</Link>
        <Link href="/privacy-policy" className="hover:text-green-600">Privacy Policy</Link>
        
        {user ? (
          <>
            {dbUser?.role === "admin" && (
              <Link href="/admin" className="bg-gray-100 px-4 py-1.5 rounded-full hover:bg-gray-200">Admin</Link>
            )}
            
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="text-gray-600 hover:text-black">
                <Bell size={20} />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
                  <h3 className="font-bold text-gray-900 mb-2">Notifications</h3>
                  <div className="text-sm text-gray-500 py-4 text-center">No new notifications</div>
                </div>
              )}
            </div>

            <Link href="/profile" className="flex items-center gap-2 bg-gray-100 pl-2 pr-4 py-1 rounded-full cursor-pointer hover:bg-gray-200">
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
        {user && (
           <Link href="/profile" className="flex items-center gap-2">
             <img src={user.photoURL || "https://ui-avatars.com/api/?name=User"} className="w-8 h-8 rounded-full border border-gray-200" alt="Avatar" />
           </Link>
        )}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-[64px] left-0 w-full bg-white border-b border-gray-200 shadow-xl md:hidden flex flex-col p-4 z-50">
          <Link href="/account-delete" className="py-3 border-b border-gray-50 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>account delete</Link>
          <Link href="/terms" className="py-3 border-b border-gray-50 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>terms</Link>
          <Link href="/contact" className="py-3 border-b border-gray-50 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>contact</Link>
          <Link href="/privacy-policy" className="py-3 border-b border-gray-50 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Privacy Policy</Link>
          
          {user ? (
            <div className="pt-4 flex flex-col gap-3">
              {dbUser?.role === "admin" && (
                <Link href="/admin" className="bg-gray-100 text-center py-3 rounded-xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
              )}
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
