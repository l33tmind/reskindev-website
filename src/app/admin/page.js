"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DollarSign, ShoppingBag, Users } from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [ordersSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, "orders")),
          getDocs(collection(db, "users"))
        ]);

        let totalRevenue = 0;
        ordersSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.status === "completed") {
            totalRevenue += (data.price || 0);
          }
        });

        setStats({
          revenue: totalRevenue,
          orders: ordersSnap.size,
          users: usersSnap.size
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Dashboard Overview</h1>
      <p className="text-gray-500 mb-8 text-sm">Key metrics and analytics of your business.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
            <DollarSign size={20} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-1">${stats.revenue}</h2>
          <p className="text-sm font-semibold text-gray-400">Total Revenue</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <ShoppingBag size={20} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-1">{stats.orders}</h2>
          <p className="text-sm font-semibold text-gray-400">Total Orders</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
            <Users size={20} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-1">{stats.users}</h2>
          <p className="text-sm font-semibold text-gray-400">Active Users</p>
        </div>
      </div>

      {/* Chart Placeholder */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Overview</h2>
      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 h-80 flex items-end justify-around pb-8 relative">
        {/* Simple CSS bars for demo purposes to match screenshot */}
        <div className="absolute top-10 left-10 right-10 flex flex-col justify-between h-[200px] pointer-events-none">
          <div className="border-b border-dashed border-gray-200"></div>
          <div className="border-b border-dashed border-gray-200"></div>
          <div className="border-b border-dashed border-gray-200"></div>
          <div className="border-b border-dashed border-gray-200"></div>
          <div className="border-b border-dashed border-gray-200"></div>
        </div>
        
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-4 bg-[#00C6A2] rounded-t-sm h-[60px]"></div>
          <span className="text-xs text-gray-400 font-semibold">M1</span>
        </div>
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-4 bg-[#00C6A2] rounded-t-sm h-[120px]"></div>
          <span className="text-xs text-gray-400 font-semibold">M2</span>
        </div>
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-4 bg-[#00C6A2] rounded-t-sm h-[90px]"></div>
          <span className="text-xs text-gray-400 font-semibold">M3</span>
        </div>
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-4 bg-[#00C6A2] rounded-t-sm h-[160px]"></div>
          <span className="text-xs text-gray-400 font-semibold">M4</span>
        </div>
      </div>
    </div>
  );
}
