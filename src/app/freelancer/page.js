"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Plus, Edit2, List, DollarSign, CheckCircle2 } from "lucide-react";

export default function FreelancerDashboard() {
  const { user, dbUser, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ gigs: 0, orders: 0, earnings: 0 });

  useEffect(() => {
    if (!loading && (!user || dbUser?.role !== "freelancer")) {
      router.push("/");
    }
  }, [user, dbUser, loading, router]);

  useEffect(() => {
    if (!user) return;
    async function fetchStats() {
      try {
        // Fetch Platform Fee first
        const { doc, getDoc } = require("firebase/firestore");
        const settingsSnap = await getDoc(doc(db, "settings", "global"));
        const platformFeePercentage = settingsSnap.exists() ? (Number(settingsSnap.data().platformFee) || 10) : 10;

        const gigsQ = query(collection(db, "services"), where("authorId", "==", user.uid));
        const gigsSnap = await getDocs(gigsQ);
        const gigsCount = gigsSnap.size;

        const ordersQ = query(collection(db, "orders"), where("freelancerId", "==", user.uid));
        const ordersSnap = await getDocs(ordersQ);
        let completed = 0;
        let earnings = 0;
        
        ordersSnap.forEach(d => {
          const data = d.data();
          if (data.status === "completed") {
            completed++;
            const price = parseFloat(data.price) || 0;
            // Calculate what freelancer keeps: e.g. 100 - (100 * 10 / 100) = 90
            const freelancerShare = price - (price * (platformFeePercentage / 100));
            earnings += freelancerShare;
          }
        });

        setStats({ gigs: gigsCount, orders: completed, earnings: earnings.toFixed(2) });
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, [user]);

  if (loading || !user) return <div className="min-h-screen p-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">Seller Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user.displayName}</p>
          </div>
          <Link href="/freelancer/gigs/edit/new" className="bg-[#00C6A2] hover:bg-[#00b08f] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
            <Plus size={18} /> Create New Gig
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4"><List size={24} /></div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.gigs}</div>
            <div className="text-sm font-bold text-gray-500 uppercase">Active Gigs</div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-[#00C6A2]/20 text-[#00C6A2] rounded-full flex items-center justify-center mb-4"><Edit2 size={24} /></div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.orders}</div>
            <div className="text-sm font-bold text-gray-500 uppercase">Completed Orders</div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4"><DollarSign size={24} /></div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">${stats.earnings}</div>
            <div className="text-sm font-bold text-gray-500 uppercase">Total Earnings</div>
            <button className="mt-4 border border-gray-300 text-gray-700 px-4 py-1 rounded-full text-xs font-bold hover:bg-gray-100">Withdraw Funds</button>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">My Gigs</h2>
              <p className="text-gray-500 text-sm mb-6">Manage, edit, or delete the services you offer.</p>
            </div>
            <Link href="/freelancer/gigs" className="text-[#00C6A2] font-bold text-sm hover:underline flex items-center gap-2">
              <List size={16} /> Manage Services
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">My Orders</h2>
              <p className="text-gray-500 text-sm mb-6">View your assigned orders and update their delivery status.</p>
            </div>
            <Link href="/freelancer/orders" className="text-blue-500 font-bold text-sm hover:underline flex items-center gap-2">
              <CheckCircle2 size={16} /> Manage Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
